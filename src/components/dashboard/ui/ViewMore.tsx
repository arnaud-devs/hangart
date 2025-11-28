import React, { useEffect, useRef } from 'react';
import { User, Edit3, Eye, Trash2, Settings, UserCheck } from 'lucide-react';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  dateOfBirth: string;
  profileImage: string;
}

interface ViewMoreProps {
  student: Student;
  currentUserEmail?: string;
  onClose: () => void;
  onViewProfile: (student: Student) => void;
}

const ViewMore: React.FC<ViewMoreProps> = ({ 
  student,
  currentUserEmail,
  onClose,
  onViewProfile
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleViewProfile = () => {
    onViewProfile(student);
    onClose();
  };

  const handleAction = (action: string) => {
    console.log(`${action} clicked for:`, student);
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200 animate-in slide-in-from-top-2 duration-200"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu"
    >
      {/* Header Section */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-4 w-4 text-emerald-600" />
          <p className="text-sm font-semibold text-gray-900">
            User Actions
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {student.firstName} {student.lastName}
        </p>
      </div>

      {/* Action Menu */}
      <div className="py-1" role="none">
        <button
          onClick={handleViewProfile}
          className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 ease-in-out"
          role="menuitem"
        >
          <Eye className="mr-3 h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          <div className="flex flex-col items-start">
            <span className="font-medium">View Profile</span>
            <span className="text-xs text-gray-500">See user details</span>
          </div>
        </button>

        <button
          onClick={() => handleAction('Edit User')}
          className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 ease-in-out"
          role="menuitem"
        >
          <Edit3 className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Edit User</span>
            <span className="text-xs text-gray-500">Modify user information</span>
          </div>
        </button>

        <button
          onClick={() => handleAction('User Settings')}
          className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 ease-in-out"
          role="menuitem"
        >
          <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Settings</span>
            <span className="text-xs text-gray-500">Configure preferences</span>
          </div>
        </button>

        <div className="border-t border-gray-100 my-1" />
        
        <button
          onClick={() => handleAction('Remove User')}
          className="group flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 ease-in-out"
          role="menuitem"
        >
          <Trash2 className="mr-3 h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Remove User</span>
            <span className="text-xs text-red-400 group-hover:text-red-500">Permanently delete</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ViewMore;