import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return this.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { id } = request.params;
      if (!['basic', 'business'].includes(id)) {
        throw this.httpErrors.notFound();
      }
      const member = await this.db.memberTypes.findOne({ key: 'id', equals: id });
      if (!member) {
        throw this.httpErrors.notFound();
      }
      return member;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { body, params: { id } } = request;
      if (!['basic', 'business'].includes(id)) {
        throw this.httpErrors.badRequest();
      }
      const member = await this.db.memberTypes.findOne({ key: 'id', equals: id });
      if (!member) {
        throw this.httpErrors.notFound();
      }
      return this.db.memberTypes.change(id, body);
    }
  );
};

export default plugin;
