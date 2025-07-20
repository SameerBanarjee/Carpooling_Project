// This represents a single ride in the system.
export interface Ride {
  id: number;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  available_seats: number;
  price_per_seat: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  driver_id: string;
  driver_name: string;
  driver_avatar_url: string;
  created_at: string;
}

// This represents a booking made by a passenger for a ride.
export interface Booking {
  id: number;
  ride_id: number;
  passenger_id: string;
  seats_booked: number;
  booking_status: 'Confirmed' | 'Cancelled';
  created_at: string;
}

// This represents a user profile for either a driver or a passenger.
export interface Profile {
  id: string;
  user_type: 'driver' | 'passenger';
  full_name: string;
  avatar_url?: string;
  mobile_number?: string;
}
