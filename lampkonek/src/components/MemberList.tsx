import { useState } from 'react';
import { Search, Plus, Filter, Download, User, Mail, Phone, MapPin } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  cluster: string;
  ministry: string;
  status: 'Active' | 'Inactive' | 'Visitor';
  joinDate: string;
}

interface MemberListProps {
  onSelectMember: (member: Member) => void;
  onAddMember: () => void;
}

export function MemberList({ onSelectMember, onAddMember }: MemberListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCluster, setFilterCluster] = useState<string>('all');

  const members: Member[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+63 912 345 6789',
      cluster: 'Cluster A',
      ministry: 'Worship Team',
      status: 'Active',
      joinDate: '2023-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+63 923 456 7890',
      cluster: 'Cluster B',
      ministry: 'Youth Ministry',
      status: 'Active',
      joinDate: '2023-02-20',
    },
    {
      id: '3',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+63 934 567 8901',
      cluster: 'Cluster A',
      ministry: 'Children Ministry',
      status: 'Active',
      joinDate: '2023-03-10',
    },
    {
      id: '4',
      name: 'Pedro Cruz',
      email: 'pedro.cruz@email.com',
      phone: '+63 945 678 9012',
      cluster: 'Cluster C',
      ministry: 'Media Team',
      status: 'Inactive',
      joinDate: '2022-11-05',
    },
    {
      id: '5',
      name: 'Anna Reyes',
      email: 'anna.reyes@email.com',
      phone: '+63 956 789 0123',
      cluster: 'Cluster B',
      ministry: 'Hospitality',
      status: 'Active',
      joinDate: '2023-04-18',
    },
    {
      id: '6',
      name: 'Mark Garcia',
      email: 'mark.garcia@email.com',
      phone: '+63 967 890 1234',
      cluster: 'Cluster A',
      ministry: 'Ushering',
      status: 'Visitor',
      joinDate: '2024-11-30',
    },
  ];

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesCluster = filterCluster === 'all' || member.cluster === filterCluster;
    return matchesSearch && matchesStatus && matchesCluster;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Inactive':
        return 'bg-red-100 text-red-700';
      case 'Visitor':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = [
    { label: 'Total Members', value: members.length, color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Active', value: members.filter(m => m.status === 'Active').length, color: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Inactive', value: members.filter(m => m.status === 'Inactive').length, color: 'bg-red-100', iconColor: 'text-red-600' },
    { label: 'Visitors', value: members.filter(m => m.status === 'Visitor').length, color: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#f5f7fb] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619]">Member Management</h1>
        <div className="flex gap-3">
          <button 
            onClick={onAddMember}
            className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors"
          >
            <Plus className="size-5" />
            Add Member
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="size-5" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-[#6c757d] font-['Poppins:Regular',sans-serif] text-[14px]">{stat.label}</p>
                <p className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619]">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <User className={`size-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Visitor">Visitor</option>
            </select>
            <select
              value={filterCluster}
              onChange={(e) => setFilterCluster(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
            >
              <option value="all">All Clusters</option>
              <option value="Cluster A">Cluster A</option>
              <option value="Cluster B">Cluster B</option>
              <option value="Cluster C">Cluster C</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => onSelectMember(member)}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#6d8aff] text-white rounded-full size-12 flex items-center justify-center font-['Montserrat:SemiBold',sans-serif] text-[18px]">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619]">
                    {member.name}
                  </h3>
                  <span
                    className={`inline-block px-2 py-1 rounded text-[12px] font-['Poppins:Medium',sans-serif] ${getStatusColor(
                      member.status
                    )}`}
                  >
                    {member.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#6c757d] text-[14px]">
                <Mail className="size-4" />
                <span className="font-['Poppins:Regular',sans-serif]">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6c757d] text-[14px]">
                <Phone className="size-4" />
                <span className="font-['Poppins:Regular',sans-serif]">{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6c757d] text-[14px]">
                <MapPin className="size-4" />
                <span className="font-['Poppins:Regular',sans-serif]">{member.cluster}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#6c757d] font-['Poppins:Regular',sans-serif]">Ministry:</span>
                <span className="font-['Poppins:Medium',sans-serif] text-[#151619]">{member.ministry}</span>
              </div>
              <div className="flex items-center justify-between text-[12px] mt-1">
                <span className="text-[#6c757d] font-['Poppins:Regular',sans-serif]">Joined:</span>
                <span className="font-['Poppins:Regular',sans-serif] text-[#151619]">
                  {new Date(member.joinDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
