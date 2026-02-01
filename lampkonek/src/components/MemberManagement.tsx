import { useState, useEffect } from 'react';
import { MemberList } from './MemberList';
import { MemberDetail } from './MemberDetail';
import { MemberForm } from './MemberForm';
import { supabase } from '../lib/supabase';

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
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from('members').select('*');
    if (error) {
      console.error('Error fetching members:', error);
    } else {
      setMembers(data as Member[] || []);
    }
  };

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

  const handleSaveMember = async (memberData: Partial<Member>) => {
    try {
      if (viewMode === 'add') {
        const { error } = await supabase.from('members').insert([memberData]);
        if (error) throw error;
        alert('Member added successfully!');
      } else if (selectedMember) {
        const { error } = await supabase.from('members').update(memberData).eq('id', selectedMember.id);
        if (error) throw error;
        alert('Member updated successfully!');
      }
      fetchMembers();
      setViewMode('list');
    } catch (error: any) {
      alert('Error saving member: ' + error.message);
    }
  };

  if (viewMode === 'list') {
    return <MemberList members={members} onSelectMember={handleSelectMember} onAddMember={handleAddMember} />;
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

  return <MemberList members={members} onSelectMember={handleSelectMember} onAddMember={handleAddMember} />;
}
