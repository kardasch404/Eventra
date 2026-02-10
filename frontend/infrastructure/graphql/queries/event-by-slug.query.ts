import { gql } from '@apollo/client';

export const GET_EVENT_BY_SLUG = gql`
  query GetEventBySlug($slug: String!) {
    eventBySlug(slug: $slug) {
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
