import { gql } from '@apollo/client';

export const GET_EVENT_BY_SLUG = gql`
  query GetEventBySlug($slug: String!) {
    getEventBySlug(slug: $slug) {
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
