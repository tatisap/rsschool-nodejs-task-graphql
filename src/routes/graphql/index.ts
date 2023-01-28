import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql } from 'graphql';
import { graphqlBodySchema } from './schema';
import { schema } from './graphql.schema';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
    const { body } = request;
    
    if (body.query) {
      const response = await graphql({
        schema,
        contextValue: this.db,
        source: body.query,
        variableValues: body.variables
      });
      
      if (response.errors) {
        return response.errors;
      }
      return response.data;
    }

    if (body.mutation) {
      const response = await graphql({
        schema,
        contextValue: this.db,
        source: body.mutation,
        variableValues: body.variables
      });

      if (response.errors) {
        return response.errors;
      }
      return response.data;
    }

    }
  );
};

export default plugin;
