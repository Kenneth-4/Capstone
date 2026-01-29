import { useState } from 'react';
import { Search, Download, Filter, Copy, Check, ExternalLink, Link as LinkIcon, Plus } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export function Attendance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all events');
  const [selectedCluster, setSelectedCluster] = useState('all clusters');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('onsite');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    status: 'PRESENT',
    cluster: '',
    event: '',
    mode: 'onsite',
    date: new Date().toISOString().split('T')[0]
  });

  const events = ['All Events', 'Sunday Service', 'Prayer Meeting', 'Bible Study', 'Youth Fellowship', 'Choir Practice'];
  const clusters = ['All Clusters', 'Cluster A', 'Cluster B', 'Cluster C'];

  const attendanceData = [
    { name: 'John Doe', status: 'PRESENT', cluster: 'Cluster A', event: 'Sunday Service', mode: 'onsite' },
    { name: 'Jane Doe', status: 'ABSENT', cluster: 'Cluster B', event: 'Sunday Service', mode: 'online' },
    { name: 'Maria Santos', status: 'PRESENT', cluster: 'Cluster A', event: 'Prayer Meeting', mode: 'online' },
    { name: 'Pedro Cruz', status: 'PRESENT', cluster: 'Cluster C', event: 'Sunday Service', mode: 'onsite' },
    { name: 'Anna Reyes', status: 'ABSENT', cluster: 'Cluster B', event: 'Bible Study', mode: 'online' },
    { name: 'Mark Garcia', status: 'PRESENT', cluster: 'Cluster A', event: 'Sunday Service', mode: 'onsite' },
    { name: 'Lisa Tan', status: 'PRESENT', cluster: 'Cluster C', event: 'Youth Fellowship', mode: 'online' },
    { name: 'Carlos Ramos', status: 'ABSENT', cluster: 'Cluster B', event: 'Sunday Service', mode: 'onsite' },
    { name: 'Sofia Lopez', status: 'PRESENT', cluster: 'Cluster A', event: 'Sunday Service', mode: 'onsite' },
    { name: 'Miguel Torres', status: 'PRESENT', cluster: 'Cluster C', event: 'Choir Practice', mode: 'online' },
    { name: 'Grace Kim', status: 'PRESENT', cluster: 'Cluster A', event: 'Sunday Service', mode: 'online' },
    { name: 'David Lee', status: 'PRESENT', cluster: 'Cluster B', event: 'Prayer Meeting', mode: 'onsite' },
  ];

  const barChartData = [
    { month: 'JAN', value: 120 },
    { month: 'FEB', value: 110 },
    { month: 'MAR', value: 105 },
    { month: 'APR', value: 115 },
    { month: 'MAY', value: 130 },
    { month: 'JUN', value: 125 },
    { month: 'JUL', value: 135 },
    { month: 'AUG', value: 140 },
    { month: 'SEP', value: 128 },
    { month: 'OCT', value: 145 },
    { month: 'NOV', value: 138 },
    { month: 'DEC', value: 150 },
  ];

  const lineChartData = [
    { month: 'JAN', lorem: 75, ipsum: 70 },
    { month: 'FEB', lorem: 72, ipsum: 68 },
    { month: 'MAR', lorem: 78, ipsum: 75 },
    { month: 'APR', lorem: 80, ipsum: 78 },
    { month: 'MAY', lorem: 85, ipsum: 82 },
    { month: 'JUN', lorem: 88, ipsum: 85 },
    { month: 'JUL', lorem: 90, ipsum: 88 },
    { month: 'AUG', lorem: 92, ipsum: 90 },
    { month: 'SEP', lorem: 95, ipsum: 93 },
    { month: 'OCT', lorem: 98, ipsum: 95 },
    { month: 'NOV', lorem: 100, ipsum: 98 },
    { month: 'DEC', lorem: 105, ipsum: 102 },
  ];

  const filteredData = attendanceData.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === 'all events' || row.event === selectedEvent;
    const matchesCluster = selectedCluster === 'all clusters' || row.cluster === selectedCluster;
    const matchesMode = activeTab === 'all' || row.mode === activeTab;
    return matchesSearch && matchesEvent && matchesCluster && matchesMode;
  });

  const presentCount = filteredData.filter(d => d.status === 'PRESENT').length;
  const absentCount = filteredData.filter(d => d.status === 'ABSENT').length;

  const onsiteCount = attendanceData.filter(d => d.mode === 'onsite').length;
  const onlineCount = attendanceData.filter(d => d.mode === 'online').length;

  // Generate attendance form link
  const attendanceFormLink = `${window.location.origin}/attendance-form`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(attendanceFormLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would submit to a backend
    console.log('Attendance record added:', formData);
    setIsFormOpen(false);
    // Reset form
    setFormData({
      name: '',
      status: 'PRESENT',
      cluster: '',
      event: '',
      mode: 'onsite',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#f5f7fb] min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619]">Attendance</h1>
        <div className="flex gap-3">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#6d8aff] text-[#6d8aff] rounded-lg hover:bg-[#f0f4ff] transition-colors">
                <Plus className="size-5" />
                Add Attendance
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add Attendance Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 py-4">
                <div>
                  <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
                    Member Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter member name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                    >
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
                      Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                    >
                      <option value="onsite">Onsite</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
                    Event <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="event"
                    value={formData.event}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                  >
                    <option value="">Select an event</option>
                    {events.filter(e => e !== 'All Events').map((event) => (
                      <option key={event} value={event}>
                        {event}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
                    Cluster <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cluster"
                    value={formData.cluster}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                  >
                    <option value="">Select a cluster</option>
                    {clusters.filter(c => c !== 'All Clusters').map((cluster) => (
                      <option key={cluster} value={cluster}>
                        {cluster}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-['Poppins:Medium',sans-serif]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors font-['Poppins:Medium',sans-serif]"
                  >
                    Add Record
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#6d8aff] text-[#6d8aff] rounded-lg hover:bg-[#f0f4ff] transition-colors">
                <LinkIcon className="size-5" />
                Online Form Link
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Online Attendance Form Link</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-600">
                  Share this link with members to submit their attendance online:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={attendanceFormLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] bg-gray-50"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors"
                  >
                    {copiedLink ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <a
                  href={attendanceFormLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#6d8aff] hover:underline font-['Poppins:Regular',sans-serif] text-[14px]"
                >
                  <ExternalLink className="size-4" />
                  Open form in new tab
                </a>
              </div>
            </DialogContent>
          </Dialog>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors">
            <Download className="size-5" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search....."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">Date</label>
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
          </div>
          <div className="flex items-center gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded font-['Poppins:Regular',sans-serif] text-[14px]"
            >
              {events.map((event) => (
                <option key={event} value={event.toLowerCase()}>
                  {event}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">Cluster</label>
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded font-['Poppins:Regular',sans-serif] text-[14px]"
            >
              {clusters.map((cluster) => (
                <option key={cluster} value={cluster.toLowerCase()}>
                  {cluster}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">Mode</label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded font-['Poppins:Regular',sans-serif] text-[14px]"
            >
              <option value="all">All</option>
              <option value="onsite">Onsite</option>
              <option value="online">Online</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* Attendance Table with Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tabs for Online/Onsite */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 px-4 pt-4">
              <TabsList className="bg-transparent border-b-0 h-auto p-0 w-full justify-start gap-4">
                <TabsTrigger 
                  value="all" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6d8aff] data-[state=active]:bg-transparent px-4 py-2"
                >
                  <span className="font-['Poppins:Medium',sans-serif] text-[14px]">
                    All Attendees ({attendanceData.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="onsite" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6d8aff] data-[state=active]:bg-transparent px-4 py-2"
                >
                  <span className="font-['Poppins:Medium',sans-serif] text-[14px]">
                    Onsite ({onsiteCount})
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="online" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6d8aff] data-[state=active]:bg-transparent px-4 py-2"
                >
                  <span className="font-['Poppins:Medium',sans-serif] text-[14px]">
                    Online ({onlineCount})
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              {/* Table Header */}
              <div className="grid grid-cols-[200px_150px_120px_150px_120px] items-center px-4 py-[18px] border-b border-[#d6e3f2]">
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">NAME</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">STATUS</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">CLUSTER</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">EVENT</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">MODE</p>
                </div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {filteredData.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[200px_150px_120px_150px_120px] items-center px-4 py-[16px] border-b border-[#d6e3f2] hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black">{row.name}</p>
                    </div>
                    <div className="flex gap-[6px] items-center">
                      <div className="size-[16px]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                          <circle
                            cx="8"
                            cy="8"
                            r="8"
                            fill={row.status === 'PRESENT' ? 'url(#paint0_linear_present)' : 'url(#paint0_linear_absent)'}
                          />
                          <defs>
                            <linearGradient id="paint0_linear_present" x1="8" x2="8" y1="0" y2="16" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#94D145" />
                              <stop offset="1" stopColor="#52B623" />
                            </linearGradient>
                            <linearGradient id="paint0_linear_absent" x1="8" x2="8" y1="0" y2="16" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF9C8E" />
                              <stop offset="1" stopColor="#F5533D" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black tracking-[0.8px]">
                        {row.status}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black tracking-[0.8px]">
                        {row.cluster}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black">{row.event}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-[12px] font-['Poppins:Medium',sans-serif] ${
                        row.mode === 'online' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {row.mode.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="onsite" className="mt-0">
              {/* Table Header */}
              <div className="grid grid-cols-[200px_150px_120px_200px_80px] items-center px-4 py-[18px] border-b border-[#d6e3f2]">
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">NAME</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">STATUS</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">CLUSTER</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">EVENT</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">ACTION</p>
                </div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {filteredData.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[200px_150px_120px_200px_80px] items-center px-4 py-[16px] border-b border-[#d6e3f2] hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black">{row.name}</p>
                    </div>
                    <div className="flex gap-[6px] items-center">
                      <div className="size-[16px]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                          <circle
                            cx="8"
                            cy="8"
                            r="8"
                            fill={row.status === 'PRESENT' ? 'url(#paint0_linear_present_onsite)' : 'url(#paint0_linear_absent_onsite)'}
                          />
                          <defs>
                            <linearGradient id="paint0_linear_present_onsite" x1="8" x2="8" y1="0" y2="16" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#94D145" />
                              <stop offset="1" stopColor="#52B623" />
                            </linearGradient>
                            <linearGradient id="paint0_linear_absent_onsite" x1="8" x2="8" y1="0" y2="16" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF9C8E" />
                              <stop offset="1" stopColor="#F5533D" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black tracking-[0.8px]">
                        {row.status}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black tracking-[0.8px]">
                        {row.cluster}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black">{row.event}</p>
                    </div>
                    <button className="font-['Poppins:Regular',sans-serif] text-[16px] text-[#6d8aff] hover:underline text-left">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="online" className="mt-0">
              {/* Table Header */}
              <div className="grid grid-cols-[200px_150px_120px_200px_80px] items-center px-4 py-[18px] border-b border-[#d6e3f2]">
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">NAME</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">STATUS</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">CLUSTER</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">EVENT</p>
                </div>
                <div className="flex gap-[6px] items-center">
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#2c5b8c]">ACTION</p>
                </div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {filteredData.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[200px_150px_120px_200px_80px] items-center px-4 py-[16px] border-b border-[#d6e3f2] hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black">{row.name}</p>
                    </div>
                    <div className="flex gap-[6px] items-center">
                      <div className="size-[16px]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                          <circle
                            cx="8"
                            cy="8"
                            r="8"
                            fill={row.status === 'PRESENT' ? 'url(#paint0_linear_present_online)' : 'url(#paint0_linear_absent_online)'}
                          />
                          <defs>
                            <linearGradient id="paint0_linear_present_online" x1="8" x2="8" y1="0" y2="16" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#94D145" />
                              <stop offset="1" stopColor="#52B623" />
                            </linearGradient>
                            <linearGradient id="paint0_linear_absent_online" x1="8" x2="8" y1="0" y2="16" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF9C8E" />
                              <stop offset="1" stopColor="#F5533D" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black tracking-[0.8px]">
                        {row.status}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black tracking-[0.8px]">
                        {row.cluster}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black">{row.event}</p>
                    </div>
                    <button className="font-['Poppins:Regular',sans-serif] text-[16px] text-[#6d8aff] hover:underline text-left">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="size-[16px] bg-[#94D145] rounded-full"></div>
              <span className="font-['Poppins:Regular',sans-serif] text-[14px]">Present: {presentCount}</span>
              <div className="size-[16px] bg-[#F5533D] rounded-full ml-3"></div>
              <span className="font-['Poppins:Regular',sans-serif] text-[14px]">Absent: {absentCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-['Poppins:Regular',sans-serif] text-[14px]">Per Page:</span>
              <select className="px-3 py-1 border border-gray-200 rounded">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="font-['Poppins:Regular',sans-serif] text-[14px]">1 2 3 ... 98 99</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex flex-col gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#6c757d]">CHART TEXT</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-[12px] text-[#6d8aff] bg-[#e8eeff] rounded">LOREM</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6d8aff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#6c757d]">CHART TEXT</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-[12px] text-[#6d8aff] bg-[#e8eeff] rounded">LOREM</button>
                <button className="px-3 py-1 text-[12px] text-gray-600 bg-gray-100 rounded">IPSUM</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="lorem" stroke="#6d8aff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ipsum" stroke="#f5533d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}