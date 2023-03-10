import { UserSchema, User } from './users.model';

export class UserService {
  async getAll(): Promise<UserSchema[]> {
    const userList = await User.find({}).lean();
    return userList;
  }
}
