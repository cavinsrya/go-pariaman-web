import { Container } from "@/components/common/container";
import SignInForm from "./_components/login-form";

export const metadata = {
  title: "POS | Login",
};

export default function LoginPage() {
  return (
    <main className="py-10 md:py-16">
      <Container className="flex flex-col items-center gap-8">
        <SignInForm />
      </Container>
    </main>
  );
}
