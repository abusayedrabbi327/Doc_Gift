import { useState } from 'react';
import { DashboardLayout, salesNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  User, Mail, Phone, MapPin, CreditCard, Package, Clock,
  Eye, EyeOff, Lock, CheckCircle, TrendingUp, Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Navigate } from 'react-router';

export default function SalesProfile() {
  const navigate = useNavigate();
  const { currentUser, doctors, orders, creditRequests } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'requests'>('profile');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  if (!currentUser || currentUser.role !== 'sales') {
    return <Navigate to="/login" replace />;
  }

  const rep = currentUser.data;
  const myDoctors = doctors.filter(d => rep.doctorIds.includes(d.id));
  const myOrders = orders.filter(o => o.salesRepId === rep.id);
  const myCreditRequests = creditRequests.filter(r => r.salesRepId === rep.id);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (currentPw !== rep.password) { setPwError('Current password is incorrect.'); return; }
    if (newPw.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    setPwSuccess(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSuccess(false), 4000);
  };

  const inputClass = "w-full px-4 py-3 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm";

  return (
    <DashboardLayout navItems={salesNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl mb-1">My Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your account information and settings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#f1f5f9] p-1 rounded-xl w-fit">
          {[
            { key: 'profile', label: 'Profile' },
            { key: 'requests', label: `Requests (${myCreditRequests.length})` },
            { key: 'security', label: 'Security' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === tab.key ? 'bg-white shadow-sm text-[#1E3A8A]' : 'text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-white">{rep.name.charAt(0)}</span>
                    </div>
                    <h2 className="text-base mb-0.5">{rep.name}</h2>
                    <p className="text-sm text-muted-foreground mb-2">Sales Representative</p>
                    <Badge variant="approved">Active</Badge>
                    <div className="mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{rep.territory}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><h3 className="text-sm">Performance Stats</h3></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Total Doctors', value: myDoctors.length, color: 'text-[#1E3A8A]', icon: User },
                      { label: 'Total Orders', value: myOrders.length, color: 'text-[#14B8A6]', icon: Package },
                      { label: 'Pending Orders', value: myOrders.filter(o => o.status === 'pending').length, color: 'text-yellow-700', icon: Clock },
                      { label: 'Delivered', value: myOrders.filter(o => o.status === 'delivered').length, color: 'text-[#22C55E]', icon: TrendingUp },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-[#f8fafc] rounded-xl">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon className="w-3.5 h-3.5" />
                            {stat.label}
                          </div>
                          <span className={`text-sm ${stat.color}`}>{stat.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-5">
              <Card>
                <CardHeader><h3 className="text-sm flex items-center gap-2"><User className="w-4 h-4 text-[#1E3A8A]" /> Personal Information</h3></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', value: rep.name, icon: User },
                      { label: 'Email Address', value: rep.email, icon: Mail },
                      { label: 'Phone', value: rep.phone, icon: Phone },
                      { label: 'Territory', value: rep.territory, icon: MapPin },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label}>
                        <label className="block text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                          <Icon className="w-3 h-3" /> {label}
                        </label>
                        <div className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><h3 className="text-sm flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#14B8A6]" /> Credit Information</h3></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-[#1E3A8A]/10 to-[#14B8A6]/10 rounded-xl md:col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Available Credits to Assign</p>
                      <p className="text-3xl text-[#1E3A8A]">{rep.credits.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Rep ID</label>
                      <div className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm">{rep.id}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Join Date</label>
                      <div className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm">{rep.joinDate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="max-w-2xl space-y-4">
            <h3 className="text-sm text-muted-foreground">Your credit requests to Admin</h3>
            {myCreditRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground text-sm">No credit requests submitted yet</p>
                </CardContent>
              </Card>
            ) : (
              myCreditRequests.map((req) => (
                <Card key={req.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm">{req.id}</p>
                          <Badge variant={req.status === 'approved' ? 'approved' : req.status === 'rejected' ? 'rejected' : 'processing'}>
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" /> {req.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-[#14B8A6]">{req.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">credits requested</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground bg-[#f8fafc] px-3 py-2 rounded-lg">{req.reason}</p>
                    {req.adminNote && (
                      <p className="text-xs text-[#1E3A8A] mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Admin note: {req.adminNote}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-md">
            <Card>
              <CardHeader>
                <h3 className="text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#1E3A8A]" /> Change Password
                </h3>
              </CardHeader>
              <CardContent>
                {pwSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl text-[#22C55E] text-sm mb-4">
                    <CheckCircle className="w-4 h-4" />
                    Password updated successfully!
                  </div>
                )}
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Current Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)} className={`${inputClass} pr-10`} placeholder="Current password" required />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">New Password</label>
                    <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className={inputClass} placeholder="Min. 6 characters" required minLength={6} />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Confirm New Password</label>
                    <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={inputClass} placeholder="Repeat new password" required />
                  </div>
                  {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
                  <Button type="submit" variant="primary" className="w-full gap-2">
                    <Lock className="w-4 h-4" />
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}