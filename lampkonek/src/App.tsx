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

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<'signin' | 'signup'>('signin');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isPublicForm, setIsPublicForm] = useState(false);

  // Check if accessing public attendance form
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/attendance-form') {
      setIsPublicForm(true);
    }
  }, []);

  const handleSignIn = (email: string, password: string) => {
    // Mock authentication - in production, this would call an API
    setUserName('Ministry Leader');
    setUserRole('Admin');
    setIsAuthenticated(true);
  };

  const handleSignUp = (name: string, email: string, password: string, role: string) => {
    // Mock sign up - in production, this would call an API
    setUserName(name);
    setUserRole(role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' '));
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserName('');
    setUserRole('');
    setCurrentPage('dashboard');
  };

  // Show public attendance form without authentication
  if (isPublicForm) {
    return <AttendanceForm />;
  }

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    if (authPage === 'signin') {
      return <SignIn onSignIn={handleSignIn} onSwitchToSignUp={() => setAuthPage('signup')} />;
    } else {
      return <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => setAuthPage('signin')} />;
    }
  }

  const renderPage = () => {
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
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="ml-[222px]">
        <Header userName={userName} userRole={userRole} onSignOut={handleSignOut} />
        <div className="mt-[71px]">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}