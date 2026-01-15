import { IBaseRepository } from 'src/common/repositories/base.repository.interface';
import { User } from 'src/schemas/user.schema';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}