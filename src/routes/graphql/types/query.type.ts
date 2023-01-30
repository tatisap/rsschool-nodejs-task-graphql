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
      args: { userId: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_s, { userId }, { db }) => {
        if (!validate(userId)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        return db.users.findOne({ key: 'id', equals: userId })
      },
    },
    post: {
      type: postType,
      args: { postId: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_s, { postId }, { db }) => {
        if (!validate(postId)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        return db.posts.findOne({ key: 'id', equals: postId })
      },
    },
    profile: {
      type: profileType,
      args: { profileId: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_s, { profileId }, { db }) => {
        if (!validate(profileId)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        return db.profiles.findOne({ key: 'id', equals: profileId })
      },
    },
    memberType: {
      type: memberType,
      args: { memberTypeId: { type: new GraphQLNonNull(memberTypeIdEnum) } },
      resolve: (_s, { memberTypeId }, { db }) => {
        return db.memberTypes.findOne({ key: 'id', equals: memberTypeId })
      },
    },
  }),
});
