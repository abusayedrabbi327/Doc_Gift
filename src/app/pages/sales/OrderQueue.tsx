import { useState } from 'react';
import { DashboardLayout, salesNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Package, Calendar, CreditCard, CheckCircle, Eye, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Navigate } from 'react-router';
import { Order } from '../../context/AppContext';

export default function OrderQueue() {
  const navigate = useNavigate();
  const { currentUser, orders, updateOrderStatus } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'delivered'>('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  if (!currentUser || currentUser.role !== 'sales') {
    return <Navigate to="/login" replace />;
  }

  const rep = currentUser.data;
  const myOrders = orders.filter(o => o.salesRepId === rep.id);
  const filteredOrders = filter === 'all' ? myOrders : myOrders.filter(o => o.status === filter);

  const stats = [
    { label: 'Pending', value: myOrders.filter(o => o.status === 'pending').length, color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { label: 'Processing', value: myOrders.filter(o => o.status === 'processing').length, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Delivered', value: myOrders.filter(o => o.status === 'delivered').length, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
  ];

  const totalCredits = myOrders.reduce((sum, o) => sum + o.totalCredits, 0);

  return (
    <DashboardLayout navItems={salesNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl mb-1">Order Queue</h1>
          <p className="text-muted-foreground text-sm">Manage and track orders from your doctors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card hover>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
              <p className="text-2xl text-[#1E3A8A] tabular-nums">{myOrders.length}</p>
            </CardContent>
          </Card>
          {stats.map((stat, i) => (
            <Card key={i} hover className="cursor-pointer" onClick={() => setFilter(['all', 'pending', 'processing', 'delivered'][i + 1] as any)}>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl tabular-nums ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { value: 'all', label: `All (${myOrders.length})` },
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'delivered', label: 'Delivered' },
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

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="text-muted-foreground">No {filter === 'all' ? '' : filter} orders found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <Card key={order.id} hover>
                <CardContent className="pt-4 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Order info */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-[#1E3A8A]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm">{order.id}</p>
                          <Badge variant={order.status as any}>{order.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{order.doctorName}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground flex-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{order.date}</span>
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" />{order.items.length} items</span>
                      <span className="flex items-center gap-1 text-[#14B8A6]"><CreditCard className="w-3 h-3" />{order.totalCredits} credits</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setViewOrder(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-[#f1f5f9] text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs transition-colors"
                        >
                          Accept
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 text-xs transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3>{viewOrder.id}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{viewOrder.date}</p>
                </div>
                <button onClick={() => setViewOrder(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#f8fafc] rounded-xl">
                    <p className="text-xs text-muted-foreground mb-0.5">Doctor</p>
                    <p className="text-sm">{viewOrder.doctorName}</p>
                  </div>
                  <div className="p-3 bg-[#f8fafc] rounded-xl">
                    <p className="text-xs text-muted-foreground mb-0.5">Status</p>
                    <Badge variant={viewOrder.status as any}>{viewOrder.status}</Badge>
                  </div>
                  <div className="p-3 bg-[#f8fafc] rounded-xl col-span-2">
                    <p className="text-xs text-muted-foreground mb-0.5">Delivery Address</p>
                    <p className="text-sm">{viewOrder.address}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm mb-2">Order Items</p>
                  <div className="space-y-2">
                    {viewOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl">
                        <div>
                          <p className="text-sm">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-[#14B8A6] text-sm">{item.credits * item.quantity} cr</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between p-3 bg-[#1E3A8A]/5 rounded-xl">
                  <span className="text-sm">Total Credits</span>
                  <span className="text-[#14B8A6]">{viewOrder.totalCredits} credits</span>
                </div>

                <div className="flex gap-3">
                  {viewOrder.status === 'pending' && (
                    <Button variant="primary" className="flex-1 text-sm" onClick={() => { updateOrderStatus(viewOrder.id, 'processing'); setViewOrder(null); }}>
                      Accept Order
                    </Button>
                  )}
                  {viewOrder.status === 'processing' && (
                    <Button variant="primary" className="flex-1 gap-2 text-sm" onClick={() => { updateOrderStatus(viewOrder.id, 'delivered'); setViewOrder(null); }}>
                      <CheckCircle className="w-4 h-4" />
                      Mark Delivered
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setViewOrder(null)}>Close</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}