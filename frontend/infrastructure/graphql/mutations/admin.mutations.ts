import { gql } from '@apollo/client';

// Update user roles (admin only)
export const UPDATE_USER_ROLES = gql`
  mutation UpdateUserRoles($userId: String!, $roles: [String!]!) {
    updateUserRoles(userId: $userId, roles: $roles) {
      id
      email
      firstName
      lastName
      roles
      updatedAt
    }
  }
`;

// Delete user (admin only)
export const DELETE_USER = gql`
  mutation DeleteUser($userId: String!) {
    deleteUser(userId: $userId)
  }
`;
