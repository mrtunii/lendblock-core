import { BaseEntity } from '../../shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

// @Entity('loans')
export class LoanEntity extends BaseEntity {
  constructor(partial: Partial<LoanEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @Column({
    type: 'numeric',
    nullable: false,
  })
  collateralAmount: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  collateralToken: string;

  @Column({
    type: 'numeric',
    nullable: false,
  })
  loanAmount: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  loanToken: string;

  @Column({
    type: 'numeric',
    nullable: false,
  })
  loanInterestRate: number;
}
