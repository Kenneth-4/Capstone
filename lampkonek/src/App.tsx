import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Attendance } from './components/Attendance';
import { MemberManagement } from './components/MemberManagement';
import { ReservationManagement } from './components/ReservationManagement';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { AttendanceForm } from './components/AttendanceForm';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [session, setSession] = useState<any>(null);
  const [authPage, setAuthPage] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(true);
  const [isPublicForm, setIsPublicForm] = useState(false);

  // Check if accessing public attendance form
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/attendance-form') {
      setIsPublicForm(true);
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string, role: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          },
        },
      });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentPage('dashboard');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Show public attendance form without authentication
  if (isPublicForm) {
    return <AttendanceForm />;
  }

  // Show authentication pages if not authenticated
  if (!session) {
    if (authPage === 'signin') {
      return <SignIn onSignIn={handleSignIn} onSwitchToSignUp={() => setAuthPage('signup')} />;
    } else {
      return <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => setAuthPage('signin')} />;
    }
  }

  const userName = session.user.user_metadata.full_name || 'User';
  const userRole = session.user.user_metadata.role || 'Member';

  const renderPage = () => {
    // Normalization
    const normalizedRole = userRole?.toLowerCase().replace(' ', '_') || 'member';
    const isAdmin = normalizedRole === 'admin';

    // Access control logic
    if (currentPage === 'settings' && !isAdmin) return <Dashboard />;
    if (currentPage === 'member' && !isAdmin && normalizedRole !== 'ministry_leader') return <Dashboard />;
    if (currentPage === 'reports' && !isAdmin && normalizedRole !== 'ministry_leader') return <Dashboard />;

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'attendance':
        return <Attendance />;
      case 'member':
        return <MemberManagement />;
      case 'reservation':
        return <ReservationManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative bg-[#f5f7fb] min-h-screen w-full overflow-x-hidden">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userRole={userRole}
        onSignOut={handleSignOut}
      />
      <div className="ml-[222px]">
        <Header userName={userName} userRole={userRole} onSignOut={handleSignOut} />
        <div className="mt-[71px]">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}