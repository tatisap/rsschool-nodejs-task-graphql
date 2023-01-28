import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { memberTypeIdEnum } from "../types/member.type";

export const createUserDto = new GraphQLInputObjectType({
  name: 'CreateUserDTO',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const createProfileDto = new GraphQLInputObjectType({
  name: 'CreateProfileDTO',
  fields: () => ({
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(memberTypeIdEnum) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const createPostDto = new GraphQLInputObjectType({
  name: 'CreatePostDTO',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const updateUserDto = new GraphQLInputObjectType({
  name: 'UpdateUserDTO',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

export const updateProfileDto = new GraphQLInputObjectType({
  name: 'UpdateProfileDTO',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLString },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: memberTypeIdEnum },
  }),
});

export const updatePostDto = new GraphQLInputObjectType({
  name: 'UpdatePostDTO',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export const updateMemberTypeDto = new GraphQLInputObjectType({
  name: 'UpdateMemberTypeDTO',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});

export const subscribeToUserDto = new GraphQLInputObjectType({
  name: 'SubscribeToUserDTO',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString) },
    userToSibscribeId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const unsubscribeFromUserDto = new GraphQLInputObjectType({
  name: 'UnsubscribeFromUserDTO',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString) },
    userToUnsibscribeId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});