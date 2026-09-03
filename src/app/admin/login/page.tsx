import { Logo } from "@/components/layout/logo";
import { LoginForm } from "@/components/auth/login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-forest">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 flex justify-center">
          <Logo href="/admin/login" tone="light" />
        </div>
        <div className="border border-white/10 bg-cream p-6">
          <h1 className="font-serif text-2xl">KLS staff sign in</h1>
          <p className="mt-1 mb-6 text-sm text-muted">
            Administrative access is not available through public registration.
          </p>
          <LoginForm audience="admin" />
        </div>
      </div>
    </div>
  );
}
