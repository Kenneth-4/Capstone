import { useState } from 'react';
import { Download, FileText, Calendar, Filter, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Reports() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'members'>('attendance');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const attendanceData = [
    { month: 'Jan', present: 850, absent: 150, total: 1000 },
    { month: 'Feb', present: 820, absent: 180, total: 1000 },
    { month: 'Mar', present: 880, absent: 120, total: 1000 },
    { month: 'Apr', present: 900, absent: 100, total: 1000 },
    { month: 'May', present: 920, absent: 80, total: 1000 },
    { month: 'Jun', present: 890, absent: 110, total: 1000 },
    { month: 'Jul', present: 910, absent: 90, total: 1000 },
    { month: 'Aug', present: 930, absent: 70, total: 1000 },
    { month: 'Sep', present: 895, absent: 105, total: 1000 },
    { month: 'Oct', present: 940, absent: 60, total: 1000 },
    { month: 'Nov', present: 925, absent: 75, total: 1000 },
    { month: 'Dec', present: 950, absent: 50, total: 1000 },
  ];

  const membershipGrowthData = [
    { month: 'Jan', members: 1000 },
    { month: 'Feb', members: 1025 },
    { month: 'Mar', members: 1058 },
    { month: 'Apr', members: 1090 },
    { month: 'May', members: 1125 },
    { month: 'Jun', members: 1148 },
    { month: 'Jul', members: 1175 },
    { month: 'Aug', members: 1205 },
    { month: 'Sep', members: 1228 },
    { month: 'Oct', members: 1247 },
    { month: 'Nov', members: 1268 },
    { month: 'Dec', members: 1290 },
  ];

  const statusDistribution = [
    { name: 'Active', value: 1100, color: '#52B623' },
    { name: 'Inactive', value: 120, color: '#F5533D' },
    { name: 'Visitor', value: 70, color: '#6d8aff' },
  ];

  const eventAttendance = [
    { event: 'Sunday Service', attendance: 950 },
    { event: 'Prayer Meeting', attendance: 450 },
    { event: 'Bible Study', attendance: 380 },
    { event: 'Youth Fellowship', attendance: 280 },
    { event: 'Choir Practice', attendance: 120 },
  ];

  const ministryDistribution = [
    { name: 'Worship Team', value: 180, color: '#6d8aff' },
    { name: 'Youth Ministry', value: 250, color: '#52B623' },
    { name: 'Children Ministry', value: 220, color: '#F5533D' },
    { name: 'Media Team', value: 150, color: '#FFA500' },
    { name: 'Hospitality', value: 200, color: '#9C27B0' },
    { name: 'Others', value: 247, color: '#607D8B' },
  ];

  const stats = [
    { label: 'Total Reports Generated', value: '248', change: '+12', icon: FileText },
    { label: 'Average Attendance Rate', value: '91%', change: '+3%', icon: Calendar },
    { label: 'Active Members', value: '1,100', change: '+45', icon: FileText },
    { label: 'Growth Rate', value: '+29%', change: 'This Year', icon: Calendar },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#f5f7fb] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619]">Reports & Analytics</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors">
          <Download className="size-5" />
          Export All Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-[#6c757d] font-['Poppins:Regular',sans-serif] text-[14px]">{stat.label}</p>
                <p className="font-['Montserrat:Bold',sans-serif] text-[28px] text-[#151619]">{stat.value}</p>
                <p className="text-[12px] text-green-600">{stat.change}</p>
              </div>
              <div className="bg-[#6d8aff] bg-opacity-10 p-3 rounded-lg">
                <stat.icon className="size-6 text-[#6d8aff]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-[#6d8aff]" />
            <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">Report Type:</span>
          </div>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as 'attendance' | 'members')}
            className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
          >
            <option value="attendance">Attendance Report</option>
            <option value="members">Membership Report</option>
          </select>
          <div className="flex items-center gap-2 ml-auto">
            <label className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d]">From:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
            />
            <label className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d]">To:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Report */}
      {activeTab === 'attendance' && (
        <>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
                Monthly Attendance Overview
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="size-4" />
                Export PDF
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#52B623" name="Present" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#F5533D" name="Absent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Event Attendance */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
                Event Attendance Breakdown
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="size-4" />
                Export
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventAttendance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="event" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="attendance" fill="#6d8aff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Members Report */}
      {activeTab === 'members' && (
        <>
          <div className="grid grid-cols-2 gap-6">
            {/* Membership Growth */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
                  Membership Growth Trend
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-[12px]">
                  <Download className="size-4" />
                  Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={membershipGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="members" stroke="#6d8aff" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
                  Member Status Distribution
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-[12px]">
                  <Download className="size-4" />
                  Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ministry Distribution */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
                Ministry Involvement
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="size-4" />
                Export
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ministryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ministryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Quick Report Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4">
          Quick Report Actions
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#6d8aff] hover:bg-[#f5f7fb] transition-all text-left">
            <FileText className="size-6 text-[#6d8aff] mb-2" />
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#151619]">
              Weekly Summary
            </p>
            <p className="text-[12px] text-[#6c757d] font-['Poppins:Regular',sans-serif] mt-1">
              Generate weekly report
            </p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#6d8aff] hover:bg-[#f5f7fb] transition-all text-left">
            <FileText className="size-6 text-[#6d8aff] mb-2" />
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#151619]">
              Monthly Report
            </p>
            <p className="text-[12px] text-[#6c757d] font-['Poppins:Regular',sans-serif] mt-1">
              Generate monthly report
            </p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#6d8aff] hover:bg-[#f5f7fb] transition-all text-left">
            <FileText className="size-6 text-[#6d8aff] mb-2" />
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#151619]">
              Quarterly Report
            </p>
            <p className="text-[12px] text-[#6c757d] font-['Poppins:Regular',sans-serif] mt-1">
              Generate quarterly report
            </p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#6d8aff] hover:bg-[#f5f7fb] transition-all text-left">
            <FileText className="size-6 text-[#6d8aff] mb-2" />
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#151619]">
              Annual Report
            </p>
            <p className="text-[12px] text-[#6c757d] font-['Poppins:Regular',sans-serif] mt-1">
              Generate annual report
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}