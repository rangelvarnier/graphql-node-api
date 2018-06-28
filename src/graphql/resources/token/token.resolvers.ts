import * as jwt from 'jsonwebtoken';
import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';
import { JWT_SECRET } from '../../../utils/utils';

export const tokenResolvers = {
  Mutation: {
    createToken: (
      parent,
      { email, password },
      { db }: { db: DbConnectionInterface },
    ) => {
      return db.User.findOne({
        where: { email: email },
        attributes: ['id', 'password'],
      }).then(user => {
        const messageError = 'Unauthorized, wrong email or password';
        if (!user || !user.isPassword(user.get('password'), password)) {
          throw new Error(messageError);
        }
        const payload = { sub: user.get('id') };
        return { token: jwt.sign(payload, JWT_SECRET) };
      });
    },
  },
};
