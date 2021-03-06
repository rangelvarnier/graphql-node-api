import { GraphQLResolveInfo } from 'graphql';
import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';
import { Transaction } from 'sequelize';
import { handleError } from '../../../utils/utils';
import { CommentInstance } from '../../../models/CommentModel';

export const commentResolvers = {
  Comment: {
    post: (
      comment: CommentInstance,
      { args },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.Post.findById(comment.get('post')).catch(handleError);
    },
    user: (
      comment: CommentInstance,
      args,
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.User.findById(comment.get('user')).catch(handleError);
    },
  },
  Query: {
    commentsByPost: (
      parent,
      { postId, first = 10, offset = 0 },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      postId = parseInt(postId);
      return db.Comment.findAll({
        where: { post: postId },
        limit: first,
        offset: offset,
      }).catch(handleError);
    },
  },
  Mutation: {
    createComment: (
      parent,
      { input },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      return db.sequelize
        .transaction((t: Transaction) => {
          return db.Comment.create(input, { transaction: t });
        })
        .catch(handleError);
    },
    updateComment: (
      parent,
      { id, input },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      id = parseInt(id);
      return db.sequelize
        .transaction((t: Transaction) => {
          return db.Comment.findById(id).then((comment: CommentInstance) => {
            if (!comment) throw new Error(`comment with id ${id} not found`);
            return comment.update(input, { transaction: t });
          });
        })
        .catch(handleError);
    },
    deleteComment: (
      parent,
      { id },
      { db }: { db: DbConnectionInterface },
      info: GraphQLResolveInfo,
    ) => {
      id = parseInt(id);
      return db.sequelize
        .transaction((t: Transaction) => {
          return db.Comment.findById(id).then((comment: CommentInstance) => {
            if (!comment) throw new Error(`comment with id ${id} not found`);
            return comment
              .destroy({ transaction: t })
              .then(comment => !!comment);
          });
        })
        .catch(handleError);
    },
  },
};
