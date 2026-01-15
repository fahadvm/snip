import { Model } from 'mongoose';
import { IBaseRepository } from './base.repository.interface';

export abstract class BaseRepository<T>
  implements IBaseRepository<T>
{
  constructor(protected readonly model: Model<T>) {}

  create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  findOne(filter: Partial<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  find(filter: Partial<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  update(
    filter: Partial<T>,
    update: Partial<T>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
    }).exec();
  }

  delete(filter: Partial<T>): Promise<void> {
    return this.model.deleteOne(filter).then(() => undefined);
  }

  deleteMany(filter: Partial<T>): Promise<void> {
    return this.model.deleteMany(filter).then(() => undefined);
  }

  exists(filter: Partial<T>): Promise<boolean> {
    return this.model.exists(filter).then(Boolean);
  }
}
