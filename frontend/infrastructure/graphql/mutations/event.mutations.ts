import { gql } from '@apollo/client';

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      slug
      description
      status
      startDate
      endDate
      location {
        address
        city
        country
      }
      maxAttendees
      currentAttendees
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: String!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      title
      description
      status
    }
  }
`;

export const PUBLISH_EVENT = gql`
  mutation PublishEvent($id: String!) {
    publishEvent(id: $id) {
      id
      status
    }
  }
`;

export const CANCEL_EVENT = gql`
  mutation CancelEvent($id: String!) {
    cancelEvent(id: $id) {
      id
      status
    }
  }
`;
