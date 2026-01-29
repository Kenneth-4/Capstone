import { useState } from 'react';
import { Save, Plus, Trash2, Edit, Users, Bell, Globe, Shield, Database, Calendar } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  // General Settings State
  const [churchName, setChurchName] = useState('LampKonek Church');
  const [churchAddress, setChurchAddress] = useState('123 Main Street, City, Country');
  const [churchPhone, setChurchPhone] = useState('+63 912 345 6789');
  const [churchEmail, setChurchEmail] = useState('info@lampkonek.church');

  // Reservation Settings State
  const [reservationExpirationDays, setReservationExpirationDays] = useState('7');
  const [reservationTerms, setReservationTerms] = useState(`RESERVATION TERMS AND CONDITIONS

1. Reservation Approval
All reservations are subject to approval by the church administration. Approval is not guaranteed and may be denied based on availability, purpose, or church policy.

2. Reservation Period
Reservations expire after 7 days if not approved or used. Please submit your reservation request at least 5 days before your intended date.

3. Cancellation Policy
Cancellations must be made at least 48 hours before the scheduled event. Late cancellations may affect future reservation privileges.

4. Facility Usage
The reserved venue and equipment must be used only for the stated purpose. Any changes to the event details must be approved in advance.

5. Responsibility and Damages
The requesting party is responsible for any damages to church property or equipment during their reservation period. The venue must be left in the same condition as it was received.

6. Conduct
All activities must align with church values and mission. Appropriate conduct is expected from all attendees.

7. Equipment
Requested equipment is subject to availability. Technical support may be limited and should be arranged in advance.`);

  // User Roles
  const userRoles = [
    { id: '1', name: 'Admin', permissions: ['All Permissions'], users: 3 },
    { id: '2', name: 'Ministry Leader', permissions: ['View Reports', 'Manage Members', 'Manage Events'], users: 8 },
    { id: '3', name: 'Volunteer', permissions: ['View Attendance', 'Check-in Members'], users: 25 },
    { id: '4', name: 'Member', permissions: ['View Profile', 'View Events'], users: 1200 },
  ];

  // Announcements
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'Christmas Service Schedule', date: '2024-12-08', active: true },
    { id: '2', title: 'Youth Camp Registration Open', date: '2024-12-05', active: true },
    { id: '3', title: 'Building Maintenance Notice', date: '2024-12-01', active: false },
  ]);

  // Clusters
  const [clusters] = useState([
    { id: '1', name: 'Cluster A', leader: 'John Doe', members: 420 },
    { id: '2', name: 'Cluster B', leader: 'Jane Smith', members: 385 },
    { id: '3', name: 'Cluster C', leader: 'Maria Santos', members: 442 },
  ]);

  // Ministries
  const [ministries] = useState([
    { id: '1', name: 'Worship Team', leader: 'Pedro Cruz', members: 180 },
    { id: '2', name: 'Youth Ministry', leader: 'Anna Reyes', members: 250 },
    { id: '3', name: 'Children Ministry', leader: 'Mark Garcia', members: 220 },
    { id: '4', name: 'Media Team', leader: 'Lisa Tan', members: 150 },
  ]);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'users', label: 'User Roles', icon: Shield },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'clusters', label: 'Clusters', icon: Users },
    { id: 'ministries', label: 'Ministries', icon: Users },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#f5f7fb] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619]">Settings</h1>
      </div>

      <div className="grid grid-cols-[250px_1fr] gap-6">
        {/* Sidebar Tabs */}
        <div className="bg-white rounded-lg p-4 shadow-sm h-fit">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-[#6d8aff] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="size-5" />
                <span className="font-['Poppins:Medium',sans-serif] text-[14px]">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div>
          {activeTab === 'general' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-6">
                General Settings
              </h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                    Church Name
                  </label>
                  <input
                    type="text"
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                    Address
                  </label>
                  <textarea
                    value={churchAddress}
                    onChange={(e) => setChurchAddress(e.target.value)}
                    rows={3}
                    className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={churchPhone}
                      onChange={(e) => setChurchPhone(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={churchEmail}
                      onChange={(e) => setChurchEmail(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
                    />
                  </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors self-end">
                  <Save className="size-5" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
                  User Roles & Permissions
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors">
                  <Plus className="size-4" />
                  Add Role
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {userRoles.map((role) => (
                  <div key={role.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619]">
                          {role.name}
                        </h3>
                        <p className="text-[#6c757d] text-[14px] font-['Poppins:Regular',sans-serif] mt-1">
                          {role.permissions.join(', ')}
                        </p>
                        <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mt-2">
                          {role.users} users with this role
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-[#6d8aff] hover:bg-[#f5f7fb] rounded-lg transition-colors">
                          <Edit className="size-4" />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
                  Reservation Settings
                </h2>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                    Reservation Expiration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={reservationExpirationDays}
                    onChange={(e) => setReservationExpirationDays(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] w-full max-w-xs"
                  />
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif]">
                    Number of days before pending reservations automatically expire
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                    Terms and Conditions
                  </label>
                  <textarea
                    value={reservationTerms}
                    onChange={(e) => setReservationTerms(e.target.value)}
                    rows={15}
                    className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] resize-none font-mono"
                    placeholder="Enter reservation terms and conditions..."
                  />
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif]">
                    These terms will be displayed to users when they create a new reservation
                  </p>
                </div>

                <button 
                  onClick={() => alert('Reservation settings saved successfully!')}
                  className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors self-end"
                >
                  <Save className="size-5" />
                  Save Reservation Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
                  Announcements
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors">
                  <Plus className="size-4" />
                  New Announcement
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619]">
                            {announcement.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded text-[12px] font-['Poppins:Medium',sans-serif] ${
                              announcement.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {announcement.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-[#6c757d] text-[14px] font-['Poppins:Regular',sans-serif] mt-1">
                          Posted on {announcement.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-[#6d8aff] hover:bg-[#f5f7fb] rounded-lg transition-colors">
                          <Edit className="size-4" />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'clusters' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
                  Cluster Management
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors">
                  <Plus className="size-4" />
                  Add Cluster
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {clusters.map((cluster) => (
                  <div key={cluster.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619]">
                        {cluster.name}
                      </h3>
                      <div className="flex gap-2">
                        <button className="p-1 text-[#6d8aff] hover:bg-[#f5f7fb] rounded transition-colors">
                          <Edit className="size-4" />
                        </button>
                        <button className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[#6c757d] text-[14px] font-['Poppins:Regular',sans-serif]">
                      Leader: {cluster.leader}
                    </p>
                    <p className="text-[#6c757d] text-[14px] font-['Poppins:Regular',sans-serif]">
                      Members: {cluster.members}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ministries' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
                  Ministry Management
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors">
                  <Plus className="size-4" />
                  Add Ministry
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {ministries.map((ministry) => (
                  <div key={ministry.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619]">
                        {ministry.name}
                      </h3>
                      <div className="flex gap-2">
                        <button className="p-1 text-[#6d8aff] hover:bg-[#f5f7fb] rounded transition-colors">
                          <Edit className="size-4" />
                        </button>
                        <button className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[#6c757d] text-[14px] font-['Poppins:Regular',sans-serif]">
                      Leader: {ministry.leader}
                    </p>
                    <p className="text-[#6c757d] text-[14px] font-['Poppins:Regular',sans-serif]">
                      Members: {ministry.members}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-6">
                Backup & Restore
              </h2>
              <div className="flex flex-col gap-6">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Database className="size-12 text-[#6d8aff] mx-auto mb-3" />
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619] mb-2">
                    Create Backup
                  </h3>
                  <p className="text-[#6c757d] text-[14px] font-['Poppins:Regular',sans-serif] mb-4">
                    Create a backup of all your church data including members, attendance, and reservations
                  </p>
                  <button className="px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors">
                    Create Backup Now
                  </button>
                </div>

                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Database className="size-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619] mb-2">
                    Restore from Backup
                  </h3>
                  <p className="text-[#6c757d] text-[14px] font-['Poppins:Regular',sans-serif] mb-4">
                    Restore your church data from a previous backup file
                  </p>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Choose Backup File
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-[14px] font-['Poppins:Medium',sans-serif] text-yellow-800">
                    ⚠️ Important: Regular backups are recommended. Last backup: Never
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}