import { useState } from 'react';
import { LogOut } from 'lucide-react';
import svgPaths from "../imports/svg-r0cmz1jz6d";

interface HeaderProps {
  userName: string;
  userRole: string;
  onSignOut?: () => void;
}

export function Header({ userName, userRole, onSignOut }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="absolute bg-white h-[71px] left-[222px] overflow-clip top-0 w-[1698px]">
      <button 
        className="absolute left-[1647px] size-[38px] top-[17px]"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 38">
          <g>
            <path d={svgPaths.p365b4b00} fill="var(--fill-0, black)" />
          </g>
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-[10px] top-[60px] bg-white shadow-lg rounded-lg border border-gray-200 w-[200px] z-50">
          <button
            onClick={() => {
              setShowDropdown(false);
              onSignOut?.();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors font-['Poppins:Regular',sans-serif] text-[14px] text-[#151619]"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      )}

      <div className="absolute left-[20px] size-[34px] top-[19px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
          <g>
            <path d={svgPaths.p6d954b0} fill="var(--fill-0, black)" />
            <path d={svgPaths.p3c9ac500} fill="var(--fill-0, black)" />
          </g>
        </svg>
      </div>
      <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] left-[61px] text-[16px] text-black text-nowrap top-[16px] whitespace-pre">
        {userName}
      </p>
      <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] left-[61px] text-[12px] text-black text-nowrap top-[38px] whitespace-pre">
        {userRole}
      </p>
    </div>
  );
}