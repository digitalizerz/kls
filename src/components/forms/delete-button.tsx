"use client";

import { useState } from "react";
import { DeleteDialog } from "@/components/data-table/row-actions";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  fields,
  confirm,
  title = "Delete this record?",
  label = "Delete",
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
  confirm: string;
  title?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = fields.id;

  return (
    <>
      <Button type="button" variant="danger" size="sm" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <DeleteDialog
        open={open}
        title={title}
        confirm={confirm}
        action={action}
        ids={id ? [id] : []}
        returnTo={fields.returnTo ?? "/admin"}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
