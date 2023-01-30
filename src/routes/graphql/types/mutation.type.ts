import { GraphQLObjectType, GraphQLError } from 'graphql';
import { createPostDto, createProfileDto, createUserDto, subscribeToUserDto, unsubscribeFromUserDto, updateMemberTypeDto, updatePostDto, updateProfileDto, updateUserDto } from '../dto/mutation.dto';
import { validate } from 'uuid';
import { userType } from './user.type';
import { profileType } from './profile.type';
import { postType } from './post.type';
import { memberType } from './member.type';
import { FastifyInstance } from 'fastify';

export const mutationType: GraphQLObjectType = new GraphQLObjectType<any, FastifyInstance>({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        userInfo: { type: createUserDto },
      },
      resolve: (_s, { userInfo }, { db }) => db.users.create(userInfo),
    },
    createProfile: {
      type: profileType,
      args: {
        profileInfo: { type: createProfileDto },
      },
      resolve: async (_s, { profileInfo }, { db }) => {
        const user = await db.users.findOne({ key: 'id', equals: profileInfo.userId });
        if (!user) {
          throw new GraphQLError(`User this id ${profileInfo.userId} not found`);
        }
        const conflict = await db.profiles.findOne({ key: 'userId', equals: profileInfo.userId});
        if (conflict) {
          throw new GraphQLError(`Profile for user this id ${profileInfo.userId} already created`);
        }
        return db.profiles.create(profileInfo);
      }
    },
    createPost: {
      type: postType,
      args: {
        postInfo: { type: createPostDto },
      },
      resolve: async (_s, { postInfo }, { db }) => {
        const user = await db.users.findOne({ key: 'id', equals: postInfo.userId });
        if (!user) {
          throw new GraphQLError(`User this id ${postInfo.userId} not found`);
        }
        return db.posts.create(postInfo);
      }
    },
    updateUser: {
      type: userType,
      args: {
        userInfo: { type:updateUserDto }
      },
      resolve: async(_s, { userInfo: { id, ...info} }, { db }) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        const user = await db.users.findOne({ key: 'id', equals: id });
        if (!user) {
          throw new GraphQLError(`User with id ${id} not found`);
        }
        return db.users.change(id, info);
      },
    },
    updateProfile: {
      type: profileType,
      args: {
        profileInfo: { type: updateProfileDto },
      },
      resolve: async (_s, { profileInfo: { id, ...info } }, { db }) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        const profile = await db.profiles.findOne({ key: 'id', equals: id });
        if (!profile) {
          throw new GraphQLError(`Profile with id ${id} not found`);
        }
        return db.profiles.change(id, info);
      }
    },
    updatePost: {
      type: postType,
      args: {
        postInfo: { type: updatePostDto },
      },
      resolve: async (_s, { postInfo: { id, ...info } }, { db }) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        const post = await db.posts.findOne({ key: 'id', equals: id });
        if (!post) {
          throw new GraphQLError(`Post with id ${id} not found`);
        }
        return db.posts.change(id, info);
      },
    },
    updateMemberType: {
      type: memberType,
      args: {
        memberTypeInfo: { type: updateMemberTypeDto },
      },
      resolve: async (_s, { memberTypeInfo: { id, ...info } }, { db }) => {
        if (!['basic', 'business'].includes(id)) {
          throw new GraphQLError(`Id is not basic or business`);
        }
        return db.memberTypes.change(id, info);
      },
    },
    subscribeToUser: {
      type: userType,
      args: {
        info: { type: subscribeToUserDto },
      },
      resolve: async (_s, { info: { userId, userToSubscribeId } }, { db }) => {
        if (!validate(userToSubscribeId) || !validate(userId)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        if (userId === userToSubscribeId) {
          throw new GraphQLError(`User's id and user's to subscribe id can't be equal`);
        }
        const user = await db.users.findOne({key: 'id', equals: userId});
        const userToFollow = await db.users.findOne({key: 'id', equals: userToSubscribeId});
        if (!user || !userToFollow) {
          throw new GraphQLError(`User not found`);
        }
        if (userToFollow.subscribedToUserIds.includes(userId)) {
          throw new GraphQLError(`User(${userId}) already subscribed to user(${userToSubscribeId})`);
        }
        return db.users.change(userToSubscribeId, { subscribedToUserIds: [userId, ...userToFollow.subscribedToUserIds] });
      },
    },
    unsubscribeFromUser: {
      type: userType,
      args: {
        info: { type: unsubscribeFromUserDto },
      },
      resolve: async (_s, { info: { userId, userToUnsubscribeId } }, { db }) => {
        if (!validate(userToUnsubscribeId) || !validate(userId)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        if (userId === userToUnsubscribeId) {
          throw new GraphQLError(`User's id and user's to unsubscribe id can't be equal`);
        }
        const userToUnfollow = await db.users.findOne({key: 'id', equals: userToUnsubscribeId});
        if (!userToUnfollow) {
          throw new GraphQLError(`User not found`);
        }
        if (!userToUnfollow.subscribedToUserIds.find((id) => id === userId)) {
          throw new GraphQLError(`User(${userId}) is not subscribed to user(${userToUnsubscribeId})`);
        }
        return db.users.change(userToUnsubscribeId, {
          subscribedToUserIds: userToUnfollow.subscribedToUserIds.filter((id) => id !== userId),
        });
      },
    },
  }),
});
