import { z } from 'zod';

import { userSettingsSchema } from '@core/domain/entities';

/** It must be matched with ISettings interface
 *  It is the source for database properties */

export type UserSettings = z.infer<typeof userSettingsSchema>;
