import { useState } from 'react';
import { DashboardLayout, adminNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  CreditCard, Users, CheckCircle, X, Clock, Calendar,
  MessageSquare, AlertCircle, Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Navigate } from 'react-router';

type TabType = 'credit' | 'doctors';

export default function AdminRequests() {
  const navigate = useNavigate();
  const {
    currentUser, creditRequests, doctorAddRequests,
    approveCreditRequest, rejectCreditRequest,
    approveDoctorAddRequest, rejectDoctorAddRequest,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('credit');
  const [rejectModal, setRejectModal] = useState<{ id: string; type: 'credit' | 'doctor' } | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [creditFilter, setCreditFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [doctorFilter, setDoctorFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const pendingCredit = creditRequests.filter(r => r.status === 'pending').length;
  const pendingDoctor = doctorAddRequests.filter(r => r.status === 'pending').length;

  const filteredCreditRequests = creditFilter === 'all'
    ? creditRequests
    : creditRequests.filter(r => r.status === creditFilter);

  const filteredDoctorRequests = doctorFilter === 'all'
    ? doctorAddRequests
    : doctorAddRequests.filter(r => r.status === doctorFilter);

  const handleReject = () => {
    if (!rejectModal) return;
    if (rejectModal.type === 'credit') {
      rejectCreditRequest(rejectModal.id, rejectNote);
    } else {
      rejectDoctorAddRequest(rejectModal.id, rejectNote);
    }
    setRejectModal(null);
    setRejectNote('');
  };

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl mb-1">Approval Requests</h1>
          <p className="text-muted-foreground text-sm">Review and action all pending requests</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Pending Credit Req.', value: pendingCredit, color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Pending Doctor Req.', value: pendingDoctor, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Approved Credits', value: creditRequests.filter(r => r.status === 'approved').reduce((s, r) => s + r.amount, 0).toLocaleString(), color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
            { label: 'Doctors Added', value: doctorAddRequests.filter(r => r.status === 'approved').length, color: 'text-[#14B8A6]', bg: 'bg-[#14B8A6]/10' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-xl tabular-nums ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#f1f5f9] p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('credit')}
            className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeTab === 'credit' ? 'bg-white shadow-sm text-[#1E3A8A]' : 'text-muted-foreground'}`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Credit Requests
            {pendingCredit > 0 && <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingCredit}</span>}
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeTab === 'doctors' ? 'bg-white shadow-sm text-[#1E3A8A]' : 'text-muted-foreground'}`}
          >
            <Users className="w-3.5 h-3.5" />
            Doctor Add Requests
            {pendingDoctor > 0 && <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingDoctor}</span>}
          </button>
        </div>

        {/* Credit Requests Tab */}
        {activeTab === 'credit' && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button
                  key={f}
                  onClick={() => setCreditFilter(f as any)}
                  className={`px-4 py-2 rounded-xl text-sm capitalize transition-all border ${creditFilter === f ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white border-border hover:bg-[#f1f5f9]'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {filteredCreditRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground text-sm">No credit requests found</p>
                </CardContent>
              </Card>
            ) : (
              filteredCreditRequests.map((req) => (
                <Card key={req.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <p className="text-sm">{req.id}</p>
                          <Badge variant={req.status === 'approved' ? 'approved' : req.status === 'rejected' ? 'rejected' : 'processing'}>
                            {req.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {req.date}
                          </span>
                        </div>
                        <p className="text-sm mb-0.5">
                          <span className="text-muted-foreground">From: </span>
                          {req.salesRepName}
                        </p>
                        <p className="text-xs text-muted-foreground bg-[#f8fafc] px-3 py-2 rounded-lg mt-2">
                          <MessageSquare className="w-3 h-3 inline mr-1" />
                          {req.reason}
                        </p>
                        {req.adminNote && (
                          <p className="text-xs text-[#1E3A8A] mt-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Admin note: {req.adminNote}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-2xl text-[#14B8A6]">{req.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">credits requested</p>
                        </div>
                        {req.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveCreditRequest(req.id, 'Approved by admin')}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 text-xs transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectModal({ id: req.id, type: 'credit' })}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Doctor Add Requests Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button
                  key={f}
                  onClick={() => setDoctorFilter(f as any)}
                  className={`px-4 py-2 rounded-xl text-sm capitalize transition-all border ${doctorFilter === f ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white border-border hover:bg-[#f1f5f9]'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {filteredDoctorRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground text-sm">No doctor add requests found</p>
                </CardContent>
              </Card>
            ) : (
              filteredDoctorRequests.map((req) => (
                <Card key={req.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <p className="text-sm">{req.id}</p>
                          <Badge variant={req.status === 'approved' ? 'approved' : req.status === 'rejected' ? 'rejected' : 'processing'}>
                            {req.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {req.date}
                          </span>
                        </div>
                        <p className="text-sm mb-1">
                          <span className="text-muted-foreground">Submitted by: </span>
                          {req.salesRepName}
                        </p>

                        {/* Doctor details */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                          {[
                            { label: 'Name', value: req.doctorData.name },
                            { label: 'Specialty', value: req.doctorData.specialty },
                            { label: 'Hospital', value: req.doctorData.hospital },
                            { label: 'Email', value: req.doctorData.email },
                            { label: 'Phone', value: req.doctorData.phone },
                            { label: 'City', value: `${req.doctorData.city}, ${req.doctorData.state}` },
                          ].map(({ label, value }) => (
                            <div key={label} className="p-2 bg-[#f8fafc] rounded-lg">
                              <p className="text-xs text-muted-foreground">{label}</p>
                              <p className="text-xs truncate">{value}</p>
                            </div>
                          ))}
                        </div>

                        {req.adminNote && (
                          <p className="text-xs text-[#1E3A8A] mt-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Admin note: {req.adminNote}
                          </p>
                        )}
                      </div>

                      {req.status === 'pending' && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => approveDoctorAddRequest(req.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 text-xs transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve & Add
                          </button>
                          <button
                            onClick={() => setRejectModal({ id: req.id, type: 'doctor' })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Reject Request
                </h3>
                <button onClick={() => { setRejectModal(null); setRejectNote(''); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Rejection Reason (optional)</label>
                  <textarea
                    value={rejectNote}
                    onChange={e => setRejectNote(e.target.value)}
                    placeholder="Provide a reason for rejection..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="danger" className="flex-1" onClick={handleReject}>
                    Confirm Reject
                  </Button>
                  <Button variant="outline" onClick={() => { setRejectModal(null); setRejectNote(''); }}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}