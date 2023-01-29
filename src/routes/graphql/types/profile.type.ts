import { FastifyInstance } from 'fastify';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { memberType, memberTypeIdEnum } from './member.type';

export const profileType: GraphQLObjectType = new GraphQLObjectType<ProfileEntity, FastifyInstance>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(memberTypeIdEnum) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    memberType: {
      type: memberType,
      resolve: (profile, _a, { db }) => db.memberTypes.findOne({ key: 'id', equals: profile.memberTypeId }),
    }
  }),
});
