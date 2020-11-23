import * as mongoose from 'mongoose';
import { DocumentQuery, Query } from 'mongoose';

export default class VersionableRepository<D extends mongoose.Document, M extends mongoose.Model<D>> {
    private model: M;
    constructor(model) {
        this.model = model;
    }

    public static generateObjectId(): string {
        return String(mongoose.Types.ObjectId());
    }

    public count(): mongoose.Query<number> {
      return this.model.countDocuments();
    }
    public findOne(query) {
        return this.model.findOne(query).lean();
    }
    protected find(query = {}): DocumentQuery<D[], D> {
        return this.model.find(query);
    }


    public async create(options): Promise<D> {
        const id = VersionableRepository.generateObjectId();

        return await this.model.create ({
            _id: id,
            originalId: id,
            createdBy: options.id,
            createdAt: Date.now(),
            ...options,

        });
    }

    public async get(skip, limit, sortBy) {
      return await this.model.find({ deletedAt: undefined }).limit(limit).skip(skip).sort(sortBy);
    }

    public async update(id, data) {
      const record = await this.findOne(id);
      await this.delete(id);
      await this.create({
        ...record,
        ...data,
        updatedAt: new Date(),
        deletedAt: undefined
      });
    }
    public async delete(id) {
      return await this.model.update({ originalId: id, deletedAt: null }, { deletedAt: new Date()  });
    }
}
