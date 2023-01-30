# GraphQL assignment

## Request examples

- **POST /graphql**
   1. Get gql requests:
      - Get users, profiles, posts, memberTypes (4 operations in one query):

      ```graphql
      query {
         users {
            id
         }
         profiles {
            id
         }
         posts {
            id
         }
         memberTypes {
            id
         }
      }
      ```

      - Get user, profile, post, memberType by id (4 operations in one query):

      ```graphql
      query($userId: String!, $profileId: String!, $postId: String!, $memberTypeId: MemberTypeId!) {
         user(userId: $userId) {
            id
         }
         profile(profileId: $profileId) {
            id
         }
         post(postId: $postId) {
            id
         }
         memberType(memberTypeId: $memberTypeId) {
            id
         }
      }
      ```

      If you want to find fewer entities modify query, remove unecessary entities and variables.

      Variables:

      ```ts
      {
         userId: string;
         profileId: string;
         postId: string;
         memberTypeId: string;
      }
      ```

      Example:

      ```json
      {
         "userId": /*insert uuid here*/,
         "profileId": /*insert uuid here*/,
         "postId": /*insert uuid here*/,
         "memberTypeId": /*insert uuid here*/
      } 
      ```

      - Get users with their posts, profiles, memberTypes:

      ```graphql
      query {
         users {
            id
            profile {
               id
               memberType {
                  id
               }
            }
            posts {
               id
            }
         }
      }
      ```

      - Get user by id with his posts, profile, memberType:

      ```graphql
      query($userId: String!) {
         user(userId: $userId) {
            id
            profile {
               id
               memberType {
                  id
               }
            }
            posts {
               id
            }
         }
      }
      ```

      Variables:

      ```ts
      {
         userId: string;
      }
      ```

      Example:

      ```json
      {
         "userId": /*insert uuid here*/
      } 
      ```

      - Get users with their `userSubscribedTo` profile:

      ```graphql
      query {
         users {
            id
            userSubscribedTo {
               id
            }
         }
      }
      ```

      - Get user by id with his `subscribedToUser` posts:

      ```graphql
      query($userId: String!) {
         user(userId: $userId) {
            id
            subscribedToUser {
               id
            }
         }
      }
      ```

      Variables:

      ```ts
      {
         "userId": string
      }
      ```

      Example:

      ```json
      {
         "userId": /*insert uuid here*/
      } 
      ```

      - Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`):

      ```graphql
      query {
         users {
            id
            userSubscribedTo {
               id
               userSubscribedTo {
                  id
               }
               subscribedToUser {
                  id
               }
            }
            subscribedToUser {
               id
               userSubscribedTo {
                  id
               }
               subscribedToUser {
                  id
               }
            }
         }
      }
      ```

   2. Create gql requests:
      - Create user:

      ```graphql
      mutation($userInfo: CreateUserDTO!) {
         createUser(userInfo: $userInfo) {
            id
            firstName
            lastName
            email
         }
      }
      ```

      Variables:

      ```ts
      {
         userInfo: {
            firstName: string;
            lastName: string;
            email: string;
         }
      }
      ```

      Example:

      ```json
      {
         "userInfo": {
            "firstName": "John",
            "lastName": "Smith",
            "email": "john.smith@gmail.com"
         }
      }  
      ```

      - Create profile:

      ```graphql
      mutation($profileInfo: CreateProfileDTO!) {
         createProfile(profileInfo: $profileInfo) {
            id
            avatar
            sex
            birthday
            country
            street
            city
            memberTypeId
            userId
         }
      }
      ```

      Variables:

      ```ts
      {
         profileInfo: {
            avatar: string;
            sex: string; 
            birthday: string; 
            country: string; 
            street: string; 
            city: string; 
            memberTypeId: string;
            userId: string;
         }
      }
      ```

      Example:

      ```json
      {
          "profileInfo": {
              "avatar": "./image.png",
              "sex": "M",
              "birthday": "12/12/1992",
              "country": "USA",
              "street": "Roland Avenu",
              "city": "New York",
              "memberTypeId": "business",
              "userId": /*insert uuid here*/
          }
      }
      ```

      - Create post:

      ```graphql
      mutation($postInfo: CreatePostDTO!)  {
         createPost(postInfo: $postInfo) {
            id
            title
            content
            userId
         }
      }
      ```

      Variables:

      ```ts
      {
         postInfo: {
            title: string;
            content: string;
            userId: string;
          }
      }
      ```

      Example:

      ```json
      {
         "postInfo": {
            "title": "New post",
            "content": "This is new post",
            "userId": /*insert uuid here*/
         }
      }
      ```

   3. Update gql requests:  
      - Update profile:

      ```graphql
      mutation($profileInfo: UpdateProfileDTO!)  {
         updateProfile(profileInfo: $profileInfo) {
            id
            avatar
            sex
            birthday
            country
            street
            city
            memberTypeId
            userId
         }
      }
      ```

      Variables:

      ```ts
      {
         profileInfo: {
            id: string;
            avatar?: string;
            sex?: string; 
            birthday?: string; 
            country?: string; 
            street?: string; 
            city?: string; 
            memberTypeId?: string;
         }
      }
      ```

      Example:

      ```json
      {
         "profileInfo": {
            "id": /*insert uuid here*/,
            "country": "Canada",
            "street": "Lanark Str",
            "city": "Vancouver",
            "memberTypeId": "basic"
          }
      }
      ```

      - Update user:

      ```graphql
      mutation($userInfo: UpdateUserDTO!) {
         updateUser(userInfo: $userInfo) {
            id
            firstName
            lastName
            email
         }
      }
      ```

      Variables:

      ```ts
      {
         userInfo: {
            id: string;
            firstName?: string;
            lastName?: string;
            email?: string;
         }
      }
      ```

      Example:

      ```json
      {
         "userInfo": {
            "id": /*insert uuid here*/,
            "email": "john.smith@yahoo.com"
         }
      }  
      ```

      - Update post:

      ```graphql
      mutation($postInfo: UpdatePostDTO!) {
         updatePost(postInfo: $postInfo) {
            id
            title
            content
            userId
         }
      }
      ```

      Variables:

      ```ts
      {
         postInfo: {
            id: string;
            title?: string;
            content?: string;
          }
      }
      ```

      Example:

      ```json
      {
         "postInfo": {
            "id": /*insert uuid here*/,
            "title": "Welcome to Canada",
            "content": "This is a post about Canada"
         }
      }
      ```

      - Update memberType:

      ```graphql
      mutation($memberTypeInfo: UpdateMemberTypeDTO!) {
         updateMemberType(memberTypeInfo: $memberTypeInfo) {
            id
            discount
            monthPostsLimit
         }
      }
      ```

      Variables:

      ```ts
      enum MemberTypeId {
         BASIC = 'basic',
         BUSINESS = 'business',
      }

      {
         memberTypeInfo: {
            id: MemberTypeId;
            discount?: number;
            monthPostsLimit?: number;
          }
      }
      ```

      Example:

      ```json
      {
         "memberTypeInfo": {
           "id": "business",
           "discount": 20
         }
      }
      ```

      - Subscribe to; unsubscribe from:

      ```graphql
      mutation($info: SubscribeToUserDTO!) {
         subscribeToUser(info: $info) {
            id
            firstName
            lastName
            email
            subscribedToUserIds
         }
      }
      ```

      Variables:

      ```ts
      {
         info: {
            userId: string;
            userToSubscribeId: string;
         }
      }
      ```

      Example:

      ```json
      {
         "info": {
            "userId": /*insert uuid here*/,
            "userToSubscribeId": /*insert uuid here*/
         }
      } 
      ```

      ```graphql
      mutation($info: UnsubscribeFromUserDTO!) {
         unsubscribeFromUser(info: $info) {
            id
            firstName
            lastName
            email
            subscribedToUserIds
         }
      }
      ```

      Variables:

      ```ts
      {
         info: {
            userId: string;
            userToUnsubscribeId: string;
         }
      }
      ```

      Example:

      ```json
      {
         "info": {
            "userId": /*insert uuid here*/,
            "userToUnsubscribeId": /*insert uuid here*/
         }
      } 
      ```

## N + 1 problem solving

Dataloaders are stored in weak map. Initialization of storage here: ```./src/plugins/db.ts line 8```.

Using in the resolvers:

1. ```./src/routes/graphql/types/profile.type.ts```:
      - line 21.
2. ```./src/routes/graphql/types/user.type.ts```:
      - line 18;
      - line 28;
      - line 38;
      - line 48.

## Limit the complexity of the graphql queries

See: ```./src/routes/graphql/index.ts line 20```.

Invalid request example:

```graphql
query {
   users {
      id
      userSubscribedTo {
         id
         userSubscribedTo {
            id
            userSubscribedTo {
               id
               userSubscribedTo {
                  id
                  userSubscribedTo {
                     id
                  }
               }
            }
         }
      }
   }
}
```

Error example:

_400 Bad Request_

```json
{
    "errors": [
        {
            "message": "'' exceeds maximum operation depth of 5",
            "locations": [
                {
                    "line": 13,
                    "column": 22
                }
            ]
        }
    ]
}
```
