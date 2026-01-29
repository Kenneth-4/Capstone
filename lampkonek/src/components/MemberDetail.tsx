import { ArrowLeft, Mail, Phone, MapPin, Calendar, Users, Edit, Trash2, Activity } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  cluster: string;
  ministry: string;
  status: 'Active' | 'Inactive' | 'Visitor';
  joinDate: string;
  address?: string;
  birthdate?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

interface MemberDetailProps {
  member: Member;
  onBack: () => void;
  onEdit: () => void;
}

export function MemberDetail({ member, onBack, onEdit }: MemberDetailProps) {
  const attendanceHistory = [
    { date: 'Dec 10, 2024', event: 'Sunday Service', status: 'Present' },
    { date: 'Dec 8, 2024', event: 'Prayer Meeting', status: 'Present' },
    { date: 'Dec 3, 2024', event: 'Sunday Service', status: 'Present' },
    { date: 'Nov 26, 2024', event: 'Sunday Service', status: 'Absent' },
    { date: 'Nov 24, 2024', event: 'Youth Fellowship', status: 'Present' },
  ];

  const ministryInvolvement = [
    { ministry: 'Worship Team', role: 'Singer', since: '2023-01-15' },
    { ministry: 'Hospitality', role: 'Volunteer', since: '2023-06-20' },
  ];

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

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#f5f7fb] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#6d8aff] hover:text-[#5a75e6] font-['Poppins:Medium',sans-serif]"
        >
          <ArrowLeft className="size-5" />
          Back to Members
        </button>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors"
          >
            <Edit className="size-5" />
            Edit Member
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            <Trash2 className="size-5" />
            Delete
          </button>
        </div>
      </div>

      {/* Member Profile Card */}
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="bg-[#6d8aff] text-white rounded-full size-24 flex items-center justify-center font-['Montserrat:Bold',sans-serif] text-[32px]">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619] mb-2">
                  {member.name}
                </h1>
                <span
                  className={`inline-block px-3 py-1 rounded text-[14px] font-['Poppins:Medium',sans-serif] ${getStatusColor(
                    member.status
                  )}`}
                >
                  {member.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-[#6c757d]" />
                <div>
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif]">Email</p>
                  <p className="text-[#151619] text-[14px] font-['Poppins:Medium',sans-serif]">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-[#6c757d]" />
                <div>
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif]">Phone</p>
                  <p className="text-[#151619] text-[14px] font-['Poppins:Medium',sans-serif]">{member.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-[#6c757d]" />
                <div>
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif]">Cluster</p>
                  <p className="text-[#151619] text-[14px] font-['Poppins:Medium',sans-serif]">{member.cluster}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-[#6c757d]" />
                <div>
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif]">Join Date</p>
                  <p className="text-[#151619] text-[14px] font-['Poppins:Medium',sans-serif]">
                    {new Date(member.joinDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Ministry Involvement */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="size-5 text-[#6d8aff]" />
            <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
              Ministry Involvement
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {ministryInvolvement.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619]">
                      {item.ministry}
                    </p>
                    <p className="text-[#6c757d] text-[14px] font-['Poppins:Regular',sans-serif]">{item.role}</p>
                  </div>
                  <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif]">
                    Since {new Date(item.since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="size-5 text-[#6d8aff]" />
            <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
              Attendance Summary
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="font-['Montserrat:Bold',sans-serif] text-[28px] text-[#151619]">86%</p>
              <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif]">Overall Rate</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="font-['Montserrat:Bold',sans-serif] text-[28px] text-green-600">43</p>
              <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif]">Present</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="font-['Montserrat:Bold',sans-serif] text-[28px] text-red-600">7</p>
              <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif]">Absent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4">
          Recent Attendance History
        </h2>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-[14px] font-['Poppins:Medium',sans-serif] text-[#6c757d]">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-['Poppins:Medium',sans-serif] text-[#6c757d]">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-['Poppins:Medium',sans-serif] text-[#6c757d]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceHistory.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-[14px] font-['Poppins:Regular',sans-serif] text-[#151619]">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 text-[14px] font-['Poppins:Regular',sans-serif] text-[#151619]">
                    {record.event}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-[12px] font-['Poppins:Medium',sans-serif] ${
                        record.status === 'Present'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
