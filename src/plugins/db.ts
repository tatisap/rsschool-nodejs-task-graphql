import * as DataLoader from 'dataloader';
import fp from 'fastify-plugin';
import { FieldNode } from 'graphql';
import DB from '../utils/DB/DB';

export default fp(async (fastify): Promise<void> => {
  const db = new DB();
  const dataloaders = new WeakMap();
  fastify.decorate('db', db);
  fastify.decorate('dataloaders', dataloaders);
});

declare module 'fastify' {
  export interface FastifyInstance {
    db: DB;
    dataloaders: WeakMap<readonly FieldNode[], DataLoader<any, any>>;
  }
}
