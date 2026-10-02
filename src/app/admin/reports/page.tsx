import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import { updateReportStatus } from "@/lib/actions/reports";

export const metadata: Metadata = {
  title: "Report queue",
};

type ReportWithRelations = Awaited<ReturnType<typeof getReports>>[number];

async function getReports() {
  return db.report.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      listing: { select: { id: true, title: true } },
      roommatePost: { select: { id: true, title: true } },
      reportedUser: { select: { id: true, name: true } },
    },
  });
}

export default async function AdminReportsPage() {
  await requireAdmin();
  const reports = await getReports();

  const open = reports.filter((r) => r.status === "open");
  const reviewed = reports.filter((r) => r.status !== "open");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Report queue</h1>
      <p className="mt-1 text-sm text-muted">
        Reported listings, posts, and profiles stay visible on the site until you
        mark them resolved or dismissed here.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold tracking-tight">Open ({open.length})</h2>
        {open.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nothing waiting on review.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {open.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </ul>
        )}
      </section>

      {reviewed.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight">Reviewed</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {reviewed.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function targetInfo(report: ReportWithRelations) {
  if (report.listing) {
    return { label: `Listing: ${report.listing.title}`, href: `/listings/${report.listing.id}` };
  }
  if (report.roommatePost) {
    return {
      label: `Roommate post: ${report.roommatePost.title}`,
      href: `/roommates/${report.roommatePost.id}`,
    };
  }
  if (report.reportedUser) {
    return { label: `Profile: ${report.reportedUser.name}`, href: `/users/${report.reportedUser.id}` };
  }
  return { label: "Deleted content", href: null };
}

function ReportRow({ report }: { report: ReportWithRelations }) {
  const target = targetInfo(report);

  return (
    <li className="rounded-xl border border-card-border bg-card p-5 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {target.href ? (
            <Link href={target.href} className="font-semibold text-garnet hover:underline">
              {target.label}
            </Link>
          ) : (
            <span className="font-semibold text-muted">{target.label}</span>
          )}
          <p className="mt-1 text-muted">Reason: {report.reason}</p>
          {report.details && <p className="mt-1">{report.details}</p>}
          <p className="mt-2 text-xs text-muted">
            Reported by {report.reporter.name} ({report.reporter.email}) &middot;{" "}
            {report.createdAt.toLocaleDateString("en-CA", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {report.status === "open" ? (
          <div className="flex shrink-0 gap-2">
            <form action={updateReportStatus.bind(null, report.id, "resolved")}>
              <button
                type="submit"
                className="rounded-full bg-garnet px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-garnet-dark"
              >
                Mark resolved
              </button>
            </form>
            <form action={updateReportStatus.bind(null, report.id, "dismissed")}>
              <button
                type="submit"
                className="rounded-full border border-card-border px-3 py-1.5 text-xs font-semibold transition hover:border-garnet hover:text-garnet"
              >
                Dismiss
              </button>
            </form>
          </div>
        ) : (
          <span className="shrink-0 rounded-full bg-card-border/40 px-3 py-1 text-xs font-semibold capitalize text-muted">
            {report.status}
          </span>
        )}
      </div>
    </li>
  );
}
