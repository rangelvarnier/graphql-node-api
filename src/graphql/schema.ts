import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { Query } from './query';
import { Mutation } from './mutation';

import { userTypes } from './resources/user/user.schema';
import { userResolvers } from './resources/user/user.resolvers';

import { postTypes } from './resources/post/post.schema';
import { postResolvers } from './resources/post/post.resolvers';

import { commentTypes } from './resources/comment/comment.schema';
import { commentResolvers } from './resources/comment/comment.resolvers';

import { tokenTypes } from './resources/token/token.schema';
import { tokenResolvers } from './resources/token/token.resolvers';

const resolvers = merge(
  userResolvers,
  postResolvers,
  commentResolvers,
  tokenResolvers,
);

const SchemaDefinition = `
  type Schema {
    query: Query
    mutation: Mutation
  }
`;

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    Query,
    Mutation,
    userTypes,
    postTypes,
    commentTypes,
    tokenTypes,
  ],
  resolvers,
});
