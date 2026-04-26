import { useNavigate, Navigate } from 'react-router';
import { DashboardLayout, doctorNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { CreditCard, Package, Clock, CheckCircle, ShoppingBag, TrendingUp, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { currentUser, orders, cart } = useApp();

  if (!currentUser || currentUser.role !== 'doctor') {
    return <Navigate to="/login" replace />;
  }

  const doctor = currentUser.data;
  const doctorOrders = orders.filter(o => o.doctorId === doctor.id);
  const pendingOrders = doctorOrders.filter(o => o.status === 'pending');
  const deliveredOrders = doctorOrders.filter(o => o.status === 'delivered');
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const recentOrders = doctorOrders.slice(0, 4);

  const stats = [
    {
      label: 'Available Credits',
      value: doctor.credits.toLocaleString(),
      icon: CreditCard,
      gradient: true,
    },
    {
      label: 'Total Orders',
      value: doctorOrders.length.toString(),
      icon: Package,
      color: 'text-[#1E3A8A]',
      bg: 'bg-[#1E3A8A]/10',
    },
    {
      label: 'Pending',
      value: pendingOrders.length.toString(),
      icon: Clock,
      color: 'text-yellow-700',
      bg: 'bg-yellow-100',
    },
    {
      label: 'Delivered',
      value: deliveredOrders.length.toString(),
      icon: CheckCircle,
      color: 'text-[#22C55E]',
      bg: 'bg-[#22C55E]/10',
    },
  ];

  return (
    <DashboardLayout navItems={doctorNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-1">Welcome, {doctor.name.split(' ').slice(0, 2).join(' ')}</h1>
            <p className="text-muted-foreground text-sm">{doctor.specialty} • {doctor.hospital}</p>
          </div>
          <Button variant="primary" className="gap-2 w-fit" onClick={() => navigate('/doctor/products')}>
            <ShoppingBag className="w-4 h-4" />
            Browse Gifts
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            if (stat.gradient) {
              return (
                <Card key={i} className="bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] text-white border-0 col-span-2 lg:col-span-1">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-white/80 text-xs">{stat.label}</p>
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl text-white tabular-nums">{stat.value}</p>
                    <p className="text-white/60 text-xs mt-1">credits</p>
                  </CardContent>
                </Card>
              );
            }
            return (
              <Card key={i} hover>
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-muted-foreground text-xs">{stat.label}</p>
                    <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className={`text-3xl tabular-nums ${stat.color}`}>{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3>Recent Orders</h3>
                  <Button variant="outline" size="sm" onClick={() => navigate('/doctor/orders')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-10">
                    <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                    <p className="text-muted-foreground text-sm">No orders yet</p>
                    <Button variant="primary" size="sm" className="mt-3" onClick={() => navigate('/doctor/products')}>
                      Browse Gifts
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl hover:bg-[#f1f5f9] transition-colors cursor-pointer border border-border/50"
                        onClick={() => navigate('/doctor/orders')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-[#1E3A8A]" />
                          </div>
                          <div>
                            <p className="text-sm">{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.status as any}>{order.status}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{order.totalCredits} cr</p>
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
                  <Button variant="primary" className="w-full justify-start gap-2 text-sm" onClick={() => navigate('/doctor/products')}>
                    <ShoppingBag className="w-4 h-4" />
                    Browse Gifts
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={() => navigate('/doctor/cart')}>
                    <ShoppingCart className="w-4 h-4" />
                    My Cart {cartCount > 0 && <span className="ml-auto bg-[#22C55E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={() => navigate('/doctor/orders')}>
                    <Package className="w-4 h-4" />
                    My Orders
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Credit Info */}
            <Card>
              <CardHeader><h3>Credit Summary</h3></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Total Earned</span>
                    <span className="text-[#22C55E]">{doctor.totalCreditsEarned.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Used</span>
                    <span>{doctor.totalCreditsUsed.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Available</span>
                    <span className="text-[#14B8A6] text-lg">{doctor.credits.toLocaleString()}</span>
                  </div>
                  {/* Progress bar */}
                  {doctor.totalCreditsEarned > 0 && (
                    <div className="pt-1">
                      <div className="w-full bg-[#f1f5f9] rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-[#1E3A8A] to-[#14B8A6] h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (doctor.credits / doctor.totalCreditsEarned) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((doctor.credits / doctor.totalCreditsEarned) * 100)}% remaining
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}