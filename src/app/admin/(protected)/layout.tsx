import type { ReactNode } from "react"
import { requireAdmin } from "@/lib/auth"
import { AdminShell } from "@/components/admin/shell"

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin()
  return <AdminShell>{children}</AdminShell>
}
