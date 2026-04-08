"use client";

import { deleteTrip } from "@/lib/actions/delete-trip";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

export default function TripCardActions({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm) { setConfirm(true); return; }
    startTransition(() => deleteTrip(tripId));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/trips/${tripId}/edit`);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirm(false);
  };

  if (confirm) {
    return (
      <div
        className="flex items-center gap-1.5"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors disabled:opacity-60"
        >
          {isPending ? "Deleting…" : "Confirm"}
        </button>
        <button
          onClick={handleCancel}
          className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleEdit}
        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150"
        title="Edit trip"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={handleDelete}
        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
        title="Delete trip"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
