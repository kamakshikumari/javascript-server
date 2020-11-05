import * as mongoose from 'mongoose';
import  {userModel } from './UserModel';
import IUserModel from './IUserModel';


export default class UserRepository {

  public static generateObjectId() {
    return String(mongoose.Types.ObjectId());
  }

  public findone(query): mongoose.DocumentQuery<IUserModel, IUserModel, {} > {
    return userModel.findOne(query).lean();
  }

  public find(query, projection ?: any, options ?: any): any {
    return userModel.find(query, projection, options);
  }

  public create(data: any): Promise<IUserModel> {
    console.log('UserReposistory:: create', data);
    const id = UserRepository.generateObjectId();
    const model = new userModel({
      _id: id,
      ...data,
    });
    return model.save();
  }

  public update(data: any): Promise<IUserModel> {
    console.log('UserReposistory:: update', data);
    return userModel.update(data);
  }

  public count(){
    return userModel.countDocuments();
  }
}
