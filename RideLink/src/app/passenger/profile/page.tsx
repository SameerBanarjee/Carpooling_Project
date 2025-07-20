import { DashboardLayout } from '@/components/dashboard-layout';
import { UserProfile } from '@/components/user-profile';

export default function PassengerProfilePage() {
  return (
    <DashboardLayout userType="passenger">
      <UserProfile userType="passenger" />
    </DashboardLayout>
  );
}
