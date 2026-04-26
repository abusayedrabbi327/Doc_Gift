import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Heart, Eye, EyeOff, IdCard, Mail, Lock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-detect if input looks like a company ID
  const isCompanyId = identifier.trim().toUpperCase().startsWith('DOC-');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(identifier, password);
      if (result.success) {
        if (result.role === 'doctor') navigate('/doctor');
        else if (result.role === 'sales') navigate('/sales');
        else navigate('/admin');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#14B8A6] flex items-center justify-center p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-5xl w-full items-center">
        {/* Left Side — Branding */}
        <div className="text-white flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-2xl tracking-tight">Gift Exchange</span>
          </div>
          <h1 className="text-3xl md:text-4xl mb-5 leading-tight">
            Welcome Back to Your<br />Gift Exchange Platform
          </h1>
          <p className="text-lg text-white/75 leading-relaxed mb-8">
            Access your dashboard, manage credits, browse gifts, and track orders all in one place.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
              <IdCard className="w-5 h-5 text-[#14B8A6]" />
              <div>
                <p className="text-sm text-white/90">Doctors</p>
                <p className="text-xs text-white/60">Login with your Company ID (e.g. DOC-12345)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
              <Mail className="w-5 h-5 text-[#22C55E]" />
              <div>
                <p className="text-sm text-white/90">Sales Reps & Admin</p>
                <p className="text-xs text-white/60">Login with your email address</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Login Form */}
        <Card className="shadow-2xl">
          <CardHeader className="pb-2">
            <h2 className="text-2xl md:text-3xl mb-1">Sign In</h2>
            <p className="text-muted-foreground text-sm">Enter your credentials to access your account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Identifier Input */}
              <div>
                <label className="block text-sm mb-2 text-foreground">
                  {isCompanyId ? 'Company ID' : 'Company ID or Email'}
                </label>
                <div className="relative">
                  {isCompanyId
                    ? <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    : <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  }
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                    placeholder={isCompanyId ? 'DOC-12345' : 'DOC-12345 or your@email.com'}
                    className="w-full pl-11 pr-4 py-3 bg-[var(--color-input-background,#f8fafc)] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all"
                    required
                    autoComplete="username"
                  />
                </div>
                {isCompanyId && (
                  <p className="text-xs text-[#14B8A6] mt-1.5 flex items-center gap-1">
                    <IdCard className="w-3 h-3" /> Doctor login detected
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-2 text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3 bg-[var(--color-input-background,#f8fafc)] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Forgot Password (sales & admin only) */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {isCompanyId ? 'Contact your admin to reset password' : ''}
                </span>
                {!isCompanyId && (
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-[#1E3A8A] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing In...</>
                ) : 'Sign In'}
              </button>

              {/* Info note */}
              <p className="text-center text-xs text-muted-foreground pt-1">
                Don't have an account?{' '}
                <span className="text-[#14B8A6]">Contact your administrator to get access.</span>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
