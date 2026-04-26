import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router';
import { DashboardLayout, salesNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  ArrowLeft, MapPin, Building2, Phone, Mail, Award, Calendar,
  CreditCard, Package, TrendingUp, X, Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DoctorProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors, orders, currentUser, assignCreditsToDoctor } = useApp();
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');

  if (!currentUser || currentUser.role !== 'sales') {
    return <Navigate to="/login" replace />;
  }

  const rep = currentUser.data;
  const doctor = doctors.find(d => d.id === id);

  if (!doctor) {
    return (
      <DashboardLayout navItems={salesNavItems}>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Doctor not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/sales/doctors')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const doctorOrders = orders.filter(o => o.doctorId === doctor.id);
  const recentOrders = doctorOrders.slice(0, 4);

  const handleAssignCredits = () => {
    const amount = parseInt(creditAmount);
    if (!amount || amount <= 0 || amount > rep.credits) return;
    assignCreditsToDoctor(doctor.id, amount);
    setShowCreditModal(false);
    setCreditAmount('');
  };

  return (
    <DashboardLayout navItems={salesNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <button
          onClick={() => navigate('/sales/doctors')}
          className="flex items-center gap-2 text-muted-foreground hover:text-[#1E3A8A] mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doctor Management
        </button>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-1">Doctor Profile</h1>
            <p className="text-muted-foreground text-sm">Complete profile and activity overview</p>
          </div>
          <Button variant="primary" className="gap-2 w-fit" onClick={() => setShowCreditModal(true)}>
            <Plus className="w-4 h-4" />
            Assign Credits
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">{doctor.name.charAt(0)}</span>
                  </div>
                  <h2 className="mb-0.5 text-base">{doctor.name}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{doctor.specialty}</p>
                  <Badge variant={doctor.status === 'active' ? 'approved' : 'pending'}>{doctor.status}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><h3 className="text-sm">Credit Information</h3></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-[#14B8A6]/10 to-[#22C55E]/10 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Available Credits</p>
                    <p className="text-2xl text-[#14B8A6]">{doctor.credits.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Earned</span>
                      <span className="text-[#22C55E]">{doctor.totalCreditsEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Used</span>
                      <span>{doctor.totalCreditsUsed.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="primary" className="w-full gap-2 text-sm" onClick={() => setShowCreditModal(true)}>
                    <Plus className="w-4 h-4" />
                    Assign Credits
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><h3 className="text-sm">Activity Stats</h3></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { icon: Package, label: 'Total Orders', value: doctorOrders.length, color: 'text-[#1E3A8A]', bg: 'bg-[#1E3A8A]/10' },
                    { icon: TrendingUp, label: 'Member Since', value: doctor.memberSince, color: 'text-[#14B8A6]', bg: 'bg-[#14B8A6]/10' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${item.color}`} />
                          </div>
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <span className={`text-sm ${item.color}`}>{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact */}
            <Card>
              <CardHeader><h3 className="text-sm">Contact Information</h3></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Mail, label: 'Email', value: doctor.email },
                    { icon: Phone, label: 'Phone', value: doctor.phone },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label}>
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <Icon className="w-3 h-3" /> {label}
                      </label>
                      <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Professional */}
            <Card>
              <CardHeader><h3 className="text-sm flex items-center gap-2"><Award className="w-4 h-4 text-[#1E3A8A]" /> Professional Information</h3></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Specialty', value: doctor.specialty },
                    { label: 'License', value: doctor.licenseNumber },
                    { label: 'Experience', value: `${doctor.yearsOfExperience} years` },
                    { label: 'Company ID', value: doctor.companyId },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
                      <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hospital */}
            <Card>
              <CardHeader><h3 className="text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-[#1E3A8A]" /> Hospital & Location</h3></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Hospital</label>
                    <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm">{doctor.hospital}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Address</label>
                    <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm">{doctor.hospitalAddress}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ l: 'City', v: doctor.city }, { l: 'State', v: doctor.state }, { l: 'ZIP', v: doctor.zipCode }].map(({ l, v }) => (
                      <div key={l}>
                        <label className="block text-xs text-muted-foreground mb-1.5">{l}</label>
                        <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { l: 'Working Days', v: doctor.workingDays },
                      { l: 'Working Hours', v: doctor.workingHours },
                    ].map(({ l, v }) => (
                      <div key={l}>
                        <label className="block text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> {l}</label>
                        <p className="px-4 py-3 bg-[#f8fafc] rounded-xl text-sm">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm">Recent Orders</h3>
                  <span className="text-xs text-muted-foreground">{doctorOrders.length} total</span>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl">
                        <div>
                          <p className="text-sm">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.date} • {order.items.length} items</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#14B8A6] text-sm">{order.totalCredits} cr</p>
                          <Badge variant={order.status as any}>{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Credit Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Assign Credits to {doctor.name}</h3>
                <button onClick={() => setShowCreditModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-[#f8fafc] rounded-xl flex justify-between text-sm">
                  <span className="text-muted-foreground">Doctor's balance</span>
                  <span className="text-[#14B8A6]">{doctor.credits.toLocaleString()} cr</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl flex justify-between text-sm">
                  <span className="text-muted-foreground">Your balance</span>
                  <span className="text-[#1E3A8A]">{rep.credits.toLocaleString()} cr</span>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Credits to Assign *</label>
                  <input
                    type="number"
                    value={creditAmount}
                    onChange={e => setCreditAmount(e.target.value)}
                    placeholder="Enter amount"
                    min={1}
                    max={rep.credits}
                    className="w-full px-4 py-3 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm"
                  />
                  {parseInt(creditAmount) > rep.credits && (
                    <p className="text-red-500 text-xs mt-1">Exceeds your available credits</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1" onClick={handleAssignCredits} disabled={!creditAmount || parseInt(creditAmount) <= 0 || parseInt(creditAmount) > rep.credits}>
                    Assign Credits
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreditModal(false)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}