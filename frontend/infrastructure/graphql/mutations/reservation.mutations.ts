import { gql } from '@apollo/client';

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      eventId
      ticketCode
      status
      quantity
      createdAt
    }
  }
`;

export const CONFIRM_RESERVATION = gql`
  mutation ConfirmReservation($id: String!) {
    confirmReservation(id: $id) {
      id
      status
    }
  }
`;

export const REFUSE_RESERVATION = gql`
  mutation RefuseReservation($id: String!) {
    refuseReservation(id: $id) {
      id
      status
    }
  }
`;

export const CANCEL_RESERVATION = gql`
  mutation CancelReservation($id: String!) {
    cancelReservation(id: $id) {
      id
      status
    }
  }
`;
