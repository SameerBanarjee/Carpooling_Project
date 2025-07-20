import { DashboardLayout } from '@/components/dashboard-layout';
import { UserProfile } from '@/components/user-profile';

export default function Page() {
  return (
    <DashboardLayout userType="driver">
      <UserProfile userType="driver" />
    </DashboardLayout>
  );
}
