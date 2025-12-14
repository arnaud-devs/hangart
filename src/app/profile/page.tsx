"use client"

import React, { useEffect, useState } from 'react'
import { appClient } from '@/lib/appClient'
import type { BuyerProfileDTO } from '@/lib/types/api'
import { useRouter } from 'next/navigation'

type BuyerProfile = BuyerProfileDTO

export default function ProfilePage() {
  const [buyer, setBuyer] = useState<BuyerProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<Partial<BuyerProfile>>({})
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)

  const [pwdOld, setPwdOld] = useState('')
  const [pwdNew, setPwdNew] = useState('')
  const [pwdNew2, setPwdNew2] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMessage, setPwdMessage] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    fetchBuyerProfile()
  }, [])

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://hangart.pythonanywhere.com').replace(/\/api\/?$/, '')

  async function fetchBuyerProfile() {
    try {
      setLoading(true); setError(null)
      const data = await appClient.getBuyerProfile()
      setBuyer(data)
      setForm({
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
        date_of_birth: data.date_of_birth || '',
      })
    } catch (err: any) {
      const msg = err?.message || String(err)
      setError(msg)
      if (err?.status === 401 || /unauthoriz/i.test(msg)) {
        try { router.push('/login') } catch {}
      }
    } finally {
      setLoading(false)
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function saveChanges() {
    try {
      setSaving(true); setSaveMessage(null);
      // Only send fields that have changed (not empty or unchanged)
      let changed: Record<string, any> = {};
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== buyer?.[k as keyof BuyerProfile]) {
          changed[k] = v;
        }
      });
      let payload: any = changed;
      // If a new profile photo is selected, use FormData
      if (profilePhotoFile) {
        const fd = new FormData();
        Object.entries(changed).forEach(([k, v]) => {
          fd.append(k, v as string);
        });
        fd.append('profile_photo', profilePhotoFile);
        payload = fd;
      }
      if (Object.keys(changed).length === 0 && !profilePhotoFile) {
        setSaveMessage('No changes to save');
        setSaving(false);
        return;
      }
      const updated = await appClient.updateBuyerProfile(payload);
      setBuyer(updated);
      setSaveMessage('Profile updated successfully');
      setEditMode(false);
      setProfilePhotoFile(null);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (!pwdOld || !pwdNew || !pwdNew2) {
      setPwdMessage('Please fill all password fields')
      return
    }
    if (pwdNew !== pwdNew2) {
      setPwdMessage('New passwords do not match')
      return
    }
    try {
      setPwdLoading(true); setPwdMessage(null)
      const data = await appClient.post('/auth/change-password/', { old_password: pwdOld, new_password: pwdNew, new_password2: pwdNew2 })
      setPwdMessage(data?.message || 'Password changed successfully')
      setPwdOld(''); setPwdNew(''); setPwdNew2('')
      setTimeout(() => setPwdMessage(null), 3000)
    } catch (err: any) {
      setPwdMessage(err?.message || String(err))
    } finally {
      setPwdLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center"> 
        <div className="animate-spin h-10 w-10 border-2 border-yellow-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-yellow-50 to-white dark:from-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditMode(!editMode)} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">{editMode ? 'Cancel' : 'Edit'}</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-yellow-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-4 border-yellow-100">
                {buyer?.profile_photo ? (
                  <img
                    src={buyer.profile_photo.startsWith('http') ? buyer.profile_photo : `${API_BASE}${buyer.profile_photo}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src="/arts/art1.jpeg" alt="avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="mt-4 text-center">
                <div className="font-bold text-lg">{buyer?.username}</div>
                <div className="text-sm text-yellow-600 font-semibold">Buyer</div>
                {/* No join_date in buyer profile */}
              </div>
            </div>

            <div className="md:col-span-2">
              {!editMode ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{buyer?.email || '—'}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{buyer?.phone || '—'}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Address</div>
                    <div className="font-medium">{buyer?.address || '—'}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">City</div>
                    <div className="font-medium">{buyer?.city || '—'}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Country</div>
                    <div className="font-medium">{buyer?.country || '—'}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Date of Birth</div>
                    <div className="font-medium">{buyer?.date_of_birth || '—'}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Profile photo upload */}
                  <div>
                    <label className="text-sm text-gray-700">Profile Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setProfilePhotoFile(e.target.files?.[0] || null)}
                      className="w-full mt-1 p-2 border rounded-md border-yellow-200 focus:ring-2 focus:ring-yellow-600"
                    />
                    {profilePhotoFile && (
                      <div className="mt-2 text-xs text-gray-500">Selected: {profilePhotoFile.name}</div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-700">Email</label>
                      <input name="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full mt-1 p-2 border rounded-md border-yellow-200 focus:ring-2 focus:ring-yellow-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Phone</label>
                      <input name="phone" value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full mt-1 p-2 border rounded-md border-yellow-200 focus:ring-2 focus:ring-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Address</label>
                    <input name="address" value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full mt-1 p-2 border rounded-md border-yellow-200 focus:ring-2 focus:ring-yellow-600" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-700">City</label>
                      <input name="city" value={form.city || ''} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full mt-1 p-2 border rounded-md border-yellow-200 focus:ring-2 focus:ring-yellow-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Country</label>
                      <input name="country" value={form.country || ''} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="w-full mt-1 p-2 border rounded-md border-yellow-200 focus:ring-2 focus:ring-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Date of Birth</label>
                    <input name="date_of_birth" type="date" value={form.date_of_birth || ''} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} className="w-full mt-1 p-2 border rounded-md border-yellow-200 focus:ring-2 focus:ring-yellow-600" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={saveChanges} disabled={saving} className="px-4 py-2 bg-yellow-600 text-white rounded-md">{saving ? 'Saving...' : 'Save changes'}</button>
                    <button onClick={() => { setEditMode(false); setForm({
                      email: buyer?.email || '',
                      phone: buyer?.phone || '',
                      address: buyer?.address || '',
                      city: buyer?.city || '',
                      country: buyer?.country || '',
                      date_of_birth: buyer?.date_of_birth || '',
                    }); setProfilePhotoFile(null); }} className="px-4 py-2 border rounded-md">Cancel</button>
                  </div>
                  {saveMessage && <div className="text-sm text-yellow-600">{saveMessage}</div>}
                </div>
              )}

              {/* Password change (unchanged) */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Change password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input placeholder="Current password" type="password" value={pwdOld} onChange={e => setPwdOld(e.target.value)} className="p-2 border rounded-md border-yellow-200 focus:ring-2 focus:ring-yellow-600" />
                  <input placeholder="New password" type="password" value={pwdNew} onChange={e => setPwdNew(e.target.value)} className="p-2 border rounded-md border-yellow-200 focus:ring-2 focus:ring-yellow-600" />
                  <input placeholder="Confirm new" type="password" value={pwdNew2} onChange={e => setPwdNew2(e.target.value)} className="p-2 border rounded-md border-yellow-200 focus:ring-2 focus:ring-yellow-600" />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <button onClick={changePassword} disabled={pwdLoading} className="px-4 py-2 bg-yellow-600 text-white rounded-md">{pwdLoading ? 'Updating...' : 'Update password'}</button>
                  {pwdMessage && <div className="text-sm text-yellow-600">{pwdMessage}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

  );
}

