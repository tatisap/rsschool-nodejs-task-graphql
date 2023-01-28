import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import DB from '../../../utils/DB/DB';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { postType } from './post.type';
import { profileType } from './profile.type';

export const userType: GraphQLObjectType = new GraphQLObjectType<UserEntity, DB>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    posts: {
      type: new GraphQLList(postType),
      resolve: (user, _a, context) => context.posts.findMany({ key: 'userId', equals: user.id }),
    },
    profile: {
      type: profileType,
      resolve: (user, _a, context) => context.profiles.findOne({ key: 'userId', equals: user.id }),
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (user, _a, context) => context.users.findMany({ key: 'subscribedToUserIds', equals: [user.id] }),
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (user, _a, context) => Promise.all(user.subscribedToUserIds.map(
        (id: string) => context.users.findOne({ key: 'id', equals: id })
      )),
    },
  }),
});
