import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string, withPassword = false): Promise<User> {
    let queryBuilder = this.userRepository
      .createQueryBuilder()
      .where('username = :username', { username });

    if (withPassword) {
      queryBuilder = queryBuilder.addSelect('User.password');
    }

    return await queryBuilder.getOne();
  }

  async create(data: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(data);

    return await this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneByOrFail({
      id: id,
    });
  }

  async getOthers(id: number): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        id: Not(id),
      },
    });
  }
}
