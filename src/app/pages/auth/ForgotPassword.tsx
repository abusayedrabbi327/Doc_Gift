import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Heart, ArrowLeft, Mail, AlertCircle, CheckCircle, IdCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { salesReps } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = 'admin@giftexchange.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const emailLower = email.trim().toLowerCase();
      const isSalesRep = salesReps.some(s => s.email.toLowerCase() === emailLower);
      const isAdmin = emailLower === ADMIN_EMAIL;

      if (!isSalesRep && !isAdmin) {
        setError('No account found with this email address. If you are a doctor, please contact your administrator to reset your password.');
        setLoading(false);
        return;
      }
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#14B8A6] flex items-center justify-center p-4 md:p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-white text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-2xl tracking-tight">Gift Exchange</span>
          </div>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <h2 className="text-2xl mb-1">Reset Password</h2>
            <p className="text-muted-foreground text-sm">
              {submitted
                ? 'Instructions sent successfully'
                : 'Password reset is available for Sales Reps and Admins'}
            </p>
          </CardHeader>
          <CardContent>
            {/* Doctor info callout */}
            {!submitted && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl mb-5">
                <IdCard className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Are you a Doctor?</strong> Doctors cannot reset passwords via this page. Please contact your Sales Representative or Administrator to get your password reset.
                  </p>
                </div>
              </div>
            )}

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="your@email.com"
                      className="w-full pl-11 pr-4 py-3 bg-[var(--color-input-background,#f8fafc)] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-[#1E3A8A] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </form>
            ) : (
              <div className="space-y-5 text-center">
                <div className="w-16 h-16 bg-[#22C55E]/15 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-9 h-9 text-[#22C55E]" />
                </div>
                <div>
                  <h3 className="mb-2">Check Your Email</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We've sent password reset instructions to <strong>{email}</strong>. Please check your inbox.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 px-6 bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white rounded-xl transition-all"
                >
                  Return to Login
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
