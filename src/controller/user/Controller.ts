import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import UserRepository from '../../repositories/user/UserRepository';
import { config } from '../../config';
import IRequest from '../../IRequest';

class UserController {
public async getAll(req: Request, res: Response, next: NextFunction) {
  const user = new UserRepository();
  try {
      const result = await user.getAllUser({ });
      {
        if (result === null) {
          throw undefined;
      }
       res.status(200).send({
         message: 'User Fetched successfully',
         result,
         code: 200
      });
    }
    } catch (err) {
      console.log(err);
      res.send({
        error: 'User not found',
        code: 500
      });
    }
  }


// To create a new user

public async create(req: IRequest, res: Response, next: NextFunction) {
  const { id, email, name, role, password } = req.body;
  const creator = req.userData._id;
  const user = new UserRepository();
  try {
    const result = await user.createUser({id, email, name, role, password }, creator);
    console.log(req.body);
    res.send({
      status: 'ok',
      message: 'User Created Successfully!',
      result: {
        'id': id,
        'name': name,
        'email': email,
        'role': role,
        'password': password
      },
    });
  }
  catch (err) {
    console.log(err);
    res.send({
      error: 'Value is not given properly',
      code: 500
    });
  }
}

// To update the existing user data

public async update(req: IRequest, res: Response, next: NextFunction) {
  const { id, dataToUpdate } = req.body;
  console.log('id', id);
  console.log('dataToUpdate', dataToUpdate);
  const updator = req.userData._id;
  const user = new UserRepository();
  try {
    const result = await user.updateUser( id, dataToUpdate, updator);
    res.send({
      status: 'ok',
      message: 'User Updated Successfully',
      data: result,

    });
  }
  catch (err) {
    res.send({
      error: 'User not found for update',
      code: 404
    });
  }
}

// To delete the existing User

public async delete(req: IRequest, res: Response, next: NextFunction) {
  const  id  = req.params.id;
  const remover = req.userData._id;
  const user = new UserRepository();
  try {
     await user.deleteData(id, remover);
     res.send({
       status: 'ok',
       message: 'User Deleted successfully',
      });
    }
    catch (err) {
      res.send({
        message: 'User not found to be deleted',
        code: 404
      });
    }
  }

  // To fetch the authorization token
//   public async login(req: IRequest, res: Response, next: NextFunction) {
//     const { email } = req.body;
//     console.log('Inside User Controller login ');
//     const user = new UserRepository();
//     try {
//       const userData = await user.getUser({ email });
//       if (userData === null) {
//         res.status(404).send({
//         err: 'User Not Found',
//         code: 404
//       });
//       return;
//     }
//     const { password } = userData;
//     if (!bcrypt.comparesync(req.body.password, password)) {
//       res.status(401).send({
//         err: 'Invalid Password',
//         code: 401
//       });
//       return;
//     }
//     const token = jwt.sign(userData.toJSON(), config.key, {
//       expiresIn: Math.floor(Date.now() / 1000) + ( 15 * 60),
//     });
//     res.send({
//       message: 'Login Successfull',
//       status: 200,
//       'token': token
//     });
//     return;

// }
// catch (err) {
//   console.log(err);
//     res.send({
//       error: 'Value is not given properly',
//       code: 500
//     });
//   }
// }

  // To fetch the current user
  public async login(req: IRequest, res: Response, next: NextFunction) {
    const { email } = req.body;
    const user = new UserRepository();
    try {
      const userData = await user.getUser({ email });
      if (userData === null) {
        res.status(404).send({
          err: 'User Not Found',
          code: 404
        });
        return;
      }
      const { password } = userData;
      if (password !== req.body.password) {
        res.status(401).send({
          err: 'Invalid Password',
          code: 401
        });
        return;
      }
      const token = jwt.sign(userData.toJSON(), config.key);
      res.send({
        status: 'ok',
        message: 'Authorization Token',
        'token': token
      });
      return;
      }
      catch (err) {
        res.send({
          error: 'User Not login',
          code: 404
        });
      }
    }


  public async me(req: IRequest, res: Response, next: NextFunction) {
  const id = req.query;
  const user = new UserRepository();
  try {
    const data = await user.getUser( id );
    res.status(200).send({
      status: 'ok',
      message: 'Me',
      'data':  data ,
    });
  } catch (err) {
    console.log(err);
    res.send({
      error: 'User fetched not successfully',
      code: 500
    });
  }
}
}

export default new UserController();
