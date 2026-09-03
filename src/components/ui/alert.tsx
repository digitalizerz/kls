import { cn } from "@/lib/utils";

export function Alert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border px-3 py-2 text-sm",
        tone === "error" ? "border-danger/30 bg-red-50 text-danger" : "border-ok/30 bg-emerald-50 text-ok",
      )}
    >
      {children}
    </div>
  );
}
