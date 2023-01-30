import { GraphQLSchema } from "graphql";
import { memberType } from "./types/member.type";
import { mutationType } from "./types/mutation.type";
import { postType } from "./types/post.type";
import { profileType } from "./types/profile.type";
import { queryType } from "./types/query.type";
import { userType } from "./types/user.type";

export const schema: GraphQLSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  types: [userType, profileType, postType, memberType],
});