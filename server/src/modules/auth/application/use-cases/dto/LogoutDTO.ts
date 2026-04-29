export interface LogoutDTO {
  userId: string; // Дополнительная проверка безопасности
  refreshToken: string; // Нам нужно знать, какую именно сессию закрыть
}
