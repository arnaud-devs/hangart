import React, { useEffect, useRef } from 'react';
import { X, Mail, Phone, Calendar, UserCheck, MapPin, Award, Clock } from 'lucide-react';

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

interface ProfilePopupProps {
  student: Student;
  currentUserEmail?: string;
  onClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ 
  student, 
  currentUserEmail,
  onClose 
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const isCurrentUser = currentUserEmail === student.email;

  // Handle escape key to close popup
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

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateString: string) => {
    try {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 'N/A';
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600/70 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        ref={popupRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-blue-600 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={student.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtu74pEiq7ofeQeTsco0migV16zZoBwSlGg&s"}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isCurrentUser && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-400 p-2 rounded-full border-2 border-white">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-1">
                {student.firstName} {student.lastName}
              </h2>
              <div className="flex items-center space-x-3">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                  {student.role}
                </span>
                {isCurrentUser && (
                  <span className="bg-emerald-400 px-3 py-1 rounded-full text-sm font-semibold">
                    You
                  </span>
                )}
              </div>
              <p className="text-emerald-100 mt-2 text-sm">
                Member since 2024 • ID: #{student.id}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-blue-700">Active</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold text-emerald-700">{calculateAge(student.dateOfBirth)} years</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Profile</p>
                  <p className="font-semibold text-purple-700">Complete</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-gray-600" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email Address</p>
                    <p className="text-gray-900">{student.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone Number</p>
                    <p className="text-gray-900">{student.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                    <p className="text-gray-900">{formatDate(student.dateOfBirth)}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p className="text-gray-900">Not specified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserCheck className="w-5 h-5 mr-2 text-gray-600" />
              Profile Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Full Name</p>
                <p className="text-gray-900 mb-3">{student.firstName} {student.lastName}</p>
                
                <p className="text-sm font-medium text-gray-600 mb-1">Role</p>
                <p className="text-gray-900 mb-3">{student.role}</p>
                
                <p className="text-sm font-medium text-gray-600 mb-1">User ID</p>
                <p className="text-gray-900 font-mono text-sm">#{student.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Account Status</p>
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-900">Active</span>
                </div>
                
                <p className="text-sm font-medium text-gray-600 mb-1">Last Activity</p>
                <p className="text-gray-900 mb-3">Today</p>
                
                <p className="text-sm font-medium text-gray-600 mb-1">Joined</p>
                <p className="text-gray-900">January 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Profile last updated: Today
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;