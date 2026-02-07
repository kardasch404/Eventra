import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  location: {
    address?: string;
    city: string;
    country: string;
  };
  maxAttendees: number;
  currentAttendees: number;
  heroImage?: {
    url: string;
    alt: string;
  };
}

interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  selectedEvent: null,
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<{ events: Event[]; total: number; page: number; limit: number }>) => {
      state.events = action.payload.events;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.loading = false;
      state.error = null;
    },
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearEvents: (state) => {
      state.events = [];
      state.total = 0;
    },
  },
});

export const { setEvents, setSelectedEvent, setLoading, setError, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
