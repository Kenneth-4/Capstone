import svgPaths from "../imports/svg-r0cmz1jz6d";
import img4652293918745592847665684231656082395705280NRemovebgPreview1 from "figma:asset/696ba903fc58e6831916a7916f14a4406c36dbe5.png";
import imgImage25 from "figma:asset/33a862d7a5675178d29adab8ee097ff097d6669d.png";
import imgImage26 from "figma:asset/89c01aa72e7f571404d27748c22db21614e2944c.png";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

function DashboardIcon() {
  return (
    <div className="absolute left-[41px] size-[24px] top-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p3c463900} fill="var(--fill-0, black)" />
          <path d={svgPaths.p248ed70} fill="var(--fill-0, black)" />
          <path d={svgPaths.p2946ca80} fill="var(--fill-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function MemberIcon() {
  return (
    <div className="absolute left-[42px] size-[24px] top-[306px]">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage26} />
    </div>
  );
}

function ReservationIcon() {
  return (
    <div className="absolute left-[41px] size-[24px] top-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p129b0300} fill="var(--fill-0, black)" />
          <path d={svgPaths.p1e23dbf2} fill="var(--fill-0, black)" />
          <path d={svgPaths.p3ff4ae00} fill="var(--fill-0, black)" />
          <path d={svgPaths.p384e0b80} fill="var(--fill-0, black)" />
          <path d={svgPaths.p2ac1da80} fill="var(--fill-0, black)" />
          <path d={svgPaths.pc197000} fill="var(--fill-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function ReportsIcon() {
  return (
    <div className="absolute left-[41px] size-[24px] top-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p356e1260} fill="var(--fill-0, black)" />
          <path d={svgPaths.p3e9aa000} fill="var(--fill-0, black)" />
          <path d={svgPaths.p2792600} fill="var(--fill-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function SettingsIcon() {
  return (
    <div className="absolute left-[41px] size-[24px] top-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p129b0300} fill="var(--fill-0, black)" />
          <path d={svgPaths.p1e23dbf2} fill="var(--fill-0, black)" />
          <path d={svgPaths.p3ff4ae00} fill="var(--fill-0, black)" />
          <path d={svgPaths.p384e0b80} fill="var(--fill-0, black)" />
          <path d={svgPaths.p2ac1da80} fill="var(--fill-0, black)" />
          <path d={svgPaths.pc197000} fill="var(--fill-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function ProfileIcon() {
  return (
    <div className="absolute left-[41px] size-[24px] top-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p356e1260} fill="var(--fill-0, black)" />
          <path d={svgPaths.p3e9aa000} fill="var(--fill-0, black)" />
          <path d={svgPaths.p2792600} fill="var(--fill-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function LogoutIcon() {
  return (
    <div className="absolute left-[41px] size-[24px] top-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p14e7100} fill="var(--fill-0, black)" />
          <path d={svgPaths.p2dcc1f70} fill="var(--fill-0, black)" />
        </g>
      </svg>
    </div>
  );
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', top: '158px' },
    { id: 'attendance', label: 'Attendance', top: '226px' },
    { id: 'member', label: 'Member', top: '294px' },
    { id: 'reservation', label: 'Reservation', top: '362px' },
    { id: 'reports', label: 'Reports', top: '430px' },
    { id: 'settings', label: 'Settings', top: '492px' },
    { id: 'profile', label: 'My Profile', top: '560px' },
  ];

  return (
    <div className="absolute bg-white h-[1080px] left-0 overflow-clip top-0 w-[222px]">
      {/* Logo Section */}
      <div className="absolute contents left-[51px] top-[6px]">
        <p className="absolute font-['Passion_One:Bold',sans-serif] h-[50px] leading-[1.4] left-[51px] not-italic text-[#151619] text-[24px] top-[88px] w-[125px]">
          LAMPKONEK
        </p>
        <div className="absolute h-[94px] left-[66px] top-[6px] w-[93px]">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
            src={img4652293918745592847665684231656082395705280NRemovebgPreview1}
          />
        </div>
      </div>

      {/* Menu Items */}
      {menuItems.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`absolute h-[48px] left-0 overflow-clip w-[222px] ${
              isActive ? 'bg-[#6d8aff]' : 'bg-white hover:bg-gray-50'
            }`}
            style={{ top: item.top }}
          >
            <p
              className={`absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] left-[85px] text-[16px] text-nowrap top-[12px] whitespace-pre ${
                isActive ? 'text-white' : 'text-black'
              }`}
            >
              {item.label}
            </p>
            {item.id === 'dashboard' && <DashboardIcon />}
            {item.id === 'attendance' && (
              <div className="absolute left-[40px] size-[24px] top-[12px]">
                <img
                  alt=""
                  className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                  src={imgImage25}
                />
              </div>
            )}
            {item.id === 'member' && <MemberIcon />}
            {item.id === 'reservation' && <ReservationIcon />}
            {item.id === 'reports' && <ReportsIcon />}
            {item.id === 'settings' && <SettingsIcon />}
            {item.id === 'profile' && <ProfileIcon />}
          </button>
        );
      })}

      {/* Log Out Button */}
      <button
        onClick={() => alert('Logging out...')}
        className="absolute bg-white hover:bg-gray-50 h-[48px] left-0 overflow-clip top-[931px] w-[222px]"
      >
        <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] left-[85px] text-[16px] text-black text-nowrap top-[12px] whitespace-pre">
          Log Out
        </p>
        <LogoutIcon />
      </button>
    </div>
  );
}
