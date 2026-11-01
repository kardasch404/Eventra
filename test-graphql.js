const query = `
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

fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: {
      filters: { status: 'PUBLISHED' }
    }
  })
})
.then(res => res.json())
.then(data => {
  if (data.errors) {
    console.error('GRAPHQL ERRORS:', JSON.stringify(data.errors, null, 2));
  } else {
    console.log('SUCCESS: Got', data.data.events.events.length, 'events');
  }
})
.catch(err => console.error(err));
