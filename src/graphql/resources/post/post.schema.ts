const postTypes = `
  #Post types definition
  type Post {
    id: ID!
    title: String!
    content: String!
    photo: String!
    createdAt: String!
    updatedAt: String!
    author: User!
    comments: [Comment!]!
  }

  input PostCreateInput {
    title: String!
    content: String!
    photo: String!
    author: Int!
  }
`;

const postQueries = `
  posts(first: Int, offset: Int): [ Post! ]!
  post(id: ID!): Post
`;

const postMutations = `
  createPost(input: PostCreateInput!): Post
  updatePost(id: ID!, input: PostCreateInput!): Post
  deletePost(id: ID!): Boolean
`;

export { postTypes, postQueries, postMutations };
