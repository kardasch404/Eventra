import { gql } from '@apollo/client';

// Get all users with pagination (admin only)
export const GET_USERS = gql`
  query GetUsers($page: Int, $limit: Int, $search: String, $role: String) {
    users(page: $page, limit: $limit, search: $search, role: $role) {
      users {
        id
        email
        firstName
        lastName
        avatar
        isEmailVerified
        roles
        createdAt
        updatedAt
      }
      total
      page
      limit
      totalPages
    }
  }
`;

// Get single user by ID (admin only)
export const GET_USER = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      avatar
      isEmailVerified
      roles
      createdAt
      updatedAt
    }
  }
`;

// Get admin dashboard statistics
export const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    adminStats {
      totalUsers
      totalEvents
      totalReservations
      confirmedReservations
      pendingReservations
      publishedEvents
    }
  }
`;

// Get all reservations (admin only)
export const GET_ALL_RESERVATIONS = gql`
  query GetAllReservations {
    allReservations {
      id
      eventId
      userId
      quantity
      status
      ticketCode
      confirmedAt
      canceledAt
      createdAt
      updatedAt
    }
  }
`;
