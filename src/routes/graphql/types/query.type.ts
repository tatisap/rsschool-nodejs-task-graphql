import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLError } from 'graphql';
import DB from '../../../utils/DB/DB';
import { memberType, memberTypeIdEnum } from './member.type';
import { postType } from './post.type';
import { profileType } from './profile.type';
import { userType } from './user.type';
import { validate } from 'uuid';

export const queryType: GraphQLObjectType = new GraphQLObjectType<any, DB>({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      resolve: (_s, _a, context) => context.users.findMany(),
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: (_s, _a, context) => context.profiles.findMany(),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (_s, _a, context) => context.posts.findMany(),
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      resolve: (_s, _a, context) => context.memberTypes.findMany(),
    },
    user: {
      type: userType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_s, { id }, context) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        return context.users.findOne({ key: 'id', equals: id  })
      },
    },
    post: {
      type: postType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_s, { id }, context) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        return context.posts.findOne({ key: 'id', equals: id  })
      },
    },
    profile: {
      type: profileType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_s, { id }, context) => {
        if (!validate(id)) {
          throw new GraphQLError(`Id is not UUID`);
        }
        return context.profiles.findOne({ key: 'id', equals: id  })
      },
    },
    memberType: {
      type: memberType,
      args: { id: { type: new GraphQLNonNull(memberTypeIdEnum) } },
      resolve: (_s, { id }, context) => {
        return context.memberTypes.findOne({ key: 'id', equals: id  })
      },
    },
  }),
});
