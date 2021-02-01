import { User } from 'src/user/user.entity';

export const sanitizeUser = function (user: User) {
  delete user.password;
};
