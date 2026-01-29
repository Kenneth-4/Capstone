import { useState } from 'react';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

interface ReservationFormProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  termsAndConditions?: string;
}

export function ReservationForm({ onBack, onSubmit, termsAndConditions }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
    setupRequired: '',
    equipment: [] as string[],
    additionalNotes: '',
    acceptedTerms: false,
  });

  const [newEquipment, setNewEquipment] = useState('');

  const availableVenues = [
    'Main Hall',
    'CYM Room',
    'Chapel',
    'Conference Room A',
    'Conference Room B',
    'Outdoor Area',
  ];

  const commonEquipment = [
    'Sound System',
    'Projector',
    'Screen',
    'Microphones',
    'Livestream Equipment',
    'Chairs',
    'Tables',
    'Whiteboard',
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddEquipment = (equipment: string) => {
    if (!formData.equipment.includes(equipment)) {
      setFormData((prev) => ({
        ...prev,
        equipment: [...prev.equipment, equipment],
      }));
    }
  };

  const handleRemoveEquipment = (equipment: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((e) => e !== equipment),
    }));
  };

  const handleAddCustomEquipment = () => {
    if (newEquipment.trim() && !formData.equipment.includes(newEquipment.trim())) {
      setFormData((prev) => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()],
      }));
      setNewEquipment('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (termsAndConditions && !formData.acceptedTerms) {
      alert('Please accept the terms and conditions to continue.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#f5f7fb] min-h-screen">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#6d8aff] hover:text-[#5a75e6] font-['Poppins:Medium',sans-serif]"
        >
          <ArrowLeft className="size-5" />
          Back to Calendar
        </button>
        <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619]">
          New Reservation Request
        </h1>
        <div className="w-[120px]"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="col-span-2">
            <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4 pb-2 border-b border-gray-200">
              Event Information
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              placeholder="Enter event title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Venue <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.venue}
              onChange={(e) => handleChange('venue', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
            >
              <option value="">Select venue</option>
              {availableVenues.map((venue) => (
                <option key={venue} value={venue}>
                  {venue}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              />
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Purpose <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              rows={3}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff] resize-none"
              placeholder="Describe the purpose of this reservation"
            />
          </div>

          {/* Additional Details */}
          <div className="col-span-2 mt-4">
            <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4 pb-2 border-b border-gray-200">
              Additional Details
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Expected Attendees <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.expectedAttendees}
              onChange={(e) => handleChange('expectedAttendees', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              placeholder="Number of attendees"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Setup Required
            </label>
            <select
              value={formData.setupRequired}
              onChange={(e) => handleChange('setupRequired', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
            >
              <option value="">Select setup type</option>
              <option value="Theater">Theater Style</option>
              <option value="Classroom">Classroom Style</option>
              <option value="Banquet">Banquet Style</option>
              <option value="U-Shape">U-Shape</option>
              <option value="None">No Special Setup</option>
            </select>
          </div>

          {/* Equipment Selection */}
          <div className="col-span-2 flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Equipment Needed
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonEquipment.map((equipment) => (
                <button
                  key={equipment}
                  type="button"
                  onClick={() =>
                    formData.equipment.includes(equipment)
                      ? handleRemoveEquipment(equipment)
                      : handleAddEquipment(equipment)
                  }
                  className={`px-3 py-1.5 rounded-lg text-[14px] font-['Poppins:Medium',sans-serif] transition-colors ${
                    formData.equipment.includes(equipment)
                      ? 'bg-[#6d8aff] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {equipment}
                </button>
              ))}
            </div>
            {formData.equipment.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="text-[14px] font-['Poppins:Medium',sans-serif] text-[#6c757d]">Selected:</span>
                {formData.equipment.map((equipment) => (
                  <span
                    key={equipment}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#6d8aff] text-white rounded text-[12px] font-['Poppins:Regular',sans-serif]"
                  >
                    {equipment}
                    <button type="button" onClick={() => handleRemoveEquipment(equipment)}>
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                placeholder="Add custom equipment"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              />
              <button
                type="button"
                onClick={handleAddCustomEquipment}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Plus className="size-4" />
                Add
              </button>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Additional Notes
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => handleChange('additionalNotes', e.target.value)}
              rows={4}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff] resize-none"
              placeholder="Any additional information or special requests..."
            />
          </div>

          {/* Terms and Conditions */}
          {termsAndConditions && (
            <div className="col-span-2 mt-4">
              <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4 pb-2 border-b border-gray-200">
                Terms and Conditions
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-[200px] overflow-y-auto mb-4">
                <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#151619] whitespace-pre-wrap">
                  {termsAndConditions}
                </p>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.acceptedTerms}
                  onChange={(e) => handleChange('acceptedTerms', e.target.checked.toString())}
                  className="mt-1 size-4 text-[#6d8aff] border-gray-300 rounded focus:ring-[#6d8aff]"
                />
                <span className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#151619]">
                  I have read and agree to the terms and conditions <span className="text-red-500">*</span>
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-['Poppins:Medium',sans-serif]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-[#6d8aff] text-white rounded-lg hover:bg-[#5a75e6] transition-colors font-['Poppins:Medium',sans-serif]"
          >
            <Save className="size-5" />
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}