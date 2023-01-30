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

      try {
        const validationErrors = validate(schema, parse((body.query || body.mutation) as string), [depthLimit(5)]);
        
        if (validationErrors.length !== 0) {
          throw validationErrors;
        }
        const { data, errors: executionErrors } = await graphql({
          schema,
          contextValue: this,
          source: (body.query || body.mutation) as string,
          variableValues: body.variables,
        });
        if (executionErrors) {
          throw executionErrors;
        }
        return data;

      } catch (errors) {
        if (errors instanceof Error) {
          throw this.httpErrors.internalServerError();
        }
        reply.statusCode = 400;
        reply.send({ errors });
        return;
      }      
    
    }
  );
};

export default plugin;
