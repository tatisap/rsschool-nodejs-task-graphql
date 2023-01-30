import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { validate } from 'uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return this.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      if (!validate(id)) {
        throw this.httpErrors.notFound();
      }
      const user = await this.db.users.findOne({key: 'id', equals: id})
      if (!user) {
        throw this.httpErrors.notFound();
      }
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { body } = request;
      return this.db.users.create(body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      if (!validate(id)) {
        throw this.httpErrors.badRequest();
      }
      const user = await this.db.users.findOne({key: 'id', equals: id})
      if (!user) {
        throw this.httpErrors.notFound();
      }
      await this.db.users.delete(id);

      const followings = await this.db.users.findMany({ key: 'subscribedToUserIds', inArray: user.id });
      await Promise.all(followings.map(async (following) => {
        return this.db.users.change(following.id, {subscribedToUserIds: following.subscribedToUserIds.filter((id) => id !== user.id)});
      }));

      const profile = await this.db.profiles.findOne({ key: 'userId', equals: user.id});
      if (profile) {
        await this.db.profiles.delete(profile.id);
      }

      const posts = await this.db.posts.findMany({ key: 'userId', equals: user.id});
      if (posts.length !== 0) {
        await Promise.all(posts.map(async (post) => this.db.posts.delete(post.id)));
      }

      return user;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { body: { userId }, params: { id } } = request;
      if (!validate(id) || !validate(userId)) {
        throw this.httpErrors.badRequest();
      }
      if (userId === id) {
        throw this.httpErrors.badRequest();
      }
      const user = await this.db.users.findOne({key: 'id', equals: id});
      const userToFollow = await this.db.users.findOne({key: 'id', equals: userId});
      if (!user || !userToFollow) {
        throw this.httpErrors.notFound();
      }
      if (userToFollow.subscribedToUserIds.includes(user.id)) {
        throw this.httpErrors.unprocessableEntity();
      }
      return this.db.users.change(userId, { subscribedToUserIds: [id, ...userToFollow.subscribedToUserIds] });

    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { body: { userId }, params: { id } } = request;
      const userToUnfollow = await this.db.users.findOne({key: 'id', equals: userId})
      if (!userToUnfollow) {
        throw this.httpErrors.notFound();
      }
      if (userId === id) {
        throw this.httpErrors.badRequest();
      }
      if (!userToUnfollow.subscribedToUserIds.find((idFromList) => idFromList === id)) {
        throw this.httpErrors.badRequest();
      }
      return this.db.users.change(userId, {
        subscribedToUserIds: userToUnfollow.subscribedToUserIds.filter((idFromList) => idFromList !== id),
      });
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { body, params: { id } } = request;
      if (!validate(id)) {
        throw this.httpErrors.badRequest();
      }
      const user = await this.db.users.findOne({key: 'id', equals: id});
      if (!user) {
        throw this.httpErrors.notFound();
      }
      return this.db.users.change(id, body);
    }
  );
};

export default plugin;
