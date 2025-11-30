"use client";

import React, { useEffect, useState } from "react";
import { getMe, getArtistProfile, patchArtistProfile, getBuyerProfile, patchBuyerProfile } from "@/lib/authClient";
import http from "@/lib/http";

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [buyerProfile, setBuyerProfile] = useState<any>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    (async () => {
      // Prefer server user from /api/auth/me; fallback to localStorage snapshot
      try {
        const me = await getMe();
        setUser(me);
        setFirstName(me.first_name || "");
        setLastName(me.last_name || "");
        setEmail(me.email || "");
        const roleLower = (me?.role || '').toLowerCase();
        if (roleLower === 'artist') {
          try { const ap = await getArtistProfile(); setArtistProfile(ap); } catch {}
        } else if (roleLower === 'buyer') {
          try { const bp = await getBuyerProfile(); setBuyerProfile(bp); } catch {}
        }
        return;
      } catch {}
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser(parsed);
          setFirstName(parsed.first_name || parsed.firstName || "");
          setLastName(parsed.last_name || parsed.lastName || "");
          setEmail(parsed.email || "");
        }
      } catch {}
    })();
  }, []);

  function save() {
    setSaving(true);
    try {
      const next = { ...(user || {}), firstName, lastName, email };
      localStorage.setItem("user", JSON.stringify(next));
      setUser(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Profile</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Update your profile details used by the demo account.</p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {user && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
                <h3 className="font-semibold mb-2">About</h3>
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  <div><span className="font-medium">Username:</span> {user.username}</div>
                  <div><span className="font-medium">Role:</span> {String(user.role || user.user_role || "").toLowerCase()}</div>
                  <div><span className="font-medium">Email:</span> {user.email}</div>
                  {user.phone && <div><span className="font-medium">Phone:</span> {user.phone}</div>}
                  {user.join_date && <div><span className="font-medium">Joined:</span> {new Date(user.join_date).toLocaleString()}</div>}
                  {typeof user.is_verified !== "undefined" && (
                    <div><span className="font-medium">Verified:</span> {user.is_verified ? "Yes" : "No"}</div>
                  )}
                </div>
              </div>

              {(artistProfile || user.artist_profile) && (
                <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
                  <h3 className="font-semibold mb-2">Artist Profile</h3>
                  <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                    {((artistProfile || user.artist_profile).profile_photo) && (
                      <img src={(artistProfile || user.artist_profile).profile_photo} alt="Profile" className="w-24 h-24 object-cover rounded" />
                    )}
                    {((artistProfile || user.artist_profile).bio) && <div><span className="font-medium">Bio:</span> {(artistProfile || user.artist_profile).bio}</div>}
                    {((artistProfile || user.artist_profile).specialization) && <div><span className="font-medium">Specialization:</span> {(artistProfile || user.artist_profile).specialization}</div>}
                    {typeof (artistProfile || user.artist_profile).experience_years !== "undefined" && (
                      <div><span className="font-medium">Experience:</span> {(artistProfile || user.artist_profile).experience_years} years</div>
                    )}
                    {typeof (artistProfile || user.artist_profile).verified_by_admin !== "undefined" && (
                      <div><span className="font-medium">Verified by Admin:</span> {(artistProfile || user.artist_profile).verified_by_admin ? "Yes" : "No"}</div>
                    )}
                    {((artistProfile || user.artist_profile).country) && <div><span className="font-medium">Country:</span> {(artistProfile || user.artist_profile).country}</div>}
                    {((artistProfile || user.artist_profile).city) && <div><span className="font-medium">City:</span> {(artistProfile || user.artist_profile).city}</div>}
                    {((artistProfile || user.artist_profile).website) && <div><span className="font-medium">Website:</span> <a href={(artistProfile || user.artist_profile).website} className="text-emerald-600" target="_blank" rel="noreferrer">{(artistProfile || user.artist_profile).website}</a></div>}
                    {((artistProfile || user.artist_profile).instagram) && <div><span className="font-medium">Instagram:</span> <a href={(artistProfile || user.artist_profile).instagram} className="text-emerald-600" target="_blank" rel="noreferrer">{(artistProfile || user.artist_profile).instagram}</a></div>}
                    {((artistProfile || user.artist_profile).facebook) && <div><span className="font-medium">Facebook:</span> <a href={(artistProfile || user.artist_profile).facebook} className="text-emerald-600" target="_blank" rel="noreferrer">{(artistProfile || user.artist_profile).facebook}</a></div>}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="grid gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">First name</span>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Last name</span>
              <input value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</span>
              <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </label>

            <div className="flex items-center gap-3 mt-2">
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
                {saving ? "Saving..." : "Save"}
              </button>
              {saved && <span className="text-sm text-emerald-600 dark:text-emerald-300">Saved</span>}
            </div>
          </div>
          <hr className="my-6 border-gray-200 dark:border-gray-700" />
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          {pwError && <div className="mb-2 text-sm text-red-600 dark:text-red-400">{pwError}</div>}
          {pwSuccess && <div className="mb-2 text-sm text-emerald-700 dark:text-emerald-300">{pwSuccess}</div>}
          <div className="grid gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Old password</span>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">New password</span>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Confirm new password</span>
              <input type="password" value={newPassword2} onChange={e => setNewPassword2(e.target.value)} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </label>
            <div>
              <button
                onClick={async () => {
                  setPwError(null); setPwSuccess(null);
                  if (!oldPassword || !newPassword || !newPassword2) { setPwError('All fields are required'); return; }
                  if (newPassword.length < 8) { setPwError('New password must be at least 8 characters'); return; }
                  if (newPassword !== newPassword2) { setPwError('New passwords do not match'); return; }
                  try {
                    const res = await http.post('/api/auth/change-password', {
                      old_password: oldPassword,
                      new_password: newPassword,
                      new_password2: newPassword2,
                    });
                    const msg = res?.data?.message || 'Password changed successfully.';
                    setPwSuccess(msg);
                    setOldPassword(''); setNewPassword(''); setNewPassword2('');
                  } catch (e: any) {
                    setPwError(String(e?.response?.data?.message || e?.message || 'Change password failed'));
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
              >
                Change Password
              </button>
            </div>
          </div>
          {((user?.role || '').toLowerCase() === 'artist') && (
            <>
              <hr className="my-6 border-gray-200 dark:border-gray-700" />
              <h3 className="text-lg font-semibold mb-2">Update Artist Profile</h3>
              <div className="grid gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Bio</span>
                  <textarea defaultValue={artistProfile?.bio || ''} onChange={e => setArtistProfile({ ...(artistProfile || {}), bio: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" rows={4} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Website</span>
                  <input defaultValue={artistProfile?.website || ''} onChange={e => setArtistProfile({ ...(artistProfile || {}), website: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Specialization</span>
                  <input defaultValue={artistProfile?.specialization || ''} onChange={e => setArtistProfile({ ...(artistProfile || {}), specialization: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Experience (years)</span>
                  <input type="number" defaultValue={artistProfile?.experience_years ?? ''} onChange={e => setArtistProfile({ ...(artistProfile || {}), experience_years: Number(e.target.value) })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Country</span>
                    <input defaultValue={artistProfile?.country || ''} onChange={e => setArtistProfile({ ...(artistProfile || {}), country: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">City</span>
                    <input defaultValue={artistProfile?.city || ''} onChange={e => setArtistProfile({ ...(artistProfile || {}), city: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex flex-col"><span className="text-sm font-medium">Instagram</span><input defaultValue={artistProfile?.instagram || ''} onChange={e => setArtistProfile({ ...(artistProfile || {}), instagram: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700" /></label>
                  <label className="flex flex-col"><span className="text-sm font-medium">Facebook</span><input defaultValue={artistProfile?.facebook || ''} onChange={e => setArtistProfile({ ...(artistProfile || {}), facebook: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700" /></label>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={async () => {
                      try {
                        setProfileSaving(true); setProfileSaved(false);
                        const payload: Record<string, any> = {};
                        const fields = ['bio','website','specialization','experience_years','country','city','instagram','facebook'];
                        fields.forEach(f => {
                          if (typeof (artistProfile || {})[f] !== 'undefined') payload[f] = (artistProfile as any)[f];
                        });
                        await patchArtistProfile(payload);
                        setProfileSaved(true);
                        setTimeout(() => setProfileSaved(false), 2000);
                      } catch (e) {}
                      finally { setProfileSaving(false); }
                    }}
                    disabled={profileSaving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                  >
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                  {profileSaved && <span className="text-sm text-emerald-600 dark:text-emerald-300">Saved</span>}
                </div>
              </div>
            </>
          )}

          {((user?.role || '').toLowerCase() === 'buyer') && (
            <>
              <hr className="my-6 border-gray-200 dark:border-gray-700" />
              <h3 className="text-lg font-semibold mb-2">Update Buyer Profile</h3>
              <div className="grid gap-4">
                <label className="flex flex-col"><span className="text-sm font-medium">Address</span><input defaultValue={buyerProfile?.address || ''} onChange={e => setBuyerProfile({ ...(buyerProfile || {}), address: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700" /></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex flex-col"><span className="text-sm font-medium">City</span><input defaultValue={buyerProfile?.city || ''} onChange={e => setBuyerProfile({ ...(buyerProfile || {}), city: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700" /></label>
                  <label className="flex flex-col"><span className="text-sm font-medium">Country</span><input defaultValue={buyerProfile?.country || ''} onChange={e => setBuyerProfile({ ...(buyerProfile || {}), country: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700" /></label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex flex-col"><span className="text-sm font-medium">Phone</span><input defaultValue={buyerProfile?.phone || ''} onChange={e => setBuyerProfile({ ...(buyerProfile || {}), phone: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700" /></label>
                  <label className="flex flex-col"><span className="text-sm font-medium">Email</span><input defaultValue={buyerProfile?.email || ''} onChange={e => setBuyerProfile({ ...(buyerProfile || {}), email: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700" /></label>
                </div>
                <label className="flex flex-col"><span className="text-sm font-medium">Date of Birth</span><input type="date" defaultValue={buyerProfile?.date_of_birth || ''} onChange={e => setBuyerProfile({ ...(buyerProfile || {}), date_of_birth: e.target.value })} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700" /></label>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={async () => {
                      try {
                        setProfileSaving(true); setProfileSaved(false);
                        const payload: Record<string, any> = {};
                        const fields = ['address','city','country','date_of_birth','phone','email'];
                        fields.forEach(f => {
                          if (typeof (buyerProfile || {})[f] !== 'undefined') payload[f] = (buyerProfile as any)[f];
                        });
                        await patchBuyerProfile(payload);
                        setProfileSaved(true);
                        setTimeout(() => setProfileSaved(false), 2000);
                      } catch (e) {}
                      finally { setProfileSaving(false); }
                    }}
                    disabled={profileSaving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                  >
                    {profileSaving ? 'Saving...' : 'Save Buyer Profile'}
                  </button>
                  {profileSaved && <span className="text-sm text-emerald-600 dark:text-emerald-300">Saved</span>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

