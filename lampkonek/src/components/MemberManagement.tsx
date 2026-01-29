import { useState } from 'react';
import { MemberList } from './MemberList';
import { MemberDetail } from './MemberDetail';
import { MemberForm } from './MemberForm';

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

type ViewMode = 'list' | 'detail' | 'add' | 'edit';

export function MemberManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setViewMode('detail');
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setViewMode('add');
  };

  const handleEditMember = () => {
    setViewMode('edit');
  };

  const handleBackToList = () => {
    setSelectedMember(null);
    setViewMode('list');
  };

  const handleSaveMember = (memberData: Partial<Member>) => {
    // In a real app, this would save to backend
    console.log('Saving member:', memberData);
    alert(viewMode === 'add' ? 'Member added successfully!' : 'Member updated successfully!');
    setViewMode('list');
  };

  if (viewMode === 'list') {
    return <MemberList onSelectMember={handleSelectMember} onAddMember={handleAddMember} />;
  }

  if (viewMode === 'detail' && selectedMember) {
    return <MemberDetail member={selectedMember} onBack={handleBackToList} onEdit={handleEditMember} />;
  }

  if (viewMode === 'add') {
    return <MemberForm onBack={handleBackToList} onSave={handleSaveMember} />;
  }

  if (viewMode === 'edit' && selectedMember) {
    return <MemberForm member={selectedMember} onBack={() => setViewMode('detail')} onSave={handleSaveMember} />;
  }

  return <MemberList onSelectMember={handleSelectMember} onAddMember={handleAddMember} />;
}
