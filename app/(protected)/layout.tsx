import { EnvVarWarning } from "@/components/ui/env-var-warning";
import { AuthButton } from "@/features/auth/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { ThemeSwitch } from "@/components/ui/theme-switch";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
