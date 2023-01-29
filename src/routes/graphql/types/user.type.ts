import { FastifyInstance } from 'fastify';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { postType } from './post.type';
import { profileType } from './profile.type';

export const userType: GraphQLObjectType = new GraphQLObjectType<UserEntity, FastifyInstance>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    posts: {
      type: new GraphQLList(postType),
      resolve: (user, _a, { db }) => db.posts.findMany({ key: 'userId', equals: user.id }),
    },
    profile: {
      type: profileType,
      resolve: (user, _a, { db }) => db.profiles.findOne({ key: 'userId', equals: user.id }),
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (user, _a, { db }) => db.users.findMany({ key: 'subscribedToUserIds', equals: [user.id] }),
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (user, _a, { db }) => Promise.all(user.subscribedToUserIds.map(
        (id: string) => db.users.findOne({ key: 'id', equals: id })
      )),
    },
  }),
});