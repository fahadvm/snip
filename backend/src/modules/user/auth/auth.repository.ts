import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from 'src/schemas/user.schema';
import { IUserRepository } from './interfaces/auth.repository.interface';

@Injectable()
export class UserRepository  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}