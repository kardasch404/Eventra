import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query GetEvents($filters: EventFiltersInput) {
    events(filters: $filters) {
      events {
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
          display
          duration
        }
        location {
          mode
          address
          city
          country
          venue
          coordinates {
            lat
            lng
          }
        }
        capacity
        bookedCount
        availableSeats
        hero {
          url
          alt
          width
          height
        }
        highlights {
          icon
          text
        }
        organizerId
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

export const GET_ALL_EVENTS = gql`
  query GetAllEvents {
    events {
      events {
        id
        title
        slug
        status
        category
        capacity
        bookedCount
        createdAt
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: String!) {
    event(id: $id) {
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
        display
        duration
      }
      location {
        mode
        address
        city
        country
        venue
        coordinates {
          lat
          lng
        }
      }
      capacity
      bookedCount
      availableSeats
      hero {
        url
        alt
        width
        height
      }
      highlights {
        icon
        text
      }
      organizerId
      createdAt
      updatedAt
    }
  }
`;
