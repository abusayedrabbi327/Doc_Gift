import { useState } from 'react';
import { DashboardLayout, salesNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Users, CreditCard, Package, Clock, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router';
import { useApp } from '../../context/AppContext';

export default function SalesRepDashboard() {
  const navigate = useNavigate();
  const { currentUser, doctors, orders, creditRequests, addCreditRequest } = useApp();
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser || currentUser.role !== 'sales') {
    return <Navigate to="/login" replace />;
  }

  const rep = currentUser.data;
  const myDoctors = doctors.filter(d => rep.doctorIds.includes(d.id));
  const myOrders = orders.filter(o => o.salesRepId === rep.id);
  const pendingOrders = myOrders.filter(o => o.status === 'pending');
  const myCreditRequests = creditRequests.filter(r => r.salesRepId === rep.id);
  const pendingRequests = myCreditRequests.filter(r => r.status === 'pending');

  const handleCreditRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(creditAmount);
    if (!amount || amount <= 0 || !creditReason.trim()) return;
    addCreditRequest(rep.id, rep.name, amount, creditReason.trim());
    setSubmitted(true);
    setTimeout(() => {
      setShowCreditModal(false);
      setSubmitted(false);
      setCreditAmount('');
      setCreditReason('');
    }, 2000);
  };

  const recentOrders = myOrders.slice(0, 5);

  return (
    <DashboardLayout navItems={salesNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-1">Sales Dashboard</h1>
            <p className="text-muted-foreground text-sm">{rep.territory} • {rep.name}</p>
          </div>
          <Button variant="primary" className="gap-2 w-fit" onClick={() => setShowCreditModal(true)}>
            <CreditCard className="w-4 h-4" />
            Request Credits
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { label: 'My Doctors', value: myDoctors.length, icon: Users, color: 'text-[#1E3A8A]', bg: 'bg-[#1E3A8A]/10' },
            { label: 'Available Credits', value: rep.credits.toLocaleString(), icon: CreditCard, color: 'text-[#14B8A6]', bg: 'bg-[#14B8A6]/10' },
            { label: 'Pending Orders', value: pendingOrders.length, icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-100' },
            { label: 'Total Orders', value: myOrders.length, icon: Package, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} hover>
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className={`text-2xl tabular-nums ${stat.color}`}>{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3>Recent Orders</h3>
                  <Button variant="outline" size="sm" onClick={() => navigate('/sales/orders')}>View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl border border-border/40">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-[#1E3A8A] text-xs">{order.doctorName.split(' ')[1]?.charAt(0) || 'D'}</span>
                          </div>
                          <div>
                            <p className="text-sm">{order.doctorName}</p>
                            <p className="text-xs text-muted-foreground">{order.id} • {order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.status as any}>{order.status}</Badge>
                          <p className="text-xs text-[#14B8A6] mt-1">{order.totalCredits} credits</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader><h3>Quick Actions</h3></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="primary" className="w-full justify-start gap-2 text-sm" onClick={() => navigate('/sales/doctors')}>
                    <Users className="w-4 h-4" />
                    Manage Doctors
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={() => navigate('/sales/orders')}>
                    <Package className="w-4 h-4" />
                    Order Queue {pendingOrders.length > 0 && <span className="ml-auto bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingOrders.length}</span>}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={() => setShowCreditModal(true)}>
                    <CreditCard className="w-4 h-4" />
                    Request Credits
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Credit Status */}
            <Card>
              <CardHeader><h3>Credit Balance</h3></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-[#1E3A8A]/10 to-[#14B8A6]/10 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Available to Assign</p>
                    <p className="text-2xl text-[#1E3A8A]">{rep.credits.toLocaleString()}</p>
                  </div>
                  {pendingRequests.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                      <Clock className="w-3 h-3" />
                      {pendingRequests.length} credit request{pendingRequests.length > 1 ? 's' : ''} pending approval
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* My Doctors Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3>My Doctors</h3>
                  <Button variant="outline" size="sm" onClick={() => navigate('/sales/doctors')}>View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {myDoctors.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f8fafc]">
                      <div className="w-8 h-8 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#1E3A8A] text-xs">{doc.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.credits} cr</p>
                      </div>
                    </div>
                  ))}
                  {myDoctors.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No doctors assigned yet</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Credit Request Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3>Request Credits from Admin</h3>
                  <p className="text-xs text-muted-foreground mt-1">Submit a credit request for admin approval</p>
                </div>
                <button onClick={() => { setShowCreditModal(false); setSubmitted(false); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto mb-3" />
                  <h3 className="mb-1">Request Submitted!</h3>
                  <p className="text-sm text-muted-foreground">Admin will review your request shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleCreditRequest} className="space-y-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Credit Amount Requested *</label>
                    <input
                      type="number"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      placeholder="e.g. 5000"
                      min={100}
                      className="w-full px-4 py-3 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Reason / Justification *</label>
                    <textarea
                      value={creditReason}
                      onChange={(e) => setCreditReason(e.target.value)}
                      placeholder="Explain why you need additional credits..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm resize-none"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" variant="primary" className="flex-1">Submit Request</Button>
                    <Button type="button" variant="outline" onClick={() => setShowCreditModal(false)}>Cancel</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}