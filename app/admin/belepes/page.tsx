import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Belépés',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ tovabb?: string }>;
}) {
  const { tovabb } = await searchParams;
  // Only a path inside /admin survives to the form; the action re-checks it.
  const next = tovabb?.startsWith('/admin/') ? tovabb : '';

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-foreground">Belépés</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Az Enzo di Napoli weboldalának szerkesztőfelülete.
        </p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
