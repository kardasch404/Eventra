import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query GetEvents($filters: EventFiltersInput, $pagination: PaginationInput) {
    getEvents(filters: $filters, pagination: $pagination) {
      events {
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
        heroImage {
          url
          alt
        }
      }
      total
      page
      limit
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: String!) {
    getEvent(id: $id) {
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
      heroImage {
        url
        alt
      }
    }
  }
`;
