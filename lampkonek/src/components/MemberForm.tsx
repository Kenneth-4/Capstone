import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

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

interface MemberFormProps {
  member?: Member;
  onBack: () => void;
  onSave: (member: Partial<Member>) => void;
}

export function MemberForm({ member, onBack, onSave }: MemberFormProps) {
  const [formData, setFormData] = useState<Partial<Member>>({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    cluster: member?.cluster || '',
    ministry: member?.ministry || '',
    status: member?.status || 'Visitor',
    joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
    address: member?.address || '',
    birthdate: member?.birthdate || '',
    emergencyContact: member?.emergencyContact || '',
    emergencyPhone: member?.emergencyPhone || '',
  });

  const handleChange = (field: keyof Member, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
          Back
        </button>
        <h1 className="font-['Montserrat:Bold',sans-serif] text-[32px] text-[#151619]">
          {member ? 'Edit Member' : 'Add New Member'}
        </h1>
        <div className="w-[100px]"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <div className="col-span-2">
            <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4 pb-2 border-b border-gray-200">
              Basic Information
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              placeholder="Enter full name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              placeholder="email@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              placeholder="+63 912 345 6789"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Birthdate
            </label>
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) => handleChange('birthdate', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff] resize-none"
              placeholder="Enter complete address"
            />
          </div>

          {/* Church Information Section */}
          <div className="col-span-2 mt-4">
            <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4 pb-2 border-b border-gray-200">
              Church Information
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Cluster <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.cluster}
              onChange={(e) => handleChange('cluster', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
            >
              <option value="">Select cluster</option>
              <option value="Cluster A">Cluster A</option>
              <option value="Cluster B">Cluster B</option>
              <option value="Cluster C">Cluster C</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Ministry <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.ministry}
              onChange={(e) => handleChange('ministry', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
            >
              <option value="">Select ministry</option>
              <option value="Worship Team">Worship Team</option>
              <option value="Youth Ministry">Youth Ministry</option>
              <option value="Children Ministry">Children Ministry</option>
              <option value="Media Team">Media Team</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Ushering">Ushering</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as 'Active' | 'Inactive' | 'Visitor')}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Visitor">Visitor</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Join Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.joinDate}
              onChange={(e) => handleChange('joinDate', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
            />
          </div>

          {/* Emergency Contact Section */}
          <div className="col-span-2 mt-4">
            <h2 className="font-['Montserrat:SemiBold',sans-serif] text-[20px] text-[#151619] mb-4 pb-2 border-b border-gray-200">
              Emergency Contact
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Contact Name
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              placeholder="Enter emergency contact name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619]">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => handleChange('emergencyPhone', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff]"
              placeholder="+63 912 345 6789"
            />
          </div>
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
            {member ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
