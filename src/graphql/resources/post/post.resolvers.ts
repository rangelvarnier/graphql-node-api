import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';
import { GraphQLResolveInfo } from 'graphql';
import { PostInstance } from '../../../models/PostModel';
import { Transaction } from 'sequelize';
import { handleError } from '../../../utils/utils';

export const postResolvers = {
  Post: {
    author: (
      post: PostInstance,
      args,
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.User.findById(post.get('author')).catch(handleError);
    },

    comments: (
      post: PostInstance,
      { first = 10, offset = 0 },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.Comment.findAll({
        where: { post: post.get('id') },
        limit: first,
        offset: offset,
      }).catch(handleError);
    },
  },

  Query: {
    posts: (
      parent,
      { first = 10, offset = 0 },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.Post.findAll({ limit: first, offset: offset }).catch(
        handleError,
      );
    },

    post: (
      parent,
      { id },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.Post.findById(id)
        .then((post: PostInstance) => {
          if (!post) throw new Error(`Post with id ${id} not found`);
          return post;
        })
        .catch(handleError);
    },
  },

  Mutations: {
    createPost: (
      parent,
      args,
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.sequelize
        .transaction((t: Transaction) => {
          return db.Post.create(args.input, { transaction: t });
        })
        .catch(handleError);
    },
    updatePost: (
      parent,
      { id, input },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.sequelize
        .transaction((t: Transaction) => {
          id = parseInt(id);
          return db.Post.findById(id).then((post: PostInstance) => {
            if (!post) throw new Error(`post id ${id} not found`);
            return post.update(input, { t: Transaction });
          });
        })
        .catch(handleError);
    },
    deletePost: (
      parent,
      { id },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.sequelize
        .transaction((t: Transaction) => {
          id = parseInt(id);
          return db.Post.findById(id).then((post: PostInstance) => {
            if (!post) throw new Error(`post id ${id} not found`);
            return post.destroy({ transaction: t }).then(post => !!post);
          });
        })
        .catch(handleError);
    },
  },
};
