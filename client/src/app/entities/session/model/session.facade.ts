import {
  AuthData,
  AuthInitData,
  AuthService,
  FingerprintService,
  LoginPayload,
  RegisterPayload,
  TokenService,
} from '@entities/session';
import { EGuestRole, UserRole } from '@shared/enums';
import { ApiErrorInterface, CustomHttpErrorResponse } from '@shared/errors';
import { AuthOwner, AuthStatusProvider, OwnerId } from '@shared/lib';
import { LoggerService } from '@shared/lib/logger';

import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionFacade implements AuthStatusProvider {
  private router = inject(Router);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private fpService = inject(FingerprintService);
  // private syncManager = inject(SyncManagerService);
  private loggerService = inject(LoggerService).createLogger('SessionFacade');

  private readonly _currentOwner$ = new BehaviorSubject<OwnerId | null>(null);
  /**
   * Реализация интерфейса. TypeScript позволит это, так как
   * OwnerId расширяет AuthOwner.
   */
  public readonly currentOwner$: Observable<AuthOwner | null> = this._currentOwner$.asObservable();

  isAuthenticated(): boolean {
    // Проверяем, что это не просто owner, а именно USER
    // return !!this._currentOwner$.value;
    return this._currentOwner$.value?.kind === 'user';
  }

  getOwnerId(): string | null {
    return this._currentOwner$.value?.value || null;
  }

  // Метод для получения ID без подписки (для синхронных проверок в коде)
  get snapshot(): OwnerId | null {
    return this._currentOwner$.value || null;
  }

  // TODO заменить сигналами ???
  /** private currentUserSignal = signal<OwnerId | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();*/
  // Вычисляемое состояние
  /** readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.role || EUserRole.GUEST); */

  // readonly usrRole = this._currentOwner$.value?.value;

  // recommend for templates
  public readonly ownerSignal = toSignal(this._currentOwner$);

  public redirectUrl: string | null = null; // TODO setter and getter ???

  // private state$ = new BehaviorSubject<SessionState>({
  //   ownerId: null,
  //   isInitialized: false,
  // });
  // public readonly ownerId$ = this.state$.pipe(map((s) => s.ownerId));
  // public readonly isInitialized$ = this.state$.pipe(map((s) => s.isInitialized)); //

  constructor() {}

  /**
   * Инициализация сессии (вызывается при старте приложения, APP_INITIALISE)
   * Берет fingerprint и передает на сервер.
   * Сервер возвращает ownerId (userId или guestId)
   **/
  async initializeSession(): Promise<void> {
    // 1. Сначала ЖДЕМ получения фингерпринта
    // Это гарантирует, что сигнал в FingerprintService обновится ДО запроса
    const fingerprint = await this.getFingerprint();

    try {
      // 2. Делаем запрос на инициализацию.
      // Благодаря inject(FingerprintService) в интерцепторе, заголовок X-Fingerprint теперь точно будет в запросе.
      const session = await firstValueFrom(
        this.authService.initSession(fingerprint).pipe(
          tap((res) => {
            if (res.accessToken) this.tokenService.setAccessToken(res.accessToken);
          }),
        ),
      );

      // 3. Если успех — сохраняем сессию в localStorage для будущего оффлайна
      this.persistSession(session);

      /** this.loggerService.log('session', JSON.stringify(session, null, 2));*/
      // 4. Устанавливаем OwnerId на основе ответа (DTO -> Domain Entity)
      const owner = this.mapToOwner(session);
      this.loggerService.log(owner.kind, owner.value);

      /** if (data.limits) {
        TODO create service - this.limitsService.setLimits(data.limits);
      } */
      this._currentOwner$.next(owner);

      // 🚀 Если мы онлайн и получили сессию — запускаем общую синхронизацию
      // this.syncManager.runSync();
    } catch (error: unknown | CustomHttpErrorResponse<ApiErrorInterface<undefined>>) {
      console.error('Session initialization failed', error);
      console.warn('Network error during init, trying to restore from cache', error);

      this.handleInitError(fingerprint, error);

      // В случае ошибки можно установить фолбек-значение
      // this._currentOwner$.next(OwnerId.guest('offline_temporary'));
    }
  }

  async register(registerPayload: RegisterPayload): Promise<void> {
    try {
      const response = await firstValueFrom(this.authService.register(registerPayload));

      this.router.navigate(['/auth/success-register'], {
        state: {
          email: response.email,
          fullName: `${response.name.firstName} ${response.name.lastName}`,
        },
      });
    } catch (e) {
      console.error('Register error:', e); // TODO нужно ли разделять ошибки???
      throw new Error('Register failed. Please try again.');
    }
  }

  async login(loginPayload: LoginPayload): Promise<void> {
    try {
      const response: AuthData = await firstValueFrom(this.authService.login(loginPayload));

      if (response.accessToken) this.tokenService.setAccessToken(response.accessToken);

      const userOwner = OwnerId.user(response.user.id, response.user.role);

      this._currentOwner$.next(userOwner); // Триггер для SyncManager

      // 🚀 После логина ВАЖНО запустить синхронизацию,
      // чтобы подтянуть слова пользователя с сервера в IndexedDB
      // Этот процесс запускается в SyncManager автоматически при подписке на изменение currentOwner

      this.navigateAfterAuth();
    } catch (e) {
      this.loggerService.error('Login error:', e); // TODO нужно ли разделять ошибки???
      throw new Error('Login failed. Please try again.');
    }
  }

  private handleInitError(
    fingerprint: string,
    error: unknown | CustomHttpErrorResponse<ApiErrorInterface<undefined>>,
  ): void {
    this.loggerService.log('handleInitError', error);

    // 3. Если сети нет — достаем последнюю известную сессию
    const cachedSession = this.getPersistedSession();

    if (cachedSession) {
      this._currentOwner$.next(this.mapToOwner(cachedSession));
    } else {
      // 4. Если даже кэша нет (первый запуск оффлайн),
      // создаем стабильный GuestId на основе фингерпринта.
      const stableGuestId = `guest_${fingerprint}`.padEnd(32, '0').slice(0, 32);
      this._currentOwner$.next(OwnerId.guest(`guest_${stableGuestId}`));
    }

    // В оффлайне синхронизацию не зовем
  }

  /** redirect to the link that was remembered when logout process executed.
   *  It is returning customer to the same link before logout process. */
  private navigateAfterAuth(): void {
    if (this.redirectUrl) {
      const redirectUrl = this.redirectUrl;
      this.redirectUrl = null;
      this.router.navigateByUrl(redirectUrl);
    } else {
      this.loggerService.log(`this.router.navigate([['words', 'word-sets']])`);
      // this.router.navigate(['words', 'word-set', 'create']); // TODO create default route token
      this.router.navigate(['words', 'my-words']);
    }
    // 3. Редирект в админку (альтернатива)
    // this.router.navigate(['/dashboard']);
  }

  /**
   * Завершение сессии
   */
  public async logout(): Promise<void> {
    // 1. Очищаем локальное хранилище (токены и т.д.)
    this.tokenService.clearAccessToken();

    // 2. Уведомляем всё приложение о смене владельца
    // Сначала зануляем, чтобы фасады (Word, User) очистили стейт
    this._currentOwner$.next(null);
    try {
      await firstValueFrom(this.authService.logout());
    } finally {
      // В любом случае переинициализируем как гостя
      await this.initializeSession(); // Переинициализация сессии для получения guestId
    }
    // После логаута мы снова можем стать гостем (или редирект на логин)
    // this.router.navigate(['/auth/login']);
  }

  private async getFingerprint(): Promise<string> {
    return await this.fpService.identify();
  }

  private persistSession(session: AuthInitData): void {
    localStorage.setItem('last_session', JSON.stringify(session));
  }

  private mapToOwner(session: AuthInitData): OwnerId {
    this.loggerService.log('mapToOwner', session);
    const { id, role } = session.actor;

    if (role === EGuestRole.GUEST) {
      return OwnerId.guest(id);
    }

    return OwnerId.user(id, role as UserRole);
  }

  private getPersistedSession(): AuthInitData | null {
    const data = localStorage.getItem('last_session');
    return data ? JSON.parse(data) : null;
  }
}
