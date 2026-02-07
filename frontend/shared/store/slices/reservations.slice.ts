import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Reservation {
  id: string;
  ticketCode: string;
  status: string;
  event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    location: {
      address?: string;
      city: string;
      country: string;
    };
  };
  createdAt: string;
}

interface ReservationsState {
  reservations: Reservation[];
  selectedReservation: Reservation | null;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: ReservationsState = {
  reservations: [],
  selectedReservation: null,
  total: 0,
  loading: false,
  error: null,
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.reservations = action.payload;
      state.total = action.payload.length;
      state.loading = false;
      state.error = null;
    },
    setSelectedReservation: (state, action: PayloadAction<Reservation | null>) => {
      state.selectedReservation = action.payload;
    },
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.unshift(action.payload);
      state.total += 1;
    },
    updateReservation: (state, action: PayloadAction<Reservation>) => {
      const index = state.reservations.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
    },
    removeReservation: (state, action: PayloadAction<string>) => {
      state.reservations = state.reservations.filter((r) => r.id !== action.payload);
      state.total -= 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearReservations: (state) => {
      state.reservations = [];
      state.total = 0;
    },
  },
});

export const {
  setReservations,
  setSelectedReservation,
  addReservation,
  updateReservation,
  removeReservation,
  setLoading,
  setError,
  clearReservations,
} = reservationsSlice.actions;
export default reservationsSlice.reducer;
