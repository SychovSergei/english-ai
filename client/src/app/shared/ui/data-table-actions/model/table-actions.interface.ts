// import { IIconType } from '@features/icons/create-icon/services/icon-factory.service';

import { IIconType } from '@shared/ui/icon-factory';

export interface ITableActions {
  id: string | number;
  label: string;
  iconType: IIconType; // Material | FontAwesome | Custom
  icon: string;
  cbFunction: () => void;
}
