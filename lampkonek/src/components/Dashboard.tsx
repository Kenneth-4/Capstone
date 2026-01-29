import { Users, Calendar, FileText, TrendingUp, Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

interface EventPost {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  imageUrl?: string;
}

export function Dashboard() {
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventPosts, setEventPosts] = useState<EventPost[]>([
    {
      id: '1',
      title: 'Christmas Celebration Service',
      description: 'Join us for our special Christmas celebration service with worship, message, and fellowship.',
      date: 'Dec 25, 2024',
      time: '9:00 AM',
      venue: 'Main Hall',
    },
    {
      id: '2',
      title: 'Youth Leadership Conference',
      description: 'A weekend conference focused on developing young leaders in the church.',
      date: 'Jan 12-14, 2025',
      time: '6:00 PM',
      venue: 'Conference Center',
    },
    {
      id: '3',
      title: 'Community Outreach Program',
      description: 'Reach out to our community with love and service. Volunteers needed!',
      date: 'Jan 20, 2025',
      time: '2:00 PM',
      venue: 'Community Center',
    },
  ]);
  
  const [newEvent, setNewEvent] = useState<Partial<EventPost>>({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
  });

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.description && newEvent.date && newEvent.time && newEvent.venue) {
      setEventPosts([
        {
          id: Date.now().toString(),
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          time: newEvent.time,
          venue: newEvent.venue,
        },
        ...eventPosts,
      ]);
      setNewEvent({ title: '', description: '', date: '', time: '', venue: '' });
      setShowEventForm(false);
      alert('Event posted successfully!');
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEventPosts(eventPosts.filter((event) => event.id !== id));
    }
  };

  const stats = [
    {
      label: 'Total Members',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'This Week Attendance',
      value: '892',
      change: '+5%',
      icon: TrendingUp,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Upcoming Reservations',
      value: '24',
      change: '+3',
      icon: Calendar,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Pending Reports',
      value: '8',
      change: '-2',
      icon: FileText,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  const recentActivity = [
    { action: 'New member registered', name: 'Maria Santos', time: '2 hours ago' },
    { action: 'Venue reserved', name: 'Youth Ministry', time: '3 hours ago' },
    { action: 'Attendance recorded', name: 'Sunday Service', time: '5 hours ago' },
    { action: 'Report generated', name: 'Monthly Summary', time: '1 day ago' },
    { action: 'Member updated', name: 'John Cruz', time: '2 days ago' },
  ];

  const upcomingEvents = [
    { event: 'Sunday Service', date: 'Dec 15, 2024', time: '9:00 AM', venue: 'Main Hall' },
    { event: 'Youth Fellowship', date: 'Dec 16, 2024', time: '6:00 PM', venue: 'CYM Room' },
    { event: 'Bible Study', date: 'Dec 18, 2024', time: '7:00 PM', venue: 'Main Hall' },
    { event: 'Prayer Meeting', date: 'Dec 20, 2024', time: '6:30 PM', venue: 'Chapel' },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#f5f7fb] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619]">Dashboard</h1>
        <p className="text-[#6c757d] font-['Poppins:Regular',sans-serif]">Welcome back!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-[#6c757d] font-['Poppins:Regular',sans-serif] text-[14px]">{stat.label}</p>
                <p className="font-['Montserrat:Bold',sans-serif] text-[28px] text-[#151619]">{stat.value}</p>
                <p className={`text-[12px] ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className={`size-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4">
            Recent Activity
          </h2>
          <div className="flex flex-col gap-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 bg-[#6d8aff] rounded-full mt-2"></div>
                <div className="flex flex-col gap-1 flex-1">
                  <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                    {activity.action}
                  </p>
                  <p className="text-[#6c757d] text-[12px]">{activity.name}</p>
                </div>
                <p className="text-[#6c757d] text-[12px]">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4">
            Upcoming Events
          </h2>
          <div className="flex flex-col gap-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center justify-center bg-[#6d8aff] text-white rounded-lg p-3 min-w-[60px]">
                  <p className="text-[20px] font-['Montserrat:Bold',sans-serif]">
                    {event.date.split(' ')[1].replace(',', '')}
                  </p>
                  <p className="text-[12px]">{event.date.split(' ')[0]}</p>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#151619]">{event.event}</p>
                  <p className="text-[#6c757d] text-[12px]">{event.time} • {event.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors">
            <Users className="size-5" />
            Add New Member
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#6d8aff] text-[#6d8aff] rounded-lg hover:bg-[#f5f7fb] transition-colors">
            <Calendar className="size-5" />
            Create Reservation
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#6d8aff] text-[#6d8aff] rounded-lg hover:bg-[#f5f7fb] transition-colors">
            <FileText className="size-5" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Upcoming Event Posts Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[24px] text-[#151619]">
            Upcoming Event Posts
          </h2>
          <button
            onClick={() => setShowEventForm(!showEventForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors font-['Poppins:Medium',sans-serif]"
          >
            <Plus className="size-5" />
            {showEventForm ? 'Cancel' : 'Add Event Post'}
          </button>
        </div>

        {/* Event Form */}
        {showEventForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-[#6d8aff]">
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#151619] mb-4">
              Create New Event Post
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Christmas Celebration Service"
                  className="px-4 py-2 border border-gray-300 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe the event details..."
                  rows={4}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dec 25, 2024"
                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                    value={newEvent.date || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 9:00 AM"
                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                    value={newEvent.time || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                    Venue <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Main Hall"
                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
                    value={newEvent.venue || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => {
                    setShowEventForm(false);
                    setNewEvent({ title: '', description: '', date: '', time: '', venue: '' });
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-['Poppins:Medium',sans-serif]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex items-center gap-2 px-6 py-2 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors font-['Poppins:Medium',sans-serif]"
                >
                  <Plus className="size-5" />
                  Post Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Event Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventPosts.map((event) => (
            <div key={event.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center bg-[#6d8aff] text-white rounded-lg p-3 min-w-[60px]">
                    <p className="font-['Montserrat:Bold',sans-serif] text-[20px] leading-none">
                      {event.date.split(' ')[1]?.replace(',', '') || '??'}
                    </p>
                    <p className="text-[11px] uppercase mt-1">{event.date.split(' ')[0] || 'Month'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619] mb-2 line-clamp-2">
                {event.title}
              </h3>

              <p className="text-[#6c757d] text-[13px] font-['Poppins:Regular',sans-serif] mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="flex flex-col gap-2 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-[#6c757d] text-[12px]">
                  <Clock className="size-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-[#6c757d] text-[12px]">
                  <MapPin className="size-4" />
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {eventPosts.length === 0 && (
          <div className="text-center py-12 text-[#6c757d]">
            <Calendar className="size-16 mx-auto mb-3 opacity-30" />
            <p className="font-['Poppins:Medium',sans-serif]">No event posts yet</p>
            <p className="text-[14px]">Click &quot;Add Event Post&quot; to create your first event</p>
          </div>
        )}
      </div>
    </div>
  );
}