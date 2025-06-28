import { NotificationService } from '@shared/services/notification/notification.service';
import { NOTIFICATION_SERVICE_TOKEN } from '@shared/services/notification/notification-service.token';

import { NgModule } from '@angular/core';

NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [{ provide: NOTIFICATION_SERVICE_TOKEN, useClass: NotificationService }],
});
export class SharedModule {}
