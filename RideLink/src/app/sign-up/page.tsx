import { AuthForm } from '@/components/auth-form';
export default function Page() {
  // You can optionally allow user to choose type or default to passenger
  return <AuthForm userType="passenger" />;
}
