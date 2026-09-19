import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-1 text-muted">
        Use any email to sign up &mdash; a full Acadia rollout can require an @acadiau.ca
        address later.
      </p>

      <div className="mt-8">
        <SignupForm next={next} />
      </div>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-garnet hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
