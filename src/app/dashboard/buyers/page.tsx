// app/dashboard/buyers/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';
import BuyerViewModal from '@/components/dashboard/BuyerViewModal';
import BuyerEditModal from '@/components/dashboard/BuyerEditModal';

interface Buyer {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    is_verified: boolean;
  };
  profile_photo?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
}

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewBuyer, setViewBuyer] = useState<Buyer | null>(null);
  const [editBuyer, setEditBuyer] = useState<Buyer | null>(null);
  // admins cannot create buyers here; use registration flow
  const { user } = useAuth();

  useEffect(() => {
    loadBuyers();
  }, []);

  const loadBuyers = async () => {
    try {
      setLoading(true);
      // Backend does not expose a buyers listing endpoint. Leave buyers empty for now.
      setBuyers([]);
    } catch (err: any) {
      setError(err.message || 'Failed to load buyers');
      console.error('Error loading buyers:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBuyer = async (updatedBuyer: Buyer) => {
    try {
      setBuyers(prev => 
        prev.map(buyer => 
          buyer.id === updatedBuyer.id ? updatedBuyer : buyer
        )
      );
      setEditBuyer(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update buyer');
    }
  };

  const addBuyer = async (buyerData: any) => {
    try {
      const newBuyer: Buyer = {
        id: Date.now(),
        user: {
          id: Date.now(),
          username: buyerData.username,
          email: buyerData.email,
          first_name: buyerData.first_name,
          last_name: buyerData.last_name,
          phone: buyerData.phone,
          is_verified: false,
        },
        address: buyerData.address,
        city: buyerData.city,
        country: buyerData.country,
      };
      setBuyers(prev => [newBuyer, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to add buyer');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">Loading buyers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Buyers Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Manage registered buyers and their information
            </p>
          </div>
          
          {user?.role === 'admin' && (
            <div className="text-sm text-gray-500">Admin: view buyers here. New users register via the public signup form.</div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {buyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={buyer.profile_photo || '/avatars/default.jpg'}
                            alt={buyer.user.username}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {buyer.user.first_name} {buyer.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            @{buyer.user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {buyer.user.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {buyer.user.phone || buyer.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {buyer.city && buyer.country ? `${buyer.city}, ${buyer.country}` : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                          buyer.user.is_verified
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        }`}
                      >
                        {buyer.user.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setViewBuyer(buyer)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditBuyer(buyer)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {buyers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-300">
              No buyers found
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewBuyer && (
        <BuyerViewModal
          buyer={viewBuyer}
          onClose={() => setViewBuyer(null)}
        />
      )}

      {editBuyer && (
        <BuyerEditModal
          buyer={editBuyer}
          onClose={() => setEditBuyer(null)}
          onSave={updateBuyer}
        />
      )}

      {/* Admins cannot add buyers from the dashboard — users must register via signup. */}
    </div>
  );
}