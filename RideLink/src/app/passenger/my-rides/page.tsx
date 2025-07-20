import { DashboardLayout } from '@/components/dashboard-layout';
import { PassengerMyRides } from '@/components/passenger-my-rides';

export default function PassengerMyRidesPage() {
  return (
    <DashboardLayout userType="passenger">
      <PassengerMyRides />
    </DashboardLayout>
  );
}
