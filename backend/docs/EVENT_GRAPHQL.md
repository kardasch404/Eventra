# Event GraphQL Operations

## Queries

### Get Paginated Events with Filters

```graphql
query GetEvents($filters: EventFiltersInput) {
  events(filters: $filters) {
    events {
      id
      slug
      title
      summary
      category
      type
      status
      capacity
      bookedCount
      availableSeats
      hero {
        url
        alt
      }
      dateTime {
        start
        end
        timezone
        display
        duration
      }
      location {
        country
        city
        address
        venue
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
```

**Variables:**
```json
{
  "filters": {
    "status": "PUBLISHED",
    "category": "Tech",
    "type": "ONLINE",
    "search": "conference",
    "page": 1,
    "limit": 10
  }
}
```

### Get Event by ID

```graphql
query GetEvent($id: String!) {
  event(id: $id) {
    id
    slug
    title
    summary
    description
    category
    type
    status
    hero {
      url
      alt
      width
      height
    }
    dateTime {
      start
      end
      timezone
      display
      duration
    }
    location {
      mode
      country
      city
      address
      venue
      coordinates {
        lat
        lng
      }
    }
    capacity
    bookedCount
    availableSeats
    organizerId
    highlights {
      icon
      text
    }
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "01JDQR8X9Y0Z1A2B3C4D5E6F7G"
}
```

### Get Event by Slug

```graphql
query GetEventBySlug($slug: String!) {
  eventBySlug(slug: $slug) {
    id
    slug
    title
    summary
    description
    category
    type
    status
    capacity
    bookedCount
    availableSeats
    createdAt
  }
}
```

**Variables:**
```json
{
  "slug": "tech-conference-2024"
}
```

## Mutations

### Create Event

```graphql
mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    id
    slug
    title
    status
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Tech Conference 2024",
    "summary": "Annual technology conference",
    "description": ["Join us for the biggest tech event", "Network with industry leaders"],
    "category": "Technology",
    "type": "IN_PERSON",
    "hero": {
      "url": "https://example.com/hero.jpg",
      "alt": "Conference Hero Image",
      "width": 1920,
      "height": 1080
    },
    "dateTime": {
      "start": "2024-12-01T09:00:00Z",
      "end": "2024-12-01T18:00:00Z",
      "timezone": "America/New_York"
    },
    "location": {
      "country": "United States",
      "city": "New York",
      "address": "123 Conference Center",
      "venue": "Grand Hall",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    },
    "capacity": 500,
    "highlights": [
      { "icon": "users", "text": "500+ Attendees" },
      { "icon": "mic", "text": "20+ Speakers" },
      { "icon": "clock", "text": "Full Day Event" }
    ]
  }
}
```

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

### Update Event

```graphql
mutation UpdateEvent($id: String!, $input: UpdateEventInput!) {
  updateEvent(id: $id, input: $input) {
    id
    title
    summary
    status
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "01JDQR8X9Y0Z1A2B3C4D5E6F7G",
  "input": {
    "title": "Tech Conference 2024 - Updated",
    "summary": "Updated summary",
    "capacity": 600
  }
}
```

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

### Publish Event

```graphql
mutation PublishEvent($id: String!) {
  publishEvent(id: $id) {
    id
    title
    status
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "01JDQR8X9Y0Z1A2B3C4D5E6F7G"
}
```

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

### Cancel Event

```graphql
mutation CancelEvent($id: String!) {
  cancelEvent(id: $id) {
    id
    title
    status
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "01JDQR8X9Y0Z1A2B3C4D5E6F7G"
}
```

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

## Filter Options

### EventFiltersInput

- `status` (EventStatus): Filter by event status (DRAFT, PUBLISHED, CANCELED)
- `organizerId` (String): Filter by organizer user ID
- `category` (String): Filter by event category
- `type` (EventType): Filter by event type (ONLINE, IN_PERSON)
- `search` (String): Search in title, summary, and category
- `page` (Int): Page number (default: 1)
- `limit` (Int): Items per page (default: 10)

## Enums

### EventStatus
- `DRAFT` - Event is in draft state
- `PUBLISHED` - Event is published and visible
- `CANCELED` - Event has been canceled

### EventType
- `ONLINE` - Virtual/online event
- `IN_PERSON` - Physical/in-person event

## Authorization

All mutations require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

Only the event organizer can update, publish, or cancel their events.

## Search Functionality

The `search` parameter performs case-insensitive search across:
- Event title
- Event summary
- Event category

Example:
```json
{
  "filters": {
    "search": "tech",
    "page": 1,
    "limit": 20
  }
}
```

## Pagination

All event queries support pagination:
- Default page size: 10
- Maximum page size: 100
- Returns total count and total pages

Response includes:
- `events`: Array of event objects
- `total`: Total number of matching events
- `page`: Current page number
- `limit`: Items per page
- `totalPages`: Total number of pages
