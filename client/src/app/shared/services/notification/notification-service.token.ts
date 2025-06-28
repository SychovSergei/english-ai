import { INotificationService } from '@shared/services/notification/notification.interface';

import { InjectionToken } from '@angular/core';

export const NOTIFICATION_SERVICE_TOKEN = new InjectionToken<INotificationService>('NOTIFICATION_SERVICE');
