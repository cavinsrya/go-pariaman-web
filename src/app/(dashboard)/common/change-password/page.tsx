import { ChangePasswordForm } from "./_components/change-password";

export const metadata = {
  title: "Change Password",
};

export default function ChangePasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
