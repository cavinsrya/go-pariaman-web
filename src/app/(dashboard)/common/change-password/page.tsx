import { ChangePasswordForm } from "./_components/change-password";

export default function ChangePasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Change Password</h1>
          <p className="text-muted-foreground mt-2">
            Update your password to keep your account secure
          </p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
