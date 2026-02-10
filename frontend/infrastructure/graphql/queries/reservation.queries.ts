import { gql } from '@apollo/client';

export const GET_MY_RESERVATIONS = gql`
  query GetMyReservations {
    myReservations {
      id
      eventId
      userId
      quantity
      ticketCode
      status
      confirmedAt
      canceledAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_RESERVATION = gql`
  query GetReservation($id: String!) {
    reservation(id: $id) {
      id
      eventId
      userId
      quantity
      ticketCode
      status
      confirmedAt
      canceledAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_RESERVATIONS = gql`
  query GetAllReservations {
    allReservations {
      id
      eventId
      userId
      quantity
      ticketCode
      status
      confirmedAt
      canceledAt
      createdAt
      updatedAt
    }
  }
`;
