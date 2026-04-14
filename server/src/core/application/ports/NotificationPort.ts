export interface NotificationPort {
  send(params: { userId: string; message: string; type?: 'success' | 'error' | 'warning' | 'info' }): Promise<void>;
}
