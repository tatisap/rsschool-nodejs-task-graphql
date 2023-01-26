import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { validate } from 'uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return this.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      if (!validate(id)) {
        throw this.httpErrors.notFound();
      }
      const profile = await this.db.profiles.findOne({ key: 'id', equals: id });
      if (!profile) {
        throw this.httpErrors.notFound();
      }
      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { body } = request;
      if (!['basic', 'business'].includes(body.memberTypeId)) {
        throw this.httpErrors.badRequest();
      }
      const conflict = await this.db.profiles.findOne({ key: 'userId', equals: body.userId});
      if (conflict) {
        throw this.httpErrors.badRequest();
      }
      return this.db.profiles.create(body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      if (!validate(id)) {
        throw this.httpErrors.badRequest();
      }
      const profile = await this.db.profiles.findOne({ key: 'id', equals: id });
      if (!profile) {
        throw this.httpErrors.notFound();
      }
      return this.db.profiles.delete(id);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { body, params: { id } } = request;
      if (!validate(id)) {
        throw this.httpErrors.badRequest();
      }
      const profile = await this.db.profiles.findOne({ key: 'id', equals: id });
      if (!profile) {
        throw this.httpErrors.notFound();
      }
      return this.db.profiles.change(id, body);
    }
  );
};

export default plugin;
