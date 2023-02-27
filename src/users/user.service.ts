import { User } from './users.model';

export class UserService {
  async getAll() {
    const userList = await User.find({}).lean();
    return userList;
  }
}
