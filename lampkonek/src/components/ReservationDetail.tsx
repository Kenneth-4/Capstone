import { ArrowLeft, Calendar, Clock, MapPin, Users, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
  purpose?: string;
  expectedAttendees?: number;
  setupRequired?: string;
  additionalNotes?: string;
}

interface ReservationDetailProps {
  reservation: Reservation;
  onBack: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function ReservationDetail({ reservation, onBack, onApprove, onReject }: ReservationDetailProps) {
  const getStatusIcon = () => {
    switch (reservation.status) {
      case 'Approved':
        return <CheckCircle className="size-6 text-green-600" />;
      case 'Rejected':
        return <XCircle className="size-6 text-red-600" />;
      case 'Pending':
        return <AlertCircle className="size-6 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (reservation.status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
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
          Back to Calendar
        </button>
        {reservation.status === 'Pending' && (
          <div className="flex gap-3">
            <button
              onClick={onReject}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <XCircle className="size-5" />
              Reject
            </button>
            <button
              onClick={onApprove}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <CheckCircle className="size-5" />
              Approve
            </button>
          </div>
        )}
      </div>

      {/* Status Card */}
      <div className={`border-2 rounded-lg p-6 ${getStatusColor()}`}>
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <p className="font-['Montserrat:SemiBold',sans-serif] text-[16px]">
              Reservation Status: {reservation.status}
            </p>
            {reservation.status === 'Pending' && (
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] mt-1">
                This reservation is awaiting approval
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Details */}
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619] mb-6">
          {reservation.title}
        </h1>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-[#6d8aff] bg-opacity-10 p-3 rounded-lg">
              <Calendar className="size-6 text-[#6d8aff]" />
            </div>
            <div>
              <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">Date</p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619]">
                {new Date(reservation.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-[#6d8aff] bg-opacity-10 p-3 rounded-lg">
              <Clock className="size-6 text-[#6d8aff]" />
            </div>
            <div>
              <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">Time</p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619]">
                {reservation.startTime} - {reservation.endTime}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-[#6d8aff] bg-opacity-10 p-3 rounded-lg">
              <MapPin className="size-6 text-[#6d8aff]" />
            </div>
            <div>
              <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">Venue</p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619]">
                {reservation.venue}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-[#6d8aff] bg-opacity-10 p-3 rounded-lg">
              <Users className="size-6 text-[#6d8aff]" />
            </div>
            <div>
              <p className="text-[#6c757d] text-[12px] font-['Poppins:Regular',sans-serif] mb-1">Requested By</p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#151619]">
                {reservation.requestedBy}
              </p>
            </div>
          </div>
        </div>

        {reservation.purpose && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-['Montserrat:SemiBold',sans-serif] text-[18px] text-[#151619] mb-2">Purpose</h3>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d]">
              {reservation.purpose}
            </p>
          </div>
        )}

        {reservation.expectedAttendees && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-['Montserrat:SemiBold',sans-serif] text-[18px] text-[#151619] mb-2">
              Expected Attendees
            </h3>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-[#6d8aff]">
              {reservation.expectedAttendees} people
            </p>
          </div>
        )}

        {reservation.setupRequired && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-['Montserrat:SemiBold',sans-serif] text-[18px] text-[#151619] mb-2">
              Setup Required
            </h3>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d]">
              {reservation.setupRequired}
            </p>
          </div>
        )}
      </div>

      {/* Equipment Section */}
      {reservation.equipment.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="size-5 text-[#6d8aff]" />
            <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619]">
              Equipment Needed
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {reservation.equipment.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <CheckCircle className="size-4 text-green-500" />
                <span className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#151619]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {reservation.additionalNotes && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4">
            Additional Notes
          </h2>
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d] whitespace-pre-wrap">
            {reservation.additionalNotes}
          </p>
        </div>
      )}
    </div>
  );
}
