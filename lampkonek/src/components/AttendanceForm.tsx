import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export function AttendanceForm() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cluster: '',
    event: '',
    notes: ''
  });

  const events = ['Sunday Service', 'Prayer Meeting', 'Bible Study', 'Youth Fellowship', 'Choir Practice'];
  const clusters = ['Cluster A', 'Cluster B', 'Cluster C'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would submit to a backend
    console.log('Attendance submitted:', formData);
    setFormSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="size-16 text-[#52B623]" />
          </div>
          <h2 className="font-['Montserrat:Bold',sans-serif] text-[24px] text-[#151619] mb-2">
            Attendance Submitted!
          </h2>
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-600 mb-6">
            Thank you for submitting your online attendance. Your participation has been recorded.
          </p>
          <button
            onClick={() => {
              setFormSubmitted(false);
              setFormData({
                name: '',
                email: '',
                cluster: '',
                event: '',
                notes: ''
              });
            }}
            className="px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors font-['Poppins:Medium',sans-serif]"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619] mb-2">
              Online Attendance Form
            </h1>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-600">
              Please fill out this form to record your online attendance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              />
            </div>

            <div>
              <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              />
            </div>

            <div>
              <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
                Event <span className="text-red-500">*</span>
              </label>
              <select
                name="event"
                value={formData.event}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
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
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              >
                <option value="">Select your cluster</option>
                {clusters.map((cluster) => (
                  <option key={cluster} value={cluster}>
                    {cluster}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional comments or prayer requests..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors font-['Poppins:Medium',sans-serif] text-[16px]"
            >
              Submit Attendance
            </button>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-blue-800">
            <strong>Note:</strong> This form is for online attendees only. If you're attending in person, 
            please check in at the registration desk.
          </p>
        </div>
      </div>
    </div>
  );
}
