import { FastifyInstance } from 'fastify';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { dataLoad } from '../load.data';
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
      resolve: (user, _a, { db, dataloaders }, { fieldNodes }) => {
        const cb = async (userIds: string[]) => {
          const posts = await db.posts.findMany({ key: 'userId', equalsAnyOf: userIds });
          return userIds.map((userId) => posts.filter((post) => post.userId === userId));
        };
        return dataLoad(dataloaders, fieldNodes, cb, user.id);
      },
    },
    profile: {
      type: profileType,
      resolve: (user, _a, { db, dataloaders }, { fieldNodes }) => {
        const cb = async (userIds: string[]) => {
          const profiles = await db.profiles.findMany({ key: 'userId', equalsAnyOf: userIds });
          return userIds.map((id) => profiles.find((profile) => profile.userId === id));
        };
        return dataLoad(dataloaders, fieldNodes, cb, user.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (user, _a, { db, dataloaders }, { fieldNodes }) => {
        const cb = async (userIds: string[]) => {
          const followings = await db.users.findMany({ key: 'subscribedToUserIds', inArrayAnyOf: userIds });
          return userIds.map((userId) => followings.filter((following) => following.subscribedToUserIds.includes(userId)));
        };
        return dataLoad(dataloaders, fieldNodes, cb, user.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (user, _a, { db, dataloaders }, { fieldNodes }) => {
        const cb = async (followersIds: string[][]) => {
          const flattedFollowersIds = followersIds.flat();
          const followers = await db.users.findMany({ key: 'id', equalsAnyOf: flattedFollowersIds });
          return followersIds.map((userFollowerIds) => followers.filter((follower) => userFollowerIds.includes(follower.id)));
        }
        return dataLoad(dataloaders, fieldNodes, cb, user.subscribedToUserIds);
      },
    },
  }),
});
