import { AutoMap } from '@automapper/classes';

export class UserDto {
  @AutoMap()
  id?: string | null;

  @AutoMap()
  walletAddress: string;
}
