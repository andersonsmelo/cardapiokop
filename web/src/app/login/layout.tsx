import { AuthProviders } from "@/providers/AuthProviders";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProviders>{children}</AuthProviders>;
}
