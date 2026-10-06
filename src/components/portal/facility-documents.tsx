"use client";

import { useRef, useState } from "react";
import { FACILITY_FILE_ACCEPT, facilityFileError, formatFileSize } from "@/lib/facility-files";

const categories = [
  { field: "wasteManifests", label: "Pick-up manifests" },
  { field: "sizingDocuments", label: "Interceptor sizing documents" },
  { field: "buildingPlans", label: "Building plans" },
  { field: "plumbingPlans", label: "Plumbing plans" },
  { field: "serviceRecords", label: "Previous service records" },
  { field: "otherDocuments", label: "Other facility documentation" },
] as const;

type FieldName = (typeof categories)[number]["field"];

type Item = {
  id: string;
  field: FieldName;
  file: File;
};

export function FacilityDocuments({ pending }: { pending: boolean }) {
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState<FieldName>("wasteManifests");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputs = useRef<Partial<Record<FieldName, HTMLInputElement | null>>>({});

  function sync(next: Item[]) {
    for (const entry of categories) {
      const input = inputs.current[entry.field];
      if (!input) continue;
      const transfer = new DataTransfer();
      for (const item of next.filter((file) => file.field === entry.field)) {
        transfer.items.add(item.file);
      }
      input.files = transfer.files;
    }
  }

  function addFiles(list: FileList | File[]) {
    const next = [...items];
    let message: string | null = null;
    for (const file of Array.from(list)) {
      const problem = facilityFileError(file);
      if (problem) {
        message = problem;
        continue;
      }
      next.push({ id: crypto.randomUUID(), field: category, file });
    }
    setError(message);
    setItems(next);
    sync(next);
  }

  function remove(id: string) {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    sync(next);
  }

  return (
    <div className="space-y-4">
      {categories.map((entry) => (
        <input
          key={entry.field}
          ref={(node) => {
            inputs.current[entry.field] = node;
          }}
          type="file"
          name={entry.field}
          accept={FACILITY_FILE_ACCEPT}
          multiple
          className="sr-only"
          tabIndex={-1}
        />
      ))}
      <div>
        <h3 className="text-lg font-semibold text-ink">Facility documents</h3>
        <p className="mt-1 text-sm leading-6 text-muted">
          Pick-up manifests and interceptor sizing documents are the records KLS asks for first. Building plans, plumbing plans, previous service records, and other facility documents can be added as well. PDF and image files, up to 50 MB each.
        </p>
      </div>
      <label className="block text-sm font-medium" htmlFor="documentCategory">
        Document type
        <select
          id="documentCategory"
          value={category}
          onChange={(event) => setCategory(event.target.value as FieldName)}
          className="mt-1.5 h-11 w-full border border-line bg-white px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          {categories.map((entry) => (
            <option key={entry.field} value={entry.field}>
              {entry.label}
            </option>
          ))}
        </select>
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          addFiles(event.dataTransfer.files);
        }}
        className={`border border-dashed px-4 py-8 text-center ${dragOver ? "border-forest bg-cream" : "border-line"}`}
      >
        <p className="text-sm font-medium">Drag files here</p>
        <p className="mt-1 text-xs text-muted">or choose them from your computer</p>
        <label className="mt-4 inline-flex h-10 cursor-pointer items-center border border-line px-4 text-sm font-medium focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-forest">
          Browse files
          <input
            type="file"
            accept={FACILITY_FILE_ACCEPT}
            multiple
            className="sr-only"
            onChange={(event) => {
              if (event.target.files) addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {pending ? (
        <div>
          <div
            role="progressbar"
            aria-valuetext="Uploading documents"
            className="h-1.5 overflow-hidden bg-line"
          >
            <div className="h-full w-1/2 animate-pulse bg-forest" />
          </div>
          <p className="mt-2 text-sm text-muted">Uploading documents…</p>
        </div>
      ) : null}
      {items.length > 0 ? (
        <ul className="divide-y divide-line border border-line">
          {items.map((item) => {
            const label = categories.find((entry) => entry.field === item.field)?.label;
            return (
              <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-3">
                <div>
                  <p className="text-sm font-medium">{item.file.name}</p>
                  <p className="text-xs text-muted">
                    {label} · {formatFileSize(item.file.size)} · Ready to upload
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                  onClick={() => remove(item.id)}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="text-xs leading-5 text-muted">
        <span className="font-semibold text-ink">Secure & confidential. </span>
        Uploaded facility documentation is securely stored and treated as confidential operational information.
      </p>
    </div>
  );
}
