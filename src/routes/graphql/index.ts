import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, parse, validate } from 'graphql';
import { graphqlBodySchema } from './schema';
import { schema } from './graphql.schema';
import * as depthLimit from 'graphql-depth-limit';

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
    
      const [validationError] = validate(schema, parse((body.query || body.mutation) as string), [depthLimit(5)], { maxErrors: 1 });
      if (validationError) {
        throw this.httpErrors.badRequest(validationError.message);
      }
      const { data, errors: executionErrors } = await graphql({
        schema,
        contextValue: this,
        source: (body.query || body.mutation) as string,
        variableValues: body.variables,
      });
      if (executionErrors) {
        const [firstError] = executionErrors;
        throw this.httpErrors.badRequest(firstError.message);
      }
      return data;
    }
  );
};

export default plugin;
