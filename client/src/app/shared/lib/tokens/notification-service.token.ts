import { INotificationService } from '@shared/lib/notification-service.interface';

import { InjectionToken } from '@angular/core';

export const NOTIFICATION_SERVICE_TOKEN = new InjectionToken<INotificationService>('NOTIFICATION_SERVICE');
