import { Ride, Booking, Profile } from './types';

class DataStore {
  private rides: Ride[] = [];
  private bookings: Booking[] = [];
  private profiles: Profile[] = [];
  private users: Array<{ id: string; user_type: 'driver' | 'passenger'; name: string; email: string; password: string; mobile: string; }> = [];
  private nextRideId = 1;
  private nextBookingId = 1;
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || this.initialized) {
      return;
    }

    try {
      const storedRides = localStorage.getItem('rides');
      const storedBookings = localStorage.getItem('bookings');
      const storedNextRideId = localStorage.getItem('nextRideId');
      const storedNextBookingId = localStorage.getItem('nextBookingId');
      const storedUsers = localStorage.getItem('users');

      if (storedRides) {
        this.rides = JSON.parse(storedRides);
      } else {
        this.rides = [];
        this.saveRides();
      }

      if (storedBookings) {
        this.bookings = JSON.parse(storedBookings);
      } else {
        this.bookings = [];
        this.saveBookings();
      }

      if (storedNextRideId) {
        this.nextRideId = JSON.parse(storedNextRideId);
      } else {
        this.nextRideId = this.rides.length > 0 ? Math.max(...this.rides.map(r => r.id)) + 1 : 1;
        localStorage.setItem('nextRideId', JSON.stringify(this.nextRideId));
      }

      if (storedNextBookingId) {
        this.nextBookingId = JSON.parse(storedNextBookingId);
      } else {
        this.nextBookingId = this.bookings.length > 0 ? Math.max(...this.bookings.map(b => b.id)) + 1 : 1;
        localStorage.setItem('nextBookingId', JSON.stringify(this.nextBookingId));
      }
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = [];
        this.saveUsers();
      }
    } catch (error) {
      console.error("Could not initialize data store", error);
    }
    this.initialized = true;
  }
  
  private saveAll() {
    this.saveRides();
    this.saveBookings();
    this.saveUsers();
  }

  private saveUsers() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  getUserByEmailAndType(email: string, user_type: 'driver' | 'passenger') {
    this.init();
    return this.users.find(u => u.email === email && u.user_type === user_type) || null;
  }

  createUser(user: { user_type: 'driver' | 'passenger'; name: string; email: string; password: string; mobile: string; }) {
    this.init();
    if (this.getUserByEmailAndType(user.email, user.user_type)) {
      return null; // User already exists
    }
    const id = `${user.user_type}-${Date.now()}`;
    const newUser = { ...user, id };
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  validateUserPassword(email: string, password: string, user_type: 'driver' | 'passenger') {
    this.init();
    const user = this.getUserByEmailAndType(email, user_type);
    if (!user) return false;
    return user.password === password;
  }

  private saveRides() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rides', JSON.stringify(this.rides));
      localStorage.setItem('nextRideId', JSON.stringify(this.nextRideId));
    }
  }

  private saveBookings() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
      localStorage.setItem('nextBookingId', JSON.stringify(this.nextBookingId));
    }
  }

  // --- RIDES ---

  updateRide(id: number, updatedRide: Partial<Ride>): Ride | null {
    this.init();
    const idx = this.rides.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.rides[idx] = { ...this.rides[idx], ...updatedRide };
    this.saveRides();
    return { ...this.rides[idx] };
  }

  deleteRide(id: number): boolean {
    this.init();
    const idx = this.rides.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.rides.splice(idx, 1);
    this.saveRides();
    return true;
  }

  getRides(): Ride[] {
    this.init();
    return JSON.parse(JSON.stringify(this.rides));
  }

  getRideById(id: number): Ride | null {
    this.init();
    const ride = this.rides.find((r) => r.id === id);
    return ride ? { ...ride } : null;
  }

  getRidesByDriverId(driverId: string): Ride[] {
    this.init();
    return JSON.parse(JSON.stringify(this.rides.filter(r => r.driver_id === driverId)));
  }

  createRide(rideData: Omit<Ride, 'id' | 'created_at' | 'status'>): Ride {
    this.init();
    const newRide: Ride = {
      ...rideData,
      id: this.nextRideId++,
      status: 'Upcoming',
      created_at: new Date().toISOString(),
    };
    this.rides.push(newRide);
    this.saveRides();
    return { ...newRide };
  }

  // --- BOOKINGS ---

  getBookings(): Booking[] {
    this.init();
    return JSON.parse(JSON.stringify(this.bookings));
  }

  getBookingsByPassengerId(passengerId: string): Booking[] {
    this.init();
    return JSON.parse(JSON.stringify(this.bookings.filter(b => b.passenger_id === passengerId)));
  }

  getBookingsForRide(rideId: number): Booking[] {
    this.init();
    return JSON.parse(JSON.stringify(this.bookings.filter(b => b.ride_id === rideId)));
  }

  createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'booking_status'>): Booking | null {
    this.init();
    const ride = this.rides.find(r => r.id === bookingData.ride_id);
    if (!ride) {
        return null;
    }
    
    const bookings = this.getBookingsForRide(ride.id);
    const bookedSeats = bookings.reduce((acc, b) => acc + b.seats_booked, 0);
    const remainingSeats = ride.available_seats - bookedSeats;

    if (remainingSeats < bookingData.seats_booked) {
        return null; // Not enough seats
    }

    const newBooking: Booking = {
        ...bookingData,
        id: this.nextBookingId++,
        booking_status: 'Confirmed',
        created_at: new Date().toISOString()
    };
    this.bookings.push(newBooking);
    this.saveBookings();
    return { ...newBooking };
  }
}

const dataStore = new DataStore();

export { dataStore };
