import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SignInProps {
  onSignIn: (email: string, password: string) => void;
  onSwitchToSignUp: () => void;
}

export function SignIn({ onSignIn, onSwitchToSignUp }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#6d8aff] to-[#5a75e6] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6d8aff] rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="font-['Montserrat:Bold',sans-serif] text-[28px] text-[#151619]">LampKonek</h1>
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d] mt-2">
            Church Management System
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block font-['Poppins:Medium',sans-serif] text-[14px] text-[#151619] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins:Regular',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6d8aff] focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#6d8aff] border-gray-300 rounded focus:ring-[#6d8aff]"
              />
              <span className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d]">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6d8aff] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#6d8aff] text-white rounded-lg font-['Poppins:SemiBold',sans-serif] text-[16px] hover:bg-[#5a75e6] transition-colors"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#6c757d]">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#6c757d]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-[#6d8aff] hover:underline font-['Poppins:SemiBold',sans-serif]"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
