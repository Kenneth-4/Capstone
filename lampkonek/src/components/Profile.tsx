import { useState } from 'react';
import { Edit, Save, Mail, Phone, MapPin, Calendar, Shield, Activity } from 'lucide-react';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Ministry Leader',
    email: 'ministry.leader@lampkonek.church',
    phone: '+63 912 345 6789',
    role: 'Admin',
    joinDate: '2023-01-15',
    address: '123 Main Street, City, Country',
    birthdate: '1985-06-15',
  });

  const recentActivities = [
    { action: 'Generated Monthly Report', time: '2 hours ago' },
    { action: 'Approved venue reservation', time: '5 hours ago' },
    { action: 'Added new member: Maria Santos', time: '1 day ago' },
    { action: 'Updated cluster assignments', time: '2 days ago' },
    { action: 'Exported attendance data', time: '3 days ago' },
  ];

  const handleSave = () => {
    // In a real app, save to backend
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#f5f7fb] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619]">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors"
          >
            <Edit className="size-5" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* Profile Information */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="bg-[#6d8aff] text-white rounded-full size-24 flex items-center justify-center font-['Montserrat:Bold',sans-serif] text-[32px]">
              {profileData.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-['Montserrat:Bold',sans-serif] text-[28px]"
                  />
                ) : (
                  <h2 className="font-['Montserrat:Bold',sans-serif] text-[28px] text-[#151619]">
                    {profileData.name}
                  </h2>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-[#6d8aff]" />
                <span className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#6c757d]">
                  {profileData.role}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <h3 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-[#6c757d] mt-1" />
                <div className="flex-1">
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Poppins:Medium',sans-serif] text-[14px]"
                    />
                  ) : (
                    <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                      {profileData.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="size-5 text-[#6c757d] mt-1" />
                <div className="flex-1">
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Poppins:Medium',sans-serif] text-[14px]"
                    />
                  ) : (
                    <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                      {profileData.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-[#6c757d] mt-1" />
                <div className="flex-1">
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">
                    Birthdate
                  </p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.birthdate}
                      onChange={(e) => handleChange('birthdate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Poppins:Medium',sans-serif] text-[14px]"
                    />
                  ) : (
                    <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                      {new Date(profileData.birthdate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-[#6c757d] mt-1" />
                <div className="flex-1">
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">
                    Member Since
                  </p>
                  <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                    {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="col-span-2 flex items-start gap-3">
                <MapPin className="size-5 text-[#6c757d] mt-1" />
                <div className="flex-1">
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">Address</p>
                  {isEditing ? (
                    <textarea
                      value={profileData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Poppins:Medium',sans-serif] text-[14px] resize-none"
                    />
                  ) : (
                    <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                      {profileData.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors"
                >
                  <Save className="size-5" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4">
              Change Password
            </h3>
            <div className="grid grid-cols-1 gap-4 max-w-md">
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                  Current Password
                </label>
                <input
                  type="password"
                  className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                  New Password
                </label>
                <input
                  type="password"
                  className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
                />
              </div>
              <button className="px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors self-start">
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Recent Activity & Stats */}
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-['Montserrat:SemiBold',sans-serif] text-[18px] text-[#151619] mb-4">
              Your Statistics
            </h3>
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">
                  Actions This Week
                </p>
                <p className="font-['Montserrat:Bold',sans-serif] text-[28px] text-[#6d8aff]">47</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">
                  Reports Generated
                </p>
                <p className="font-['Montserrat:Bold',sans-serif] text-[28px] text-[#6d8aff]">12</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">
                  Members Added
                </p>
                <p className="font-['Montserrat:Bold',sans-serif] text-[28px] text-[#6d8aff]">8</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="size-5 text-[#6d8aff]" />
              <h3 className="font-['Montserrat:SemiBold',sans-serif] text-[18px] text-[#151619]">
                Recent Activity
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 bg-[#6d8aff] rounded-full mt-2"></div>
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#151619]">
                      {activity.action}
                    </p>
                    <p className="text-[#6c757d] text-[12px]">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
