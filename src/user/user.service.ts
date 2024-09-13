import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async upsert(user: UserDto): Promise<UserDto> {
    const userEntity = await this.findByWalletAddress(user.walletAddress);
    if (userEntity) {
      return userEntity;
    }
    return await this._userRepository.save(user);
  }

  async findByWalletAddress(walletAddress: string): Promise<UserDto | null> {
    return await this._userRepository.findOne({ where: { walletAddress } });
  }
}
