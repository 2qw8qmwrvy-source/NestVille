"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession, requireAdmin } from "@/lib/dal";
import { ReportSchema } from "@/lib/validation";

export type ReportFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

type ReportTarget =
  | { listingId: string }
  | { roommatePostId: string }
  | { reportedUserId: string };

export async function submitReport(
  target: ReportTarget,
  _prevState: ReportFormState,
  formData: FormData
): Promise<ReportFormState> {
  const session = await requireSession();

  const validated = ReportSchema.safeParse({
    reason: formData.get("reason"),
    details: formData.get("details") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await db.report.create({
    data: {
      ...validated.data,
      reporterId: session.userId,
      ...target,
    },
  });

  return { message: "success" };
}

export async function updateReportStatus(reportId: string, status: "resolved" | "dismissed") {
  await requireAdmin();
  await db.report.update({ where: { id: reportId }, data: { status } });
  revalidatePath("/admin/reports");
}
