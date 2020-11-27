/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addFavorite = /* GraphQL */ `
  mutation AddFavorite($user_id: ID!, $new_favorite: ID!) {
    addFavorite(user_id: $user_id, new_favorite: $new_favorite) {
      trailID
      name
      summary
      difficulty
      rating
      num_of_ratings
      length
      ascent
      descent
    }
  }
`;
export const deleteFavorite = /* GraphQL */ `
  mutation DeleteFavorite($user_id: ID!, $new_favorite: ID!) {
    deleteFavorite(user_id: $user_id, new_favorite: $new_favorite) {
      trailID
      name
      summary
      difficulty
      rating
      num_of_ratings
      length
      ascent
      descent
    }
  }
`;
export const addUserToGroup = /* GraphQL */ `
  mutation AddUserToGroup($group_id: ID!, $user_id: ID!) {
    addUserToGroup(group_id: $group_id, user_id: $user_id) {
      id
      name
      lat
      long
      favorites {
        trailID
        name
        summary
        difficulty
        rating
        num_of_ratings
        length
        ascent
        descent
      }
      groups {
        groupID
        name
      }
    }
  }
`;
