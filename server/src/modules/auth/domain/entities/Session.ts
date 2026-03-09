export interface SessionProps {
  userId: string;
  refreshToken: string;
  fingerprint: string; // Ключ идентификации устройства
  userAgent?: string; // "Mozilla/5.0 (iPhone; CPU iPhone OS...)"
  ip?: string;
  expiresAt: Date;
  lastActiveAt: Date; // дата последней активности
}

export class Session {
  constructor(
    public readonly id: string,
    public readonly props: SessionProps,
  ) {}

  // "Жесткая" проверка срока годности (для TTL в базе)
  public isExpired(): boolean {
    return this.props.expiresAt < new Date();
  }

  /**
   * Полная ротация (при логине или смене токена)
   * Обновление токена и активности
   */
  public rotateToken(newToken: string, newExpiry: Date): void {
    this.props.refreshToken = newToken;
    this.props.expiresAt = newExpiry;
    this.props.lastActiveAt = new Date();
  }

  // Проверка: был ли пользователь активен в течение последних X дней
  /**
   * Бизнес-проверка активности.
   * Сессия активна, если она не истекла окончательно И пользователь
   * проявлял активность в заданный период.
   */
  public isActive(maxInactivityDays: number = 7): boolean {
    if (this.isExpired()) return false;

    const now = new Date();
    const lastActive = this.props.lastActiveAt.getTime();
    const diffInDays = (now.getTime() - lastActive) / (1000 * 60 * 60 * 24);

    return diffInDays <= maxInactivityDays;
  }

  /**
   * "Тихое" продление активности (Sliding Window)
   * Обновляет время последней активности и сдвигает TTL в базе.
   */
  public markAsActive(postponeMs: number | undefined = 7 * 24 * 60 * 60 * 1000): void {
    this.props.lastActiveAt = new Date();
    // Мы также отодвигаем expiresAt, чтобы сессия не удалилась по TTL индексу
    this.props.expiresAt = new Date(Date.now() + postponeMs); // +7 дней от текущего момента
  }
}
