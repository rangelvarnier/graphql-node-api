import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';
import { GraphQLResolveInfo } from 'graphql';
import { UserInstance } from '../../../models/UserModel';
import { Transaction } from 'sequelize';

export const userResolvers = {
  User: {
    posts: (
      user: UserInstance,
      { first = 10, offset = 0 },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.Post.findAll({
        where: { author: user.get('id') },
        limit: first,
        offset: offset,
      });
    },
  },

  Query: {
    users: (
      parent,
      { first = 10, offset = 0 },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.User.findAll({ limit: first, offset: offset });
    },

    user: (
      parent,
      { id },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.User.findById(id).then((user: UserInstance) => {
        if (!user) {
          throw new Error(`User with id ${id} not fount`);
        }
        return user;
      });
    },
  },

  Mutations: {
    createUser: (
      parent,
      args,
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.User.create(args.input, { transaction: t });
      });
    },

    updateUser: (
      parent,
      { id, input },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.sequelize.transaction((t: Transaction) => {
        id = parseInt(id);
        return db.User.findById(id).then((user: UserInstance) => {
          if (!user) throw new Error(`User with id ${id} not fount`);
          return user.update(input, { transaction: t });
        });
      });
    },

    updateUserPassword: (
      parent,
      { id, input },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.sequelize.transaction((t: Transaction) => {
        id = parseInt(id);
        return db.User.findById(id).then((user: UserInstance) => {
          if (!user) throw new Error(`User with id ${id} not fount`);
          return user
            .update(input, { transaction: t })
            .then((user: UserInstance) => !!user);
        });
      });
    },

    deleteUser: (
      parent,
      { id },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.sequelize.transaction((t: Transaction) => {
        id = parseInt(id);
        return db.User.findById(id).then((user: UserInstance) => {
          if (!user) throw new Error(`User with id ${id} not fount`);
          return user.destroy({ transaction: t }).then(user => !!user);
        });
      });
    },
  },
};
