
import { AuthShell } from "@/src/components/layout/auth-shell";
import { LoginForm } from "@/src/features/auth/login-form";


export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to continue exploring and managing cultural tourism experiences."
    >
      <LoginForm />
    </AuthShell>
  );
}