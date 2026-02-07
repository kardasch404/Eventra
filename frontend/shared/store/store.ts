import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import eventsReducer from './slices/events.slice';
import reservationsReducer from './slices/reservations.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    reservations: reservationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
