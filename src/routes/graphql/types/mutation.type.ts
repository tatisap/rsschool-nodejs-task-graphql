import { GraphQLObjectType, GraphQLError } from 'graphql';
import { createPostDto, createProfileDto, createUserDto, subscribeToUserDto, unsubscribeFromUserDto, updateMemberTypeDto, updatePostDto, updateProfileDto, updateUserDto } from '../dto/mutation.dto';
import { validate } from 'uuid';
import DB from '../../../utils/DB/DB';
import { userType } from './user.type';
import { profileType } from './profile.type';
import { postType } from './post.type';
import { memberType } from './member.type';

export const mutationType: GraphQLObjectType = new GraphQLObjectType<any, DB>({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        userInfo: { type: createUserDto },
      },
      resolve: (_s, { userInfo }, context) => context.users.create(userInfo),
    },
    createProfile: {
      type: profileType,
      args: {
        profileInfo: { type: createProfileDto },
      },
      resolve: async (_s, { profileInfo }, context) => {
        const user = await context.users.findOne({ key: 'id', equals: profileInfo.userId });
        if (!user) {
          throw new GraphQLError(`User this id ${profileInfo.userId} not found`);
        }
        const conflict = await context.profiles.findOne({ key: 'userId', equals: profileInfo.userId});
        if (conflict) {
          throw new GraphQLError(`Profile for user this id ${profileInfo.userId} already created`);
        }
        return context.profiles.create(profileInfo);
      }
    },
    createPost: {
      type: postType,
      args: {
        postInfo: { type: createPostDto },
      },
      resolve: async (_s, { postInfo }, context) => {
        const user = await context.users.findOne({ key: 'id', equals: postInfo.userId });
        if (!user) {
          throw new GraphQLError(`User this id ${postInfo.userId} not found`);
        }
        return context.posts.create(postInfo);
      }
    },
    updateUser: {
      type: userType,
      args: {
        userInfo: { type:updateUserDto }
      },
      resolve: async(_s, { userInfo: { id, ...info} }, context) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        const user = await context.users.findOne({ key: 'id', equals: id });
        if (!user) {
          throw new GraphQLError(`User with id ${id} not found`);
        }
        return context.users.change(id, info);
      },
    },
    updateProfile: {
      type: profileType,
      args: {
        profileInfo: { type: updateProfileDto },
      },
      resolve: async (_s, { profileInfo: { id, ...info } }, context) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        const profile = await context.profiles.findOne({ key: 'id', equals: id });
        if (!profile) {
          throw new GraphQLError(`Profile with id ${id} not found`);
        }
        return context.profiles.change(id, info);
      }
    },
    updatePost: {
      type: postType,
      args: {
        postInfo: { type: updatePostDto },
      },
      resolve: async (_s, { postInfo: { id, ...info } }, context) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        const post = await context.posts.findOne({ key: 'id', equals: id });
        if (!post) {
          throw new GraphQLError(`Post with id ${id} not found`);
        }
        return context.posts.change(id, info);
      },
    },
    updateMemberType: {
      type: memberType,
      args: {
        postInfo: { type: updateMemberTypeDto },
      },
      resolve: async (_s, { memberTypeInfo: { id, ...info } }, context) => {
        if (!['basic', 'business'].includes(id)) {
          throw new GraphQLError(`Id is not basic or business`);
        }
        return context.memberTypes.change(id, info);
      },
    },
    subscribeToUser: {
      type: userType,
      args: {
        info: { type: subscribeToUserDto },
      },
      resolve: async (_s, { userId, userToSubscribeId }, context) => {
        if (!validate(userToSubscribeId) || !validate(userId)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        const user = await context.users.findOne({key: 'id', equals: userId});
        const userToFollow = await context.users.findOne({key: 'id', equals: userToSubscribeId});
        if (!user || !userToFollow) {
          throw new GraphQLError(`User not found`);
        }
        if (userToFollow.subscribedToUserIds.includes(userId)) {
          throw new GraphQLError(`User(${userId}) already subscribed to user(${userToSubscribeId})`);
        }
        return context.users.change(userToSubscribeId, { subscribedToUserIds: [userId, ...userToFollow.subscribedToUserIds] });
      },
    },
    unsubscribeFromUser: {
      type: userType,
      args: {
        info: { type: unsubscribeFromUserDto },
      },
      resolve: async (_s, { userId, userToUnsubscribeId }, context) => {
        if (!validate(userToUnsubscribeId) || !validate(userId)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        const userToUnfollow = await context.users.findOne({key: 'id', equals: userToUnsubscribeId});
        if (!userToUnfollow) {
          throw new GraphQLError(`User not found`);
        }
        if (!userToUnfollow.subscribedToUserIds.find((id) => id === userId)) {
          throw new GraphQLError(`User(${userId}) is not subscribed to user(${userToUnsubscribeId})`);
        }
        return context.users.change(userToUnsubscribeId, {
          subscribedToUserIds: userToUnfollow.subscribedToUserIds.filter((id) => id !== userId),
        });
      },
    },
  }),
});
