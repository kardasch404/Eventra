import { gql } from '@apollo/client';

export const GET_MY_RESERVATIONS = gql`
  query GetMyReservations {
    getMyReservations {
      id
      ticketCode
      status
      event {
        id
        title
        startDate
        endDate
        location {
          address
          city
          country
        }
      }
      createdAt
    }
  }
`;

export const GET_RESERVATION = gql`
  query GetReservation($id: String!) {
    getReservation(id: $id) {
      id
      ticketCode
      status
      event {
        id
        title
        description
        startDate
        endDate
        location {
          address
          city
          country
        }
      }
      user {
        id
        email
        firstName
        lastName
      }
      createdAt
    }
  }
`;

export const GET_ALL_RESERVATIONS = gql`
  query GetAllReservations($filters: ReservationFiltersInput, $pagination: PaginationInput) {
    getAllReservations(filters: $filters, pagination: $pagination) {
      reservations {
        id
        ticketCode
        status
        event {
          id
          title
        }
        user {
          id
          email
          firstName
          lastName
        }
        createdAt
      }
      total
      page
      limit
    }
  }
`;
