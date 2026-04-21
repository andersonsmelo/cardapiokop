import { AuthProviders } from '@/providers/AuthProviders';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProviders>{children}</AuthProviders>;
}
