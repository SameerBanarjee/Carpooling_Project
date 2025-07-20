import { DashboardLayout } from '@/components/dashboard-layout';
import { DriverMyRides } from '@/components/driver-my-rides';

export default function DriverMyRidesPage() {
  return (
    <DashboardLayout userType="driver">
      <DriverMyRides />
    </DashboardLayout>
  );
}
