import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import schema from './graphql/schema';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.midleware();
  }

  private midleware(): void {
    this.express.use(
      '/graphql',
      graphqlHTTP({ schema, graphiql: process.env.NODE_ENV === 'development' }),
    );
  }
}

export default new App().express;
