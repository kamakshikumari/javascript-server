import * as mongoose from 'mongoose';
import { DocumentQuery, Query } from 'mongoose';
import * as bcrypt from 'bcrypt';
export default class VersionableRepository<D extends mongoose.Document, M extends mongoose.Model<D>> {
    private model: M;
    constructor(model) {
        this.model = model;
    }

    public static generateObjectId(): string {
        return String(mongoose.Types.ObjectId());
    }

    public count(query: any): Query<number> {
        const finalQuery = { deletedAt: undefined, ...query };
        return this.model.countDocuments(finalQuery);
    }

    public findOne(query) {
        return this.model.findOne(query).lean();
    }

    public searchUser(query = {}): DocumentQuery<D[], D> {
        return this.model.find(query);
    }

    public getUser(data: any) {
      return this.model.findOne(data);
    }

    public getAll(query: any, projection: any = {}, options: any = {}): DocumentQuery<D[], D> {
      const finalQuery = { deletedAt: undefined, ...query };
      return this.model.find(finalQuery, projection, options);
    }

    public async create(data: any, creator): Promise<D> {
        const id = VersionableRepository.generateObjectId();

        const model = {
          ...data,
            _id: id,
            originalId: id,
            createdBy: creator,
            createdAt: Date.now(),


        };
        return await this.model.create(model);
      }

    public async update(id: string, dataToUpdate: any, updator) {
        let originalData;
        const resp = await this.findOne({ originalId: id, updatedAt: undefined, deletedAt: undefined })
                if (resp === null) {
                    throw undefined;
                }
                originalData = resp;
                const newId = VersionableRepository.generateObjectId();
                const oldId = originalData._id;
                const oldModel = {
                    ...originalData,
                    updatedAt: Date.now(),
                    updatedBy: updator,
                    deletedAt: Date.now(),
                    deletedBy: updator,
                };

                const newData = Object.assign(JSON.parse(JSON.stringify(originalData)), dataToUpdate);

                newData._id = newId;
                newData.createdAt = Date.now();

                const up = await this.model.updateOne({ _id: oldId }, oldModel)
                    .then((res) => {
                        if (res === null) {
                            throw undefined;
                        }
                    })
                    .catch((err) => {
                        console.log('Error: ', err);
                    });
                    console.log('upd', up);

             const a = await this.model.create(newData);
             return a
    }

    public async delete(id: string, remover: string) {
        let originalData;
        const resp = await this.findOne({ originalId: id, deletedAt: undefined })
            if (resp === null) {
                    throw undefined;
                }
                originalData = resp;
                const oldId = originalData._id;
                const modelDelete = {
                    ...originalData,
                    deletedAt: Date.now(),
                    deletedBy: remover,
                };
                this.model.updateOne({ _id: oldId }, modelDelete)
                    .then((res) => {
                        console.log('res null', res)
                        if (res === null) {
                            throw undefined;
                        }
                        // return res
                    })
                    .catch((err) => {
                        console.log('Error: ', err);
                    });
    }
}
