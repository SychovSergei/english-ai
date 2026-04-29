import { NotificationPort } from '@core/application/ports/NotificationPort';

export class NotificationService implements NotificationPort {
  async send(params: {
    userId: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }): Promise<void> {
    // Пример – отправить по WebSocket
    // (конкретное API зависит от реализации)
    console.log(`Notify user ${params.userId}: ${params.message}`);

    // Или: await emailService.send(...)
    // Или: await webSocketGateway.sendToUser(params.userId, params.message)
    // Или: await pushService.send(...)
  }
}
