"use client";

export default function DeleteButton({
  action,
  label = "Delete",
  confirmMessage = "Are you sure? This can't be undone.",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="w-full rounded-full border border-danger px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger hover:text-white"
      >
        {label}
      </button>
    </form>
  );
}
