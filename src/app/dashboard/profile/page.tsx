"use client";

import React, { useEffect, useState } from "react";
import { userService, artistService, buyerService } from "@/services/apiServices";
import { useToast } from "@/components/ui/Toast";
import { Mail, Phone, MapPin, Briefcase, Globe, Instagram, Facebook, Lock, Check, X, Edit2, Save, X as XClose } from "lucide-react";

export default function ProfilePage() {
  const { showToast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [buyerProfile, setBuyerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [profileData, setProfileData] = useState<any>({});
  const [passwords, setPasswords] = useState({ old_password: "", new_password: "", new_password2: "" });
  
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "profile" | "password">("general");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState(formData);
  const [editProfileData, setEditProfileData] = useState(profileData);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const me = await userService.getCurrentUser();
      setUser(me);
      setFormData({
        first_name: me.first_name || "",
        last_name: me.last_name || "",
        email: me.email || "",
        phone: me.phone || "",
      });

      const role = (me?.role || "").toLowerCase();
      if (role === "artist" && me.artist_profile) {
        setArtistProfile(me.artist_profile);
        setProfileData(me.artist_profile);
      } else if (role === "buyer" && me.buyer_profile) {
        setBuyerProfile(me.buyer_profile);
        setProfileData(me.buyer_profile);
      }
      setLoading(false);
    } catch (error) {
      showToast("error", "Error", "Failed to load profile");
      setLoading(false);
    }
  };

  const enterEditMode = () => {
    setEditFormData({ ...formData });
    setEditProfileData({ ...profileData });
    setIsEditMode(true);
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setEditFormData(formData);
    setEditProfileData(profileData);
  };

  const handleSaveGeneralEdit = async () => {
    setSaving(true);
    try {
      await userService.updateCurrentUser({
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        email: editFormData.email,
        phone: editFormData.phone,
      });
      showToast("success", "Success", "General information updated");
      setFormData(editFormData);
      setIsEditMode(false);
      await loadUserData();
    } catch (error: any) {
      showToast("error", "Error", error?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfileEdit = async () => {
    setSaving(true);
    try {
      const role = (user?.role || "").toLowerCase();
      if (role === "artist") {
        await artistService.updateProfile(editProfileData);
      } else if (role === "buyer") {
        await buyerService.updateProfile(editProfileData);
      }
      showToast("success", "Success", "Profile updated successfully");
      setProfileData(editProfileData);
      setIsEditMode(false);
      await loadUserData();
    } catch (error: any) {
      showToast("error", "Error", error?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await userService.updateCurrentUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
      });
      showToast("success", "Success", "General information updated");
      await loadUserData();
    } catch (error: any) {
      showToast("error", "Error", error?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const role = (user?.role || "").toLowerCase();
      if (role === "artist") {
        await artistService.updateProfile(profileData);
      } else if (role === "buyer") {
        await buyerService.updateProfile(profileData);
      }
      showToast("success", "Success", "Profile updated successfully");
      await loadUserData();
    } catch (error: any) {
      showToast("error", "Error", error?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.old_password || !passwords.new_password || !passwords.new_password2) {
      showToast("error", "Error", "All fields are required");
      return;
    }
    if (passwords.new_password.length < 8) {
      showToast("error", "Error", "Password must be at least 8 characters");
      return;
    }
    if (passwords.new_password !== passwords.new_password2) {
      showToast("error", "Error", "Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await userService.changePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password,
        new_password2: passwords.new_password2,
      });
      showToast("success", "Success", "Password changed successfully");
      setPasswords({ old_password: "", new_password: "", new_password2: "" });
    } catch (error: any) {
      showToast("error", "Error", error?.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const role = (user?.role || "").toLowerCase();
  const profileInfo = artistProfile || buyerProfile;

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-black p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and profile information</p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-white/5 rounded-2xl shadow-lg overflow-hidden">
          {/* User Header Section */}
          {user && (
            <div className=" from-yellow-600 to-yellow-700 px-8 py-6 dark:bg-white/5">
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-3 border-white">
                    {profileInfo?.profile_photo ? (
                      <img src={profileInfo.profile_photo} alt={user.username} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {(user.first_name || user.username || "U")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{user.first_name} {user.last_name}</h2>
                    <p className="text-emerald-100">@{user.username}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        {role === "artist" ? "🎨 Artist" : role === "buyer" ? "🛍️ Buyer" : "Admin"}
                      </span>
                    </div>
                  </div>
                </div>
                {(activeTab === "general" || activeTab === "profile") && !isEditMode && (
                  <button
                    onClick={enterEditMode}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
                {isEditMode && (activeTab === "general" || activeTab === "profile") && (
                  <div className="flex gap-2">
                    <button
                      onClick={exitEditMode}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <XClose className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
            <div className="flex">
              {[
                { id: "general", label: "General Information" },
                ...(role === "artist" || role === "buyer" ? [{ id: "profile", label: role === "artist" ? "Artist Profile" : "Buyer Profile" }] : []),
                { id: "password", label: "Security" },
              ].map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* General Information Tab */}
            {activeTab === "general" && (
              <div className="space-y-6  dark:bg-white/5">
                {isEditMode ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editFormData.first_name}
                          onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editFormData.last_name}
                          onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                          placeholder="+250789123456"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveGeneralEdit}
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">First Name</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.first_name || "—"}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">Last Name</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.last_name || "—"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email Address
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.email || "—"}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Phone Number
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.phone || "—"}</p>
                      </div>
                    </div>

                    {user && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Member Since</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {user.join_date ? new Date(user.join_date).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Account Status</p>
                          <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {user.is_verified ? (
                              <>
                                <Check className="w-4 h-4 text-green-500" /> Verified
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 text-yellow-500" /> Unverified
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Profile Tab (Artist/Buyer) */}
            {activeTab === "profile" && (role === "artist" || role === "buyer") && (
              <div className="space-y-6">
                {isEditMode ? (
                  // EDIT MODE
                  <>
                    {role === "artist" ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                          <textarea
                            value={editProfileData.bio || ""}
                            onChange={(e) => setEditProfileData({ ...editProfileData, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <Briefcase className="w-4 h-4 inline mr-2" />
                              Specialization
                            </label>
                            <input
                              type="text"
                              value={editProfileData.specialization || ""}
                              onChange={(e) => setEditProfileData({ ...editProfileData, specialization: e.target.value })}
                              placeholder="e.g., Abstract Art"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Experience (years)
                            </label>
                            <input
                              type="number"
                              value={editProfileData.experience_years || ""}
                              onChange={(e) => setEditProfileData({ ...editProfileData, experience_years: parseInt(e.target.value) || 0 })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <MapPin className="w-4 h-4 inline mr-2" />
                              Country
                            </label>
                            <input
                              type="text"
                              value={editProfileData.country || ""}
                              onChange={(e) => setEditProfileData({ ...editProfileData, country: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                            <input
                              type="text"
                              value={editProfileData.city || ""}
                              onChange={(e) => setEditProfileData({ ...editProfileData, city: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <Globe className="w-4 h-4 inline mr-2" />
                              Website
                            </label>
                            <input
                              type="url"
                              value={editProfileData.website || ""}
                              onChange={(e) => setEditProfileData({ ...editProfileData, website: e.target.value })}
                              placeholder="https://example.com"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <Instagram className="w-4 h-4 inline mr-2" />
                              Instagram
                            </label>
                            <input
                              type="url"
                              value={editProfileData.instagram || ""}
                              onChange={(e) => setEditProfileData({ ...editProfileData, instagram: e.target.value })}
                              placeholder="https://instagram.com/..."
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Facebook className="w-4 h-4 inline mr-2" />
                            Facebook
                          </label>
                          <input
                            type="url"
                            value={editProfileData.facebook || ""}
                            onChange={(e) => setEditProfileData({ ...editProfileData, facebook: e.target.value })}
                            placeholder="https://facebook.com/..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Address
                          </label>
                          <input
                            type="text"
                            value={editProfileData.address || ""}
                            onChange={(e) => setEditProfileData({ ...editProfileData, address: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                            <input
                              type="text"
                              value={editProfileData.city || ""}
                              onChange={(e) => setEditProfileData({ ...editProfileData, city: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                            <input
                              type="text"
                              value={editProfileData.country || ""}
                              onChange={(e) => setEditProfileData({ ...editProfileData, country: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <Phone className="w-4 h-4 inline mr-2" />
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={editProfileData.phone || ""}
                              onChange={(e) => setEditProfileData({ ...editProfileData, phone: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <Mail className="w-4 h-4 inline mr-2" />
                              Email
                            </label>
                            <input
                              type="email"
                              value={editProfileData.email || ""}
                              onChange={(e) => setEditProfileData({ ...editProfileData, email: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                          <input
                            type="date"
                            value={editProfileData.date_of_birth || ""}
                            onChange={(e) => setEditProfileData({ ...editProfileData, date_of_birth: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                          />
                        </div>
                      </>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfileEdit}
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Profile"}
                      </button>
                    </div>
                  </>
                ) : (
                  // VIEW MODE
                  <>
                    {role === "artist" ? (
                      <>
                        {profileData.bio && (
                          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">Bio</p>
                            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{profileData.bio}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {profileData.specialization && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                Specialization
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.specialization}</p>
                            </div>
                          )}
                          {profileData.experience_years !== undefined && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">Experience</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.experience_years} years</p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {profileData.country && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Country
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.country}</p>
                            </div>
                          )}
                          {profileData.city && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">City</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.city}</p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {profileData.website && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                Website
                              </p>
                              <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline break-all">
                                {profileData.website}
                              </a>
                            </div>
                          )}
                          {profileData.instagram && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                <Instagram className="w-3 h-3" />
                                Instagram
                              </p>
                              <a href={profileData.instagram} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline break-all">
                                {profileData.instagram}
                              </a>
                            </div>
                          )}
                        </div>

                        {profileData.facebook && (
                          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                              <Facebook className="w-3 h-3" />
                              Facebook
                            </p>
                            <a href={profileData.facebook} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline break-all">
                              {profileData.facebook}
                            </a>
                          </div>
                        )}

                        {profileData.verified_by_admin !== undefined && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                              {profileData.verified_by_admin ? (
                                <>
                                  <Check className="w-4 h-4" /> Admin Verified
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4" /> Pending Admin Verification
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {profileData.address && (
                          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Address
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.address}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {profileData.city && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">City</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.city}</p>
                            </div>
                          )}
                          {profileData.country && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">Country</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.country}</p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {profileData.phone && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                Phone
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.phone}</p>
                            </div>
                          )}
                          {profileData.email && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                Email
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.email}</p>
                            </div>
                          )}
                        </div>

                        {profileData.date_of_birth && (
                          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">Date of Birth</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{new Date(profileData.date_of_birth).toLocaleDateString()}</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="space-y-6 max-w-md">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Use a strong password with at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwords.old_password}
                    onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.new_password}
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwords.new_password2}
                    onChange={(e) => setPasswords({ ...passwords, new_password2: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}