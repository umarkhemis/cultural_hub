
import { AuthShell } from "@/src/components/layout/auth-shell";
import { RegisterView } from "@/src/features/auth/register-view";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join as a tourist or cultural service provider."
    >
      <RegisterView />
    </AuthShell>
  );
}