import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { DashboardLayout, doctorNavItems } from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Package, Calendar, CreditCard, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useApp } from '../../context/AppContext';

export default function Orders() {
  const navigate = useNavigate();
  const { currentUser, orders } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'delivered' | 'cancelled'>('all');

  if (!currentUser || currentUser.role !== 'doctor') {
    return <Navigate to="/login" replace />;
  }

  const doctor = currentUser.data;
  const doctorOrders = orders.filter(o => o.doctorId === doctor.id);
  const filteredOrders = filter === 'all' ? doctorOrders : doctorOrders.filter(o => o.status === filter);

  const stats = [
    { label: 'Total', value: doctorOrders.length, color: 'text-foreground', bg: 'bg-[#f1f5f9]' },
    { label: 'Pending', value: doctorOrders.filter(o => o.status === 'pending').length, color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { label: 'Processing', value: doctorOrders.filter(o => o.status === 'processing').length, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Delivered', value: doctorOrders.filter(o => o.status === 'delivered').length, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
  ];

  return (
    <DashboardLayout navItems={doctorNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-1">My Orders</h1>
            <p className="text-muted-foreground text-sm">Track all your gift redemptions</p>
          </div>
          <Button variant="primary" size="sm" className="gap-2 w-fit" onClick={() => navigate('/doctor/products')}>
            <ShoppingBag className="w-4 h-4" />
            Shop More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, i) => (
            <Card key={i} hover className="cursor-pointer" onClick={() => setFilter(i === 0 ? 'all' : ['all', 'pending', 'processing', 'delivered'][i] as any)}>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl tabular-nums ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { value: 'all', label: 'All Orders' },
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as any)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                filter === item.value
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-white text-foreground hover:bg-[#f1f5f9] border border-border'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-16">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="mb-2">No orders found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders found.`}
              </p>
              {filter === 'all' && (
                <Button variant="primary" size="sm" onClick={() => navigate('/doctor/products')}>
                  Browse Gifts
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} hover>
                <CardContent className="pt-4 pb-4">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm">{order.id}</h3>
                        <Badge variant={order.status as any}>{order.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {order.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {order.totalCredits} credits
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 bg-[#f8fafc] rounded-xl">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#f1f5f9]">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {item.credits} cr</p>
                        </div>
                        <p className="text-[#14B8A6] text-sm flex-shrink-0">{item.credits * item.quantity} cr</p>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Delivery: {order.address}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}