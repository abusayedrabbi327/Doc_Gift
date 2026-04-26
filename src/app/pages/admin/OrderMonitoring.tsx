import { useState } from 'react';
import { DashboardLayout, adminNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Search, Eye, X, Package, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Navigate } from 'react-router';
import { Order } from '../../context/AppContext';

export default function OrderMonitoring() {
  const navigate = useNavigate();
  const { currentUser, orders, updateOrderStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.salesRepName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCredits = orders.reduce((sum, o) => sum + o.totalCredits, 0);

  const statusOptions: Order['status'][] = ['pending', 'processing', 'delivered', 'cancelled'];

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl mb-1">Order Monitoring</h1>
          <p className="text-muted-foreground text-sm">Full visibility and control over all platform orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Total', value: orders.length, filter: 'all', color: 'text-[#1E3A8A]' },
            { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, filter: 'pending', color: 'text-yellow-700' },
            { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, filter: 'processing', color: 'text-blue-700' },
            { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, filter: 'delivered', color: 'text-[#22C55E]' },
            { label: 'Total Credits', value: totalCredits.toLocaleString(), filter: null, color: 'text-[#14B8A6]' },
          ].map((stat, i) => (
            <Card
              key={i}
              hover={!!stat.filter}
              className={stat.filter ? 'cursor-pointer' : ''}
              onClick={() => stat.filter && setStatusFilter(stat.filter)}
            >
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-xl tabular-nums ${stat.color} ${statusFilter === stat.filter ? 'underline decoration-2' : ''}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID, doctor, sales rep..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="text-muted-foreground text-sm">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-3 text-xs text-muted-foreground">Order ID</th>
                      <th className="text-left py-4 px-3 text-xs text-muted-foreground">Doctor</th>
                      <th className="text-left py-4 px-3 text-xs text-muted-foreground hidden md:table-cell">Sales Rep</th>
                      <th className="text-left py-4 px-3 text-xs text-muted-foreground hidden md:table-cell">Date</th>
                      <th className="text-left py-4 px-3 text-xs text-muted-foreground">Credits</th>
                      <th className="text-left py-4 px-3 text-xs text-muted-foreground">Status</th>
                      <th className="text-right py-4 px-3 text-xs text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3 px-3 text-sm">{order.id}</td>
                        <td className="py-3 px-3 text-sm">{order.doctorName}</td>
                        <td className="py-3 px-3 text-sm text-muted-foreground hidden md:table-cell">{order.salesRepName}</td>
                        <td className="py-3 px-3 text-sm text-muted-foreground hidden md:table-cell">{order.date}</td>
                        <td className="py-3 px-3 text-[#14B8A6] text-sm">{order.totalCredits}</td>
                        <td className="py-3 px-3">
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={e => updateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="appearance-none text-xs px-2 py-1 rounded-full border border-border bg-white pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                            >
                              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex justify-end">
                            <button
                              onClick={() => setViewOrder(order)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-[#f1f5f9] text-xs transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
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
                  <p className="text-xs text-muted-foreground">{viewOrder.date}</p>
                </div>
                <button onClick={() => setViewOrder(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Doctor', value: viewOrder.doctorName },
                    { label: 'Sales Rep', value: viewOrder.salesRepName },
                    { label: 'Total Credits', value: `${viewOrder.totalCredits} credits` },
                    { label: 'Status', value: null },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-[#f8fafc] rounded-xl">
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      {value ? (
                        <p className="text-sm">{value}</p>
                      ) : (
                        <Badge variant={viewOrder.status as any}>{viewOrder.status}</Badge>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-xl">
                  <p className="text-xs text-muted-foreground mb-0.5">Delivery Address</p>
                  <p className="text-sm">{viewOrder.address}</p>
                </div>

                <div>
                  <p className="text-sm mb-2">Items ({viewOrder.items.length})</p>
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

                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(s => (
                      <button
                        key={s}
                        onClick={() => { updateOrderStatus(viewOrder.id, s); setViewOrder({ ...viewOrder, status: s }); }}
                        className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-all border ${viewOrder.status === s ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'border-border hover:bg-[#f1f5f9]'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={() => setViewOrder(null)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}