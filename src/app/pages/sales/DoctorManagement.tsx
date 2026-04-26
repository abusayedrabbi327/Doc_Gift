import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { DashboardLayout, salesNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  Search, Plus, Eye, CreditCard, MapPin, Phone, Mail, X,
  Building2, CheckCircle, Clock, Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DoctorManagement() {
  const navigate = useNavigate();
  const { currentUser, doctors, orders, submitDoctorAddRequest, assignCreditsToDoctor } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const [newDoctor, setNewDoctor] = useState({
    name: '', email: '', phone: '', specialty: '', licenseNumber: '',
    hospital: '', hospitalAddress: '', city: '', state: '', zipCode: '',
    workingDays: 'Monday - Friday', workingHours: '9:00 AM - 5:00 PM',
  });

  if (!currentUser || currentUser.role !== 'sales') {
    return <Navigate to="/login" replace />;
  }

  const rep = currentUser.data;
  const myDoctors = doctors.filter(d => rep.doctorIds.includes(d.id));

  const filteredDoctors = myDoctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDoctorOrderCount = (doctorId: string) => orders.filter(o => o.doctorId === doctorId).length;

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    submitDoctorAddRequest(rep.id, rep.name, newDoctor);
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowAddModal(false);
      setRequestSubmitted(false);
      setNewDoctor({
        name: '', email: '', phone: '', specialty: '', licenseNumber: '',
        hospital: '', hospitalAddress: '', city: '', state: '', zipCode: '',
        workingDays: 'Monday - Friday', workingHours: '9:00 AM - 5:00 PM',
      });
    }, 2500);
  };

  const handleAssignCredits = (doctorId: string) => {
    const amount = parseInt(creditAmount);
    if (!amount || amount <= 0 || amount > rep.credits) return;
    assignCreditsToDoctor(doctorId, amount);
    setShowCreditModal(null);
    setCreditAmount('');
  };

  const inputClass = "w-full px-3 py-2.5 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm";

  return (
    <DashboardLayout navItems={salesNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-1">My Doctors</h1>
            <p className="text-muted-foreground text-sm">{myDoctors.length} doctor{myDoctors.length !== 1 ? 's' : ''} assigned to you</p>
          </div>
          <Button variant="primary" className="gap-2 w-fit" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Doctor
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Doctors', value: myDoctors.length, color: 'text-[#1E3A8A]' },
            { label: 'Active', value: myDoctors.filter(d => d.status === 'active').length, color: 'text-[#22C55E]' },
            { label: 'Total Orders', value: myDoctors.reduce((sum, d) => sum + getDoctorOrderCount(d.id), 0), color: 'text-[#14B8A6]' },
            { label: 'My Credits', value: rep.credits.toLocaleString(), color: 'text-yellow-700' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-xl tabular-nums ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm"
            />
          </div>
        </div>

        {/* Doctors List */}
        {filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="pt-6 py-16 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
              <h3 className="mb-1">No Doctors Found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {searchQuery ? 'No doctors match your search.' : 'No doctors assigned yet. Add a doctor to get started.'}
              </p>
              {!searchQuery && (
                <Button variant="primary" size="sm" className="gap-2" onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4" /> Add Doctor
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} hover className="overflow-hidden">
                <CardContent className="pt-4 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">{doctor.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm">{doctor.name}</p>
                          <Badge variant={doctor.status === 'active' ? 'approved' : 'pending'}>
                            {doctor.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-muted-foreground flex-1">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{doctor.hospital}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span>{doctor.city}, {doctor.state}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3 h-3 flex-shrink-0" />
                        <span className="text-[#14B8A6]">{doctor.credits.toLocaleString()} cr</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/sales/doctors/${doctor.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-[#f1f5f9] text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        onClick={() => { setShowCreditModal(doctor.id); setCreditAmount(''); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] hover:bg-[#14B8A6]/20 text-xs transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Credits
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3>Add New Doctor</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Request will be sent to admin for approval</p>
                </div>
                <button onClick={() => { setShowAddModal(false); setRequestSubmitted(false); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {requestSubmitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-9 h-9 text-[#22C55E]" />
                  </div>
                  <h3 className="mb-1">Request Submitted!</h3>
                  <p className="text-sm text-muted-foreground">Your request to add <strong>{newDoctor.name}</strong> has been sent to the admin for approval.</p>
                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                    <Clock className="w-3 h-3" />
                    Awaiting admin approval
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddDoctor} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Full Name *</label>
                      <input type="text" value={newDoctor.name} onChange={e => setNewDoctor(p => ({...p, name: e.target.value}))} className={inputClass} placeholder="Dr. First Last" required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Email *</label>
                      <input type="email" value={newDoctor.email} onChange={e => setNewDoctor(p => ({...p, email: e.target.value}))} className={inputClass} placeholder="doctor@hospital.com" required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Phone *</label>
                      <input type="tel" value={newDoctor.phone} onChange={e => setNewDoctor(p => ({...p, phone: e.target.value}))} className={inputClass} placeholder="+1 (555) 000-0000" required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Medical Specialty *</label>
                      <input type="text" value={newDoctor.specialty} onChange={e => setNewDoctor(p => ({...p, specialty: e.target.value}))} className={inputClass} placeholder="e.g. Cardiology" required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">License Number *</label>
                      <input type="text" value={newDoctor.licenseNumber} onChange={e => setNewDoctor(p => ({...p, licenseNumber: e.target.value}))} className={inputClass} placeholder="MD-XXXXX-XX" required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Hospital / Clinic *</label>
                      <input type="text" value={newDoctor.hospital} onChange={e => setNewDoctor(p => ({...p, hospital: e.target.value}))} className={inputClass} placeholder="Hospital name" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-muted-foreground mb-1.5">Hospital Address *</label>
                      <input type="text" value={newDoctor.hospitalAddress} onChange={e => setNewDoctor(p => ({...p, hospitalAddress: e.target.value}))} className={inputClass} placeholder="Full hospital address" required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">City *</label>
                      <input type="text" value={newDoctor.city} onChange={e => setNewDoctor(p => ({...p, city: e.target.value}))} className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">State *</label>
                      <input type="text" value={newDoctor.state} onChange={e => setNewDoctor(p => ({...p, state: e.target.value}))} className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">ZIP Code</label>
                      <input type="text" value={newDoctor.zipCode} onChange={e => setNewDoctor(p => ({...p, zipCode: e.target.value}))} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Working Days</label>
                      <input type="text" value={newDoctor.workingDays} onChange={e => setNewDoctor(p => ({...p, workingDays: e.target.value}))} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Working Hours</label>
                      <input type="text" value={newDoctor.workingHours} onChange={e => setNewDoctor(p => ({...p, workingHours: e.target.value}))} className={inputClass} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    This request will be sent to the administrator for review and approval before the doctor is added.
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" variant="primary" className="flex-1 gap-2">
                      <Plus className="w-4 h-4" />
                      Submit Request
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assign Credits Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Assign Credits</h3>
                <button onClick={() => setShowCreditModal(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const doc = doctors.find(d => d.id === showCreditModal);
                return (
                  <div className="space-y-4">
                    {doc && (
                      <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl">
                        <div className="w-9 h-9 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[#1E3A8A] text-sm">{doc.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">Current: <span className="text-[#14B8A6]">{doc.credits.toLocaleString()} credits</span></p>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">
                        Amount to Assign (you have {rep.credits.toLocaleString()} cr)
                      </label>
                      <input
                        type="number"
                        value={creditAmount}
                        onChange={e => setCreditAmount(e.target.value)}
                        placeholder="e.g. 500"
                        min={1}
                        max={rep.credits}
                        className="w-full px-4 py-3 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm"
                      />
                      {parseInt(creditAmount) > rep.credits && (
                        <p className="text-red-500 text-xs mt-1">Exceeds your available credits</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() => handleAssignCredits(showCreditModal)}
                        disabled={!creditAmount || parseInt(creditAmount) <= 0 || parseInt(creditAmount) > rep.credits}
                      >
                        Assign Credits
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreditModal(null)}>Cancel</Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}