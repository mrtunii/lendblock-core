import { BaseEntity } from '../../shared/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity('users')
export class UserEntity extends BaseEntity {
  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }

  @AutoMap()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  walletAddress: string;
}
