import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { validate } from 'uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return this.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;
      if (!validate(id)) {
        throw this.httpErrors.notFound();
      }
      const post = await this.db.posts.findOne({ key: 'id', equals: id });
      if(!post) {
        throw this.httpErrors.notFound();
      }
      return post;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { body } = request;
      return this.db.posts.create(body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;
      if (!validate(id)) {
        throw this.httpErrors.badRequest();
      }
      const post = await this.db.posts.findOne({ key: 'id', equals: id });
      if (!post) {
        throw this.httpErrors.notFound();
      }
      await this.db.posts.delete(id);
      return post;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { body, params: { id } } = request;
      if (!validate(id)) {
        throw this.httpErrors.badRequest();
      }
      const post = await this.db.posts.findOne({ key: 'id', equals: id });
      if (!post) {
        throw this.httpErrors.notFound();
      }
      const updatedPost = await this.db.posts.change(id, body);
      return updatedPost;
    }
  );
};

export default plugin;
