import { AuthResult, LoginDto, RegisterDto } from '@entities/session/api/auth.dto';
import { AuthInitResponseDto, AuthService } from '@entities/session/api/auth.service';
import { OwnerId } from '@entities/word/model/vo';
import { FingerprintService, TokenService } from '@shared/api/auth';
import { AuthStatusProvider } from '@shared/lib/auth/auth-status.provider';
import { LoggerService } from '@shared/lib/logger/logger.service';

import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, tap } from 'rxjs';

// export interface SessionState {
//   ownerId: OwnerId | null;
//   isInitialized: boolean;
// }

@Injectable({ providedIn: 'root' })
export class SessionFacade implements AuthStatusProvider {
  private loggerService = inject(LoggerService);

  private readonly _currentOwner$ = new BehaviorSubject<OwnerId | null>(null);
  public readonly currentOwner$ = this._currentOwner$.asObservable();

  // TODO заменить сигналами ???
  /** private currentUserSignal = signal<OwnerId | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();*/
  // Вычисляемое состояние
  /** readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.role || EUserRole.GUEST); */

  // Метод для получения ID без подписки (для синхронных проверок в коде)
  get snapshot(): OwnerId | null {
    return this._currentOwner$.value || null;
  }

  getOwnerId(): string | null {
    return this._currentOwner$.value?.value || null;
  }

  isAuthenticated(): boolean {
    return !!this._currentOwner$.value;
  }

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

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private fpService: FingerprintService,
    private router: Router,
  ) {}

  /**
   * Инициализация сессии
   * Берет fingerprint и передает на сервер.
   * Сервер возвращает ownerId (userId или guestId)
   **/
  async initializeSession(): Promise<void> {
    // TODO то что СЕЙЧАС в APP_INITIALISE
    // 1. Сначала ЖДЕМ получения фингерпринта
    // Это гарантирует, что сигнал в FingerprintService обновится ДО запроса
    const fingerprint = await this.getFingerprint();

    try {
      // 2. Делаем запрос на инициализацию.
      // Благодаря inject(FingerprintService) в интерцепторе,
      // заголовок X-Fingerprint теперь точно будет в запросе.
      const session = await firstValueFrom(
        this.authService.initSession(fingerprint).pipe(
          tap((res) => {
            if (res.accessToken) this.tokenService.setAccessToken(res.accessToken);
          }),
        ),
      );

      // 3. Если успех — сохраняем сессию в localStorage для будущего оффлайна
      this.persistSession(session);

      this.loggerService.log('session', JSON.stringify(session, null, 2));
      // 4. Устанавливаем OwnerId на основе ответа (DTO -> Domain Entity)
      // const owner = session.actor.role === 'guest' ? OwnerId.guest(session.actor.id) : OwnerId.user(session.actor.id);
      const owner = this.mapToOwner(session);
      this.loggerService.log(owner.kind, owner.value);

      /** if (data.limits) {
        TODO create service - this.limitsService.setLimits(data.limits);
      } */

      this._currentOwner$.next(owner);
    } catch (error) {
      console.error('Session initialization failed', error);
      console.warn('Network error during init, trying to restore from cache', error);

      // 3. Если сети нет — достаем последнюю известную сессию
      const cachedSession = this.getPersistedSession();

      if (cachedSession) {
        this._currentOwner$.next(this.mapToOwner(cachedSession));
      } else {
        // 4. Если даже кэша нет (первый запуск оффлайн),
        // создаем стабильный GuestId на основе фингерпринта.
        this._currentOwner$.next(OwnerId.guest(`guest_${fingerprint.slice(0, 8)}`));
      }

      // В случае ошибки можно установить фолбек-значение
      // this._currentOwner$.next(OwnerId.guest('offline_temporary'));
    }
  }

  async register(credentials: RegisterDto): Promise<void> {
    try {
      const response = await firstValueFrom(this.authService.register(credentials));

      if (response.accessToken) this.tokenService.setAccessToken(response.accessToken);

      const userOwner = OwnerId.user(response.userId!);
      this._currentOwner$.next(userOwner);

      // 3. Редирект в админку (альтернатива)
      this.router.navigate(['/dashboard']);
      /** redirect to the link that was remembered when logout process executed.
       *  It is returning customer to the same link before logout process. */
      // TODO navigate to success page ?????
      // this.router.navigate(['/auth/success-register'], {
      //   queryParams: {
      //     email: result.email,
      //     name: result.name,
      //     firstName: result.name.firstName,
      //     lastName: result.name.lastName,
      //   },
      // });
    } catch (e) {
      console.error('Register error:', e); // TODO нужно ли разделять ошибки???
      throw new Error('Register failed. Please try again.');
    }
  }

  async login(credentials: LoginDto): Promise<void> {
    try {
      // const response = await firstValueFrom(
      const response: AuthResult = await firstValueFrom(this.authService.login(credentials));

      // TODO нужен ли при логине refresh token в ответе ?????
      if (response.accessToken) this.tokenService.setAccessToken(response.accessToken);

      const userOwner = OwnerId.user(response.user.id);
      this._currentOwner$.next(userOwner);

      /** redirect to the link that was remembered when logout process executed.
       *  It is returning customer to the same link before logout process. */
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
    } catch (e) {
      this.loggerService.error('Login error:', e); // TODO нужно ли разделять ошибки???
      throw new Error('Login failed. Please try again.');
    }
  }

  /**
   * Завершение сессии
   */
  async logout(): Promise<void> {
    // 1. Очищаем локальное хранилище (токены и т.д.)
    this.tokenService.clearAccessToken();

    // 2. Уведомляем всё приложение о смене владельца
    this._currentOwner$.next(null);

    await firstValueFrom(this.authService.logout());

    // После логаута мы снова можем стать гостем (или редирект на логин)
    this.initializeSession(); // Переинициализация сессии для получения guestId

    // this.router.navigate(['/auth/login']);
  }

  private async getFingerprint(): Promise<string> {
    return await this.fpService.identify();
  }

  private persistSession(session: AuthInitResponseDto): void {
    localStorage.setItem('last_session', JSON.stringify(session));
  }

  private mapToOwner(session: AuthInitResponseDto): OwnerId {
    this.loggerService.log('mapToOwner', session);
    return session.actor.role === 'guest' ? OwnerId.guest(session.actor.id) : OwnerId.user(session.actor.id);
  }

  private getPersistedSession(): AuthInitResponseDto | null {
    const data = localStorage.getItem('last_session');
    return data ? JSON.parse(data) : null;
  }
}
