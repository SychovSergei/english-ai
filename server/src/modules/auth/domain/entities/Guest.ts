import { EUserRole } from '@core/domain/enums';
import { EGuestRole } from '../../../../core/domain/enums/user-roles.enum';

export interface GuestProps {
  fingerprint: string;
  ip?: string;
  createdAt?: Date;
}

export class Guest {
  public readonly id: string;
  public readonly fingerprint: string;
  public readonly role = EGuestRole.GUEST;
  public readonly createdAt: Date;
  public readonly ip?: string; // Добавь это поле в класс

  constructor(props: GuestProps, id: string) {
    this.id = id;
    this.ip = props.ip;
    this.fingerprint = props.fingerprint;
    this.createdAt = props.createdAt || new Date();
  }
}
