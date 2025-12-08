"use client";

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';

export default function AddBuyerModal({ onClose, onSave }: { onClose: () => void; onSave: (b: any) => void }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) return alert('Passwords do not match');
    onSave({
      username,
      email,
      password,
      password2,
      role: 'buyer',
      first_name: firstName,
      last_name: lastName,
      phone,
      address,
      city,
      country,
    });
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} title="Add Buyer">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200">First Name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200">Last Name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" type="email" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" type="password" required minLength={8} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200">Confirm</label>
            <input value={password2} onChange={e => setPassword2(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" type="password" required minLength={8} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">Phone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200">City</label>
            <input value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200">Country</label>
            <input value={country} onChange={e => setCountry(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded bg-white dark:bg-gray-700">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Add</button>
        </div>
      </form>
    </Modal>
  );
}
