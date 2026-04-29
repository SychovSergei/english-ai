import { AuthOwner } from '@shared/lib/auth/auth-owner.interface';

import { Observable } from 'rxjs';

/**
 * Абстрактный провайдер статуса авторизации.
 * Используется для изоляции слоя Shared от доменной логики сессии.
 */
export abstract class AuthStatusProvider {
  /** Реактивный поток для UI */
  abstract readonly currentOwner$: Observable<AuthOwner | null>;

  /** Синхронная проверка для гвардов */
  abstract isAuthenticated(): boolean;

  /** Получение ID текущего актора */
  abstract getOwnerId(): string | null;
}
