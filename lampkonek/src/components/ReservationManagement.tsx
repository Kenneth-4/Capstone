import { useState } from 'react';
import { ReservationCalendar } from './ReservationCalendar';
import { ReservationForm } from './ReservationForm';
import { ReservationDetail } from './ReservationDetail';

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

type ViewMode = 'calendar' | 'form' | 'detail';

export function ReservationManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  
  // Default terms and conditions - in real app, this would come from settings/backend
  const [termsAndConditions] = useState(`RESERVATION TERMS AND CONDITIONS

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

  const handleCreateReservation = () => {
    setViewMode('form');
  };

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setViewMode('detail');
  };

  const handleBackToCalendar = () => {
    setSelectedReservation(null);
    setViewMode('calendar');
  };

  const handleSubmitReservation = (data: any) => {
    // In a real app, this would save to backend
    console.log('Submitting reservation:', data);
    alert('Reservation request submitted successfully!');
    setViewMode('calendar');
  };

  const handleApprove = () => {
    alert('Reservation approved!');
    setViewMode('calendar');
  };

  const handleReject = () => {
    alert('Reservation rejected!');
    setViewMode('calendar');
  };

  if (viewMode === 'form') {
    return <ReservationForm onBack={handleBackToCalendar} onSubmit={handleSubmitReservation} termsAndConditions={termsAndConditions} />;
  }

  if (viewMode === 'detail' && selectedReservation) {
    return (
      <ReservationDetail
        reservation={selectedReservation}
        onBack={handleBackToCalendar}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  }

  return (
    <ReservationCalendar onCreateReservation={handleCreateReservation} onViewReservation={handleViewReservation} />
  );
}