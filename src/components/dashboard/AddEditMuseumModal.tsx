"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";

type Museum = {
  id?: string;
  name?: string;
  description?: string;
  website?: string;
  country?: string;
  city?: string;
  image?: string;
  status?: "active" | "inactive";
};

type Props = {
  initial?: Museum;
  open?: boolean;
  onClose: () => void;
  onSave: (payload: Partial<Museum>) => void;
};

export default function AddEditMuseumModal({ initial, open = true, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<Museum['status']>("active");

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setDescription(initial.description || "");
      setWebsite(initial.website || "");
      setCity(initial.city || "");
      setCountry(initial.country || "");
      setStatus(initial.status || "active");
    }
  }, [initial]);

  function submit() {
    const payload: Partial<Museum> = {
      id: initial?.id,
      name,
      description,
      website,
      city,
      country,
      status,
    };
    onSave(payload);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Museum" : "Add Museum"}>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Website</label>
          <input value={website} onChange={e => setWebsite(e.target.value)} className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">City</label>
            <input value={city} onChange={e => setCity(e.target.value)} className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Country</label>
            <input value={country} onChange={e => setCountry(e.target.value)} className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border bg-white dark:bg-gray-700">Cancel</button>
          <button onClick={submit} className="px-3 py-1 rounded bg-emerald-600 text-white">Save</button>
        </div>
      </div>
    </Modal>
  );
}

