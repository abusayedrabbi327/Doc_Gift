import { useState } from 'react';
import { DashboardLayout, adminNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Search, Plus, Trash2, Eye, X, CreditCard, Users, User, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Navigate } from 'react-router';

const env = import.meta.env as Record<string, string | undefined>;

export default function UserManagement() {
  const navigate = useNavigate();
  const { currentUser, doctors, salesReps, orders, assignCreditsToDoctor, deleteUser, addUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'doctor' | 'sales'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addRole, setAddRole] = useState<'doctor' | 'sales'>('doctor');
  const [creditModal, setCreditModal] = useState<{ id: string; name: string } | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '', email: '', password: '', phone: '', specialty: '', licenseNumber: '',
    yearsOfExperience: '0', hospital: '', hospitalAddress: '', city: '', state: '',
    zipCode: '', workingDays: 'Monday - Friday', workingHours: '9:00 AM - 5:00 PM',
    territory: '', assignedSalesRepId: salesReps[0]?.id || '',
  });

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const allUsers = [
    ...doctors.map(d => ({ ...d, role: 'doctor' as const, info: `${d.credits.toLocaleString()} credits`, joinDate: d.memberSince })),
    ...salesReps.map(s => ({ ...s, role: 'sales' as const, info: `${s.doctorIds.length} doctors`, joinDate: s.joinDate })),
  ];

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (role: 'doctor' | 'sales', id: string) => {
    deleteUser(role, id);
    setConfirmDelete(null);
  };

  const handleAssignCredits = () => {
    const amount = parseInt(creditAmount);
    if (!amount || amount <= 0 || !creditModal) return;
    assignCreditsToDoctor(creditModal.id, amount);
    setCreditModal(null);
    setCreditAmount('');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const data = addRole === 'doctor'
      ? { ...newUser, password: newUser.password || env.VITE_DEFAULT_DOCTOR_PASSWORD || '' }
      : { name: newUser.name, email: newUser.email, password: newUser.password, phone: newUser.phone, territory: newUser.territory };
    addUser(addRole, data);
    setAdded(true);
    setTimeout(() => {
      setShowAddModal(false);
      setAdded(false);
      setNewUser({ name: '', email: '', password: '', phone: '', specialty: '', licenseNumber: '', yearsOfExperience: '0', hospital: '', hospitalAddress: '', city: '', state: '', zipCode: '', workingDays: 'Monday - Friday', workingHours: '9:00 AM - 5:00 PM', territory: '', assignedSalesRepId: salesReps[0]?.id || '' });
    }, 2000);
  };

  const inputClass = "w-full px-3 py-2.5 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm";

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-1">User Management</h1>
            <p className="text-muted-foreground text-sm">Manage doctors and sales representatives</p>
          </div>
          <Button variant="primary" className="gap-2 w-fit" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Users', value: allUsers.length, color: 'text-[#1E3A8A]' },
            { label: 'Doctors', value: doctors.length, color: 'text-[#14B8A6]' },
            { label: 'Sales Reps', value: salesReps.length, color: 'text-[#22C55E]' },
            { label: 'Active', value: allUsers.filter(u => u.status === 'active').length, color: 'text-yellow-700' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl tabular-nums ${stat.color}`}>{stat.value}</p>
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
              placeholder="Search users..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'doctor', 'sales'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role as any)}
                className={`px-4 py-2.5 rounded-xl text-sm capitalize transition-all ${roleFilter === role ? 'bg-[#1E3A8A] text-white' : 'bg-white border border-border hover:bg-[#f1f5f9]'}`}
              >
                {role === 'all' ? 'All' : role === 'doctor' ? 'Doctors' : 'Sales Reps'}
              </button>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <Card key={user.id} hover>
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">{user.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    <Badge variant={user.role === 'doctor' ? 'processing' : 'approved'}>
                      {user.role === 'doctor' ? 'Doctor' : 'Sales Rep'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{user.info}</span>
                    <Badge variant="approved">Active</Badge>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {user.role === 'doctor' && (
                      <button
                        onClick={() => { setCreditModal({ id: user.id, name: user.name }); setCreditAmount(''); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] hover:bg-[#14B8A6]/20 text-xs transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Credits
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmDelete(user.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredUsers.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground text-sm">No users found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3>Add New User</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Admin-issued accounts only</p>
                </div>
                <button onClick={() => { setShowAddModal(false); setAdded(false); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {added ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto mb-3" />
                  <h3 className="mb-1">User Created!</h3>
                  <p className="text-sm text-muted-foreground">The new {addRole} has been added to the system.</p>
                </div>
              ) : (
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">User Role *</label>
                    <div className="flex gap-2">
                      {['doctor', 'sales'].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setAddRole(r as any)}
                          className={`flex-1 py-2 rounded-xl text-sm capitalize transition-all border ${addRole === r ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'border-border hover:bg-[#f1f5f9]'}`}
                        >
                          {r === 'doctor' ? 'Doctor' : 'Sales Rep'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Full Name *</label>
                      <input type="text" value={newUser.name} onChange={e => setNewUser(p => ({...p, name: e.target.value}))} className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Email *</label>
                      <input type="email" value={newUser.email} onChange={e => setNewUser(p => ({...p, email: e.target.value}))} className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Password *</label>
                      <input type="text" value={newUser.password} onChange={e => setNewUser(p => ({...p, password: e.target.value}))} className={inputClass} placeholder="Set initial password" required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Phone</label>
                      <input type="tel" value={newUser.phone} onChange={e => setNewUser(p => ({...p, phone: e.target.value}))} className={inputClass} />
                    </div>

                    {addRole === 'doctor' && (
                      <>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">Specialty *</label>
                          <input type="text" value={newUser.specialty} onChange={e => setNewUser(p => ({...p, specialty: e.target.value}))} className={inputClass} required />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">License Number</label>
                          <input type="text" value={newUser.licenseNumber} onChange={e => setNewUser(p => ({...p, licenseNumber: e.target.value}))} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">Hospital *</label>
                          <input type="text" value={newUser.hospital} onChange={e => setNewUser(p => ({...p, hospital: e.target.value}))} className={inputClass} required />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">Assign to Sales Rep</label>
                          <select value={newUser.assignedSalesRepId} onChange={e => setNewUser(p => ({...p, assignedSalesRepId: e.target.value}))} className={inputClass}>
                            {salesReps.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">City</label>
                          <input type="text" value={newUser.city} onChange={e => setNewUser(p => ({...p, city: e.target.value}))} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">State</label>
                          <input type="text" value={newUser.state} onChange={e => setNewUser(p => ({...p, state: e.target.value}))} className={inputClass} />
                        </div>
                      </>
                    )}

                    {addRole === 'sales' && (
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1.5">Territory *</label>
                        <input type="text" value={newUser.territory} onChange={e => setNewUser(p => ({...p, territory: e.target.value}))} className={inputClass} placeholder="e.g. Northern California" required />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" variant="primary" className="flex-1">Create User</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assign Credits Modal */}
      {creditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Assign Credits</h3>
                <button onClick={() => setCreditModal(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Assigning to: <strong>{creditModal.name}</strong></p>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Credit Amount *</label>
                  <input type="number" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} placeholder="Enter amount" min={1} className="w-full px-4 py-3 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm" />
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1" onClick={handleAssignCredits} disabled={!creditAmount || parseInt(creditAmount) <= 0}>
                    Assign Credits
                  </Button>
                  <Button variant="outline" onClick={() => setCreditModal(null)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm shadow-2xl">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="mb-1">Delete User?</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => {
                      const user = allUsers.find(u => u.id === confirmDelete);
                      if (user) handleDelete(user.role, user.id);
                    }}
                  >
                    Delete
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}