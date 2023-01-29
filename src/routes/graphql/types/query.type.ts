import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLError } from 'graphql';
import { memberType, memberTypeIdEnum } from './member.type';
import { postType } from './post.type';
import { profileType } from './profile.type';
import { userType } from './user.type';
import { validate } from 'uuid';
import { FastifyInstance } from 'fastify';

export const queryType: GraphQLObjectType = new GraphQLObjectType<any, FastifyInstance>({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      resolve: (_s, _a, { db }) => db.users.findMany(),
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: (_s, _a, { db }) => db.profiles.findMany(),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (_s, _a, { db }) => db.posts.findMany(),
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      resolve: (_s, _a, { db }) => db.memberTypes.findMany(),
    },
    user: {
      type: userType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_s, { id }, { db }) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        return db.users.findOne({ key: 'id', equals: id  })
      },
    },
    post: {
      type: postType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_s, { id }, { db }) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        return db.posts.findOne({ key: 'id', equals: id  })
      },
    },
    profile: {
      type: profileType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_s, { id }, { db }) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        return db.profiles.findOne({ key: 'id', equals: id  })
      },
    },
    memberType: {
      type: memberType,
      args: { id: { type: new GraphQLNonNull(memberTypeIdEnum) } },
      resolve: (_s, { id }, { db }) => {
        return db.memberTypes.findOne({ key: 'id', equals: id  })
      },
    },
  }),
});
