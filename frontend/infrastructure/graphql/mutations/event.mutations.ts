import { gql } from '@apollo/client';

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: String!) {
    deleteEvent(id: $id)
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      slug
      summary
      description
      status
      category
      type
      dateTime {
        start
        end
        timezone
      }
      location {
        mode
        address
        city
        country
        venue
      }
      capacity
      bookedCount
      createdAt
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: String!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      title
      slug
      summary
      description
      status
      category
      type
      dateTime {
        start
        end
        timezone
      }
      location {
        mode
        address
        city
        country
        venue
      }
      capacity
      bookedCount
      updatedAt
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
