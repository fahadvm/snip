export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;

  findOne(filter: Partial<T>): Promise<T | null>;

  findById(id: string): Promise<T | null>;

  find(filter?: Partial<T>): Promise<T[]>;

  update(
    filter: Partial<T>,
    update: Partial<T>,
  ): Promise<T | null>;

  delete(filter: Partial<T>): Promise<void>;

  deleteMany(filter: Partial<T>): Promise<void>;

  exists(filter: Partial<T>): Promise<boolean>;
}
