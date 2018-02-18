import * as express from 'express';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.midleware();
  }

  private midleware(): void {
    this.express.use(
      '/hello',
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        res.send({
          hello: 'Hello World',
        });
      },
    );
  }
}

export default new App().express;
