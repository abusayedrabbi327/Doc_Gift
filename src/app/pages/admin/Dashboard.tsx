import { useNavigate, Navigate } from 'react-router';
import { DashboardLayout, adminNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Users, ShoppingBag, Package, TrendingUp, ArrowUp, Bell, CreditCard, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser, doctors, salesReps, products, orders, creditRequests, doctorAddRequests } = useApp();

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const totalCreditsInCirculation = doctors.reduce((sum, d) => sum + d.totalCreditsEarned, 0);
  const pendingCreditRequests = creditRequests.filter(r => r.status === 'pending');
  const pendingDoctorRequests = doctorAddRequests.filter(r => r.status === 'pending');
  const totalPendingRequests = pendingCreditRequests.length + pendingDoctorRequests.length;
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: 'Total Users',
      value: (doctors.length + salesReps.length).toString(),
      change: `${doctors.length} doctors`,
      icon: Users,
      color: 'bg-[#1E3A8A]',
    },
    {
      label: 'Products',
      value: products.length.toString(),
      change: `${products.filter(p => p.stock > 0).length} in stock`,
      icon: ShoppingBag,
      color: 'bg-[#14B8A6]',
    },
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      change: `${orders.filter(o => o.status === 'pending').length} pending`,
      icon: Package,
      color: 'bg-[#22C55E]',
    },
    {
      label: 'Credits Issued',
      value: totalCreditsInCirculation.toLocaleString(),
      change: `${salesReps.reduce((s, r) => s + r.credits, 0).toLocaleString()} available`,
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Full system overview and control</p>
          </div>
          {totalPendingRequests > 0 && (
            <Button variant="primary" className="gap-2 w-fit relative" onClick={() => navigate('/admin/requests')}>
              <Bell className="w-4 h-4" />
              {totalPendingRequests} Pending Request{totalPendingRequests > 1 ? 's' : ''}
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {totalPendingRequests}
              </span>
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} hover>
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <ArrowUp className="w-3.5 h-3.5 text-[#22C55E]" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pending Alerts */}
        {totalPendingRequests > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm text-yellow-900">
                  {pendingCreditRequests.length > 0 && `${pendingCreditRequests.length} credit request${pendingCreditRequests.length > 1 ? 's' : ''}`}
                  {pendingCreditRequests.length > 0 && pendingDoctorRequests.length > 0 && ' and '}
                  {pendingDoctorRequests.length > 0 && `${pendingDoctorRequests.length} doctor add request${pendingDoctorRequests.length > 1 ? 's' : ''}`}
                  {' '}awaiting your approval
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/requests')}>
              Review
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3>Recent Orders</h3>
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>View All</Button>
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
                          <div className="w-8 h-8 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center">
                            <Package className="w-3.5 h-3.5 text-[#1E3A8A]" />
                          </div>
                          <div>
                            <p className="text-xs">{order.id} — {order.doctorName}</p>
                            <p className="text-xs text-muted-foreground">{order.salesRepName} • {order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.status as any}>{order.status}</Badge>
                          <p className="text-xs text-[#14B8A6] mt-1">{order.totalCredits} cr</p>
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
            {/* Quick Nav */}
            <Card>
              <CardHeader><h3>Quick Navigation</h3></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { label: 'User Management', path: '/admin/users', icon: Users, color: 'text-[#1E3A8A]', bg: 'bg-[#1E3A8A]/10' },
                    { label: 'Product Management', path: '/admin/products', icon: ShoppingBag, color: 'text-[#14B8A6]', bg: 'bg-[#14B8A6]/10' },
                    { label: 'Order Monitoring', path: '/admin/orders', icon: Package, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                    { label: 'Credit Requests', path: '/admin/requests', icon: CreditCard, color: 'text-yellow-700', bg: 'bg-yellow-100', badge: totalPendingRequests },
                  ].map(({ label, path, icon: Icon, color, bg, badge }) => (
                    <button
                      key={path}
                      onClick={() => navigate(path)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f1f5f9] transition-colors text-left group"
                    >
                      <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <span className="text-sm flex-1">{label}</span>
                      {badge && badge > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{badge}</span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Overview */}
            <Card>
              <CardHeader><h3>System Overview</h3></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Doctors</span>
                    <span>{doctors.filter(d => d.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Sales Reps</span>
                    <span>{salesReps.filter(s => s.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivered Orders</span>
                    <span className="text-[#22C55E]">{orders.filter(o => o.status === 'delivered').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Products</span>
                    <span>{products.length}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending Requests</span>
                    <span className={totalPendingRequests > 0 ? 'text-yellow-700' : 'text-[#22C55E]'}>
                      {totalPendingRequests}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}