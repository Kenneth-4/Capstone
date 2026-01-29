import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

interface Reservation {
  id: string;
  title: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedBy: string;
  equipment: string[];
}

interface ReservationCalendarProps {
  onCreateReservation: () => void;
  onViewReservation: (reservation: Reservation) => void;
}

export function ReservationCalendar({ onCreateReservation, onViewReservation }: ReservationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const reservations: Reservation[] = [
    {
      id: '1',
      title: 'Sunday Service',
      venue: 'Main Hall',
      date: '2024-12-15',
      startTime: '09:00',
      endTime: '11:00',
      status: 'Approved',
      requestedBy: 'Admin',
      equipment: ['Sound System', 'Projector', 'Livestream Equipment'],
    },
    {
      id: '2',
      title: 'Youth Fellowship',
      venue: 'CYM Room',
      date: '2024-12-16',
      startTime: '18:00',
      endTime: '20:00',
      status: 'Approved',
      requestedBy: 'Youth Leader',
      equipment: ['Sound System'],
    },
    {
      id: '3',
      title: 'Bible Study',
      venue: 'Main Hall',
      date: '2024-12-18',
      startTime: '19:00',
      endTime: '21:00',
      status: 'Pending',
      requestedBy: 'Ministry Leader',
      equipment: ['Projector'],
    },
    {
      id: '4',
      title: 'Prayer Meeting',
      venue: 'Chapel',
      date: '2024-12-20',
      startTime: '18:30',
      endTime: '20:00',
      status: 'Approved',
      requestedBy: 'Pastor',
      equipment: [],
    },
  ];

  const upcomingReservations = reservations
    .filter((r) => new Date(r.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getReservationsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    return reservations.filter((r) => r.date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#f5f7fb] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619]">
          Reservation Management
        </h1>
        <button
          onClick={onCreateReservation}
          className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors"
        >
          <Plus className="size-5" />
          New Reservation
        </button>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded-lg font-['Poppins:Medium',sans-serif] text-[14px] transition-colors ${
                    viewMode === 'month'
                      ? 'bg-[#6d8aff] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-lg font-['Poppins:Medium',sans-serif] text-[14px] transition-colors ${
                    viewMode === 'week'
                      ? 'bg-[#6d8aff] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#6c757d] py-2"
              >
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square p-2"></div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayReservations = getReservationsForDate(day);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                    isToday ? 'border-[#6d8aff] border-2' : ''
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`font-['Poppins:Medium',sans-serif] text-[14px] ${
                        isToday ? 'text-[#6d8aff]' : 'text-[#151619]'
                      }`}
                    >
                      {day}
                    </span>
                    <div className="flex-1 mt-1 flex flex-col gap-1">
                      {dayReservations.map((reservation, idx) => (
                        <button
                          key={idx}
                          onClick={() => onViewReservation(reservation)}
                          className={`text-left text-[10px] font-['Poppins:Regular',sans-serif] px-1 py-0.5 rounded truncate ${getStatusColor(
                            reservation.status
                          )} text-white hover:opacity-80 transition-opacity`}
                          title={reservation.title}
                        >
                          {reservation.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="size-3 bg-green-500 rounded"></div>
              <span className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d]">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 bg-yellow-500 rounded"></div>
              <span className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d]">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 bg-red-500 rounded"></div>
              <span className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d]">Rejected</span>
            </div>
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4">
            Upcoming Reservations
          </h2>
          <div className="flex flex-col gap-3">
            {upcomingReservations.map((reservation) => (
              <button
                key={reservation.id}
                onClick={() => onViewReservation(reservation)}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#151619]">
                    {reservation.title}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-1 rounded font-['Poppins:Medium',sans-serif] ${
                      reservation.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : reservation.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-[12px] text-[#6c757d]">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-3" />
                    <span className="font-['Poppins:Regular',sans-serif]">
                      {new Date(reservation.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3" />
                    <span className="font-['Poppins:Regular',sans-serif]">
                      {reservation.startTime} - {reservation.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3" />
                    <span className="font-['Poppins:Regular',sans-serif]">{reservation.venue}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
