import { FastifyInstance } from 'fastify';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { dataLoad } from '../load.data';
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
      resolve: (profile, _a, { db, dataloaders }, { fieldNodes }) => {
        const cb = async (memberTypeIds: string[]) => {
          const memberTypes = await db.memberTypes.findMany({ key: 'id', equalsAnyOf: memberTypeIds });
          return memberTypeIds.map((memberTypeId) => memberTypes.find((memberType) => memberType.id === memberTypeId));
        }
        return dataLoad(dataloaders, fieldNodes, cb, profile.memberTypeId);
      }
    }
  }),
});
