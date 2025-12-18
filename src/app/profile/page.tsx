"use client"

import React, { useEffect, useState } from 'react'
import { appClient } from '@/lib/appClient'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Lock,
  Shield,
  Globe,
  Briefcase
} from 'lucide-react'

// Types remain the same...
type ArtistProfile = {
  id: number;
  user_id: number;
  username: string;
  bio: string | null;
  profile_photo: string | null;
  website: string | null;
  specialization: string | null;
  experience_years: number;
  phone: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  verified_by_admin: boolean;
  instagram: string | null;
  facebook: string | null;
  twitter_x: string | null;
  youtube: string | null;
  tiktok: string | null;
  linkedin: string | null;
};

type BuyerProfile = {
  id: number;
  user_id: number;
  username: string;
  email: string;
  profile_photo: string | null;
  phone: string;
  address: string;
  city: string;
  country: string;
  date_of_birth: string;
};

type AdminProfile = any;

type UserProfile = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  is_verified: boolean;
  join_date: string;
  artist_profile?: ArtistProfile | null;
  buyer_profile?: BuyerProfile | null;
  admin_profile?: AdminProfile | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [pwdOld, setPwdOld] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdNew2, setPwdNew2] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://hangart.pythonanywhere.com').replace(/\/api\/?$/, '');
  const editableFields = ['username', 'email', 'first_name', 'last_name', 'phone', 'address', 'city', 'country', 'date_of_birth', 'profile_photo'];

  async function fetchUserProfile() {
    try {
      setLoading(true);
      setError(null);
      const data = await appClient.get('/auth/me/');
      setUser(data);
      const initialForm: Record<string, any> = {};
      editableFields.forEach(field => {
        if (data.buyer_profile && data.buyer_profile[field] !== undefined) {
          initialForm[field] = data.buyer_profile[field] ?? '';
        } else if (data[field] !== undefined) {
          initialForm[field] = data[field] ?? '';
        } else {
          initialForm[field] = '';
        }
      });
      setForm(initialForm);
    } catch (err: any) {
      const msg = err?.message || String(err);
      setError(msg);
      if (err?.status === 401 || /unauthoriz/i.test(msg)) {
        try { router.push('/login'); } catch {}
      }
    } finally {
      setLoading(false);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function saveChanges() {
    try {
      setSaving(true);
      setSaveMessage(null);
      let changed: Record<string, any> = {};
      Object.entries(form).forEach(([k, v]) => {
        let oldVal: any = undefined;
        if (user?.buyer_profile && (user.buyer_profile as any)[k] !== undefined) {
          oldVal = (user.buyer_profile as any)[k];
        } else if (user && (user as any)[k] !== undefined) {
          oldVal = (user as any)[k];
        }
        if (v !== undefined && v !== null && v !== oldVal) {
          changed[k] = v;
        }
      });
      let buyerPayload: any = {};
      let userPayload: any = {};
      const userFields = ['first_name', 'last_name', 'phone', 'email'];
      Object.entries(changed).forEach(([k, v]) => {
        if (userFields.includes(k)) {
          userPayload[k] = v;
        } else {
          buyerPayload[k] = v;
        }
      });
      if (Object.keys(userPayload).length > 0) {
        await appClient.patch('/auth/me/', userPayload);
      }
      let buyerProfileUpdated = false;
      if (Object.keys(buyerPayload).length > 0 || profilePhotoFile) {
        let payload: any = buyerPayload;
        if (profilePhotoFile) {
          const fd = new FormData();
          Object.entries(buyerPayload).forEach(([k, v]) => {
            fd.append(k, v as string);
          });
          fd.append('profile_photo', profilePhotoFile);
          payload = fd;
        }
        await appClient.updateBuyerProfile(payload);
        buyerProfileUpdated = true;
      }
      if (Object.keys(changed).length === 0 && !profilePhotoFile) {
        setSaveMessage('No changes to save');
        setSaving(false);
        return;
      }
      await fetchUserProfile();
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
      setPwdMessage('Please fill all password fields');
      return;
    }
    if (pwdNew !== pwdNew2) {
      setPwdMessage('New passwords do not match');
      return;
    }
    try {
      setPwdLoading(true);
      setPwdMessage(null);
      const data = await appClient.post('/auth/change-password/', { 
        old_password: pwdOld, 
        new_password: pwdNew, 
        new_password2: pwdNew2 
      });
      setPwdMessage(data?.message || 'Password changed successfully');
      setPwdOld('');
      setPwdNew('');
      setPwdNew2('');
      setTimeout(() => setPwdMessage(null), 3000);
    } catch (err: any) {
      setPwdMessage(err?.message || String(err));
    } finally {
      setPwdLoading(false);
    }
  }

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'username': return <User size={18} />;
      case 'email': return <Mail size={18} />;
      case 'phone': return <Phone size={18} />;
      case 'address': case 'city': case 'country': return <MapPin size={18} />;
      case 'date_of_birth': return <Calendar size={18} />;
      case 'first_name': case 'last_name': return <User size={18} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <main className="min-h-screen p-4 md:p-6 dark:bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Profile Settings</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your account information and preferences</p>
            </div>
            <button 
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${editMode 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300' 
                : 'bg-amber-600 text-white hover:bg-amber-700'}`}
            >
              {editMode ? <X size={20} /> : <Edit2 size={20} />}
              {editMode ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700 p-6">
              {/* Profile Photo Section */}
              <div className="relative mb-6">
                <div className="relative w-40 h-40 mx-auto rounded-full border-4 border-amber-200 dark:border-amber-800 p-1">
                  {user?.buyer_profile?.profile_photo || user?.artist_profile?.profile_photo ? (
                    <img
                      src={(() => {
                        const photo = user?.buyer_profile?.profile_photo || user?.artist_profile?.profile_photo;
                        if (!photo) return '/arts/art1.jpeg';
                        return photo.startsWith('http') ? photo : `${API_BASE}${photo}`;
                      })()}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-amber-300 flex items-center justify-center">
                      <User size={60} className="text-amber-600" />
                    </div>
                  )}
                  {editMode && (
                    <label className="absolute bottom-2 right-2 bg-amber-600 text-white p-2 rounded-full cursor-pointer hover:bg-amber-700 transition">
                      <Camera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setProfilePhotoFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {profilePhotoFile && (
                  <div className="mt-3 text-center text-sm text-amber-600">
                    Selected: {profilePhotoFile.name}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user?.username}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${user?.role === 'artist' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
                    : user?.role === 'admin'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'}`}>
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                  </span>
                  {user?.is_verified && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
                      <Shield size={14} /> Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">01</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Years Active</div>
                </div>
                <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Orders</div>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Calendar size={16} />
                Joined {user?.join_date ? new Date(user.join_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : '—'}
              </div>
            </div>
          </div>

          {/* Right Column - Details & Edit */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Personal Information</h3>
                {saveMessage && (
                  <div className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-lg text-sm">
                    {saveMessage}
                  </div>
                )}
              </div>

              {!editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editableFields.filter(f => f !== 'profile_photo').map(field => (
                    <div key={field} className="group">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-amber-600">
                          {getFieldIcon(field)}
                        </div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                          {field.replace(/_/g, ' ')}
                        </div>
                      </div>
                      <div className="text-gray-800 dark:text-gray-200 font-medium pl-7">
                        {user?.buyer_profile && (user.buyer_profile as any)[field] !== undefined && (user.buyer_profile as any)[field] !== null && (user.buyer_profile as any)[field] !== ''
                          ? (user.buyer_profile as any)[field]
                          : user && (user as any)[field] !== undefined && (user as any)[field] !== null && (user as any)[field] !== ''
                          ? (user as any)[field]
                          : <span className="text-gray-400">Not set</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {editableFields.filter(f => f !== 'profile_photo' && f !== 'date_of_birth').map(field => (
                      <div key={field} className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {getFieldIcon(field)}
                          {field.replace(/_/g, ' ')}
                        </label>
                        <input
                          name={field}
                          type="text"
                          value={form[field] || ''}
                          onChange={onChange}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-amber-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                          placeholder={`Enter your ${field.replace(/_/g, ' ')}`}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Date of Birth Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Calendar size={18} />
                      Date of Birth
                    </label>
                    <input
                      name="date_of_birth"
                      type="date"
                      value={form['date_of_birth'] || ''}
                      onChange={onChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-amber-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button 
                      onClick={saveChanges} 
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 transition"
                    >
                      <Save size={20} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      onClick={() => { setEditMode(false); fetchUserProfile(); setProfilePhotoFile(null); }}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Security Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700 p-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white mb-6">
                <Lock size={24} className="text-amber-600" />
                Security & Password
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                    <input 
                      type="password" 
                      value={pwdOld}
                      onChange={e => setPwdOld(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-amber-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                    <input 
                      type="password" 
                      value={pwdNew}
                      onChange={e => setPwdNew(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-amber-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={pwdNew2}
                      onChange={e => setPwdNew2(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-amber-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {pwdMessage && (
                      <div className={`text-sm ${pwdMessage.includes('successfully') 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-amber-600 dark:text-amber-400'}`}
                      >
                        {pwdMessage}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={changePassword} 
                    disabled={pwdLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 disabled:opacity-50 transition"
                  >
                    <Lock size={18} />
                    {pwdLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>

            {/* Role-Specific Profiles */}
            {user?.artist_profile && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700 p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white mb-6">
                  <Briefcase size={24} className="text-purple-600" />
                  Artist Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(user.artist_profile).map(([k, v]) => (
                    v !== null && v !== '' && (
                      <div key={k} className="space-y-1">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                          {k.replace(/_/g, ' ')}
                        </div>
                        <div className="text-gray-800 dark:text-gray-200 font-medium">
                          {String(v)}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}