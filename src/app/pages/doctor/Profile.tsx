import { useState } from 'react';
import { DashboardLayout, doctorNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  Edit, MapPin, Building2, Phone, Mail, User, Award, Calendar,
  Lock, Eye, EyeOff, Save, X, CheckCircle, IdCard, Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Navigate } from 'react-router';

export default function DoctorProfile() {
  const navigate = useNavigate();
  const { currentUser, updateDoctorProfile, updateDoctorPassword, orders } = useApp();

  // ── All hooks MUST be before any conditional return ──────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [saved, setSaved] = useState(false);

  // Password change state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  // Derive doctor safely before guard so form useState can use it
  const doctorData = currentUser?.role === 'doctor' ? currentUser.data : null;

  const [form, setForm] = useState({
    name: doctorData?.name || '',
    email: doctorData?.email || '',
    phone: doctorData?.phone || '',
    specialty: doctorData?.specialty || '',
    licenseNumber: doctorData?.licenseNumber || '',
    yearsOfExperience: doctorData?.yearsOfExperience || '',
    hospital: doctorData?.hospital || '',
    hospitalAddress: doctorData?.hospitalAddress || '',
    city: doctorData?.city || '',
    state: doctorData?.state || '',
    zipCode: doctorData?.zipCode || '',
    workingDays: doctorData?.workingDays || '',
    workingHours: doctorData?.workingHours || '',
  });

  // ── Guard ────────────────────────────────────────────────────────────────────
  if (!currentUser || currentUser.role !== 'doctor') {
    return <Navigate to="/login" replace />;
  }

  const doctor = currentUser.data;
  const doctorOrders = orders.filter(o => o.doctorId === doctor.id);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateDoctorProfile(doctor.id, form);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({
      name: doctor.name, email: doctor.email, phone: doctor.phone,
      specialty: doctor.specialty, licenseNumber: doctor.licenseNumber,
      yearsOfExperience: doctor.yearsOfExperience, hospital: doctor.hospital,
      hospitalAddress: doctor.hospitalAddress, city: doctor.city,
      state: doctor.state, zipCode: doctor.zipCode,
      workingDays: doctor.workingDays, workingHours: doctor.workingHours,
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (currentPw !== doctor.password) {
      setPwError('Current password is incorrect.');
      return;
    }
    if (newPw.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('Passwords do not match.');
      return;
    }
    updateDoctorPassword(doctor.id, newPw);
    setPwSuccess(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSuccess(false), 4000);
  };

  const inputClass = "w-full px-4 py-3 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm";
  const readClass = "px-4 py-3 bg-[#f8fafc] rounded-xl text-sm text-foreground";

  return (
    <DashboardLayout navItems={doctorNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-1">My Profile</h1>
            <p className="text-muted-foreground text-sm">Manage your personal and professional information</p>
          </div>
          {activeTab === 'profile' && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="primary" className="gap-2" onClick={handleSave}>
                    <Save className="w-4 h-4" /> Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4" /> Edit Profile
                </Button>
              )}
            </div>
          )}
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl text-[#22C55E] text-sm">
            <CheckCircle className="w-4 h-4" />
            Profile saved successfully!
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#f1f5f9] p-1 rounded-xl w-fit">
          {[
            { key: 'profile', label: 'Profile Info' },
            { key: 'security', label: 'Security' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key as any); setIsEditing(false); }}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === tab.key ? 'bg-white shadow-sm text-[#1E3A8A]' : 'text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Summary */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-white">{doctor.name.charAt(0)}</span>
                    </div>
                    <h2 className="mb-0.5 text-base">{doctor.name}</h2>
                    <p className="text-sm text-muted-foreground mb-2">{doctor.specialty}</p>
                    <Badge variant="approved">Active</Badge>
                    <div className="mt-3 text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <IdCard className="w-3 h-3" />
                        <span>{doctor.companyId}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{doctor.city}, {doctor.state}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><h3 className="text-sm">Account Statistics</h3></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Member Since</span>
                      <span>{doctor.memberSince}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span>{doctorOrders.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credits Earned</span>
                      <span className="text-[#22C55E]">{doctor.totalCreditsEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credits Used</span>
                      <span>{doctor.totalCreditsUsed.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between text-sm">
                      <span>Available</span>
                      <span className="text-[#14B8A6]">{doctor.credits.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right - Forms */}
            <div className="lg:col-span-2 space-y-5">
              {/* Personal Info */}
              <Card>
                <CardHeader><h3 className="text-sm flex items-center gap-2"><User className="w-4 h-4 text-[#1E3A8A]" /> Personal Information</h3></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', field: 'name' },
                      { label: 'Email Address', field: 'email' },
                      { label: 'Phone Number', field: 'phone' },
                      { label: 'License Number', field: 'licenseNumber' },
                    ].map(({ label, field }) => (
                      <div key={field}>
                        <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={(form as any)[field]}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          <div className={readClass}>{(doctor as any)[field]}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Info */}
              <Card>
                <CardHeader><h3 className="text-sm flex items-center gap-2"><Award className="w-4 h-4 text-[#1E3A8A]" /> Professional Information</h3></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Medical Specialty', field: 'specialty' },
                      { label: 'Years of Experience', field: 'yearsOfExperience' },
                    ].map(({ label, field }) => (
                      <div key={field}>
                        <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
                        {isEditing ? (
                          <input type="text" value={(form as any)[field]} onChange={(e) => handleChange(field, e.target.value)} className={inputClass} />
                        ) : (
                          <div className={readClass}>{(doctor as any)[field]}{field === 'yearsOfExperience' ? ' years' : ''}</div>
                        )}
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Building2 className="w-3 h-3" /> Hospital / Clinic</label>
                      {isEditing ? (
                        <input type="text" value={form.hospital} onChange={(e) => handleChange('hospital', e.target.value)} className={inputClass} />
                      ) : (
                        <div className={readClass}>{doctor.hospital}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader><h3 className="text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1E3A8A]" /> Location & Working Hours</h3></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Hospital Address</label>
                      {isEditing ? (
                        <input type="text" value={form.hospitalAddress} onChange={(e) => handleChange('hospitalAddress', e.target.value)} className={inputClass} />
                      ) : (
                        <div className={readClass}>{doctor.hospitalAddress}</div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'City', field: 'city' },
                        { label: 'State', field: 'state' },
                        { label: 'ZIP', field: 'zipCode' },
                      ].map(({ label, field }) => (
                        <div key={field}>
                          <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
                          {isEditing ? (
                            <input type="text" value={(form as any)[field]} onChange={(e) => handleChange(field, e.target.value)} className={inputClass} />
                          ) : (
                            <div className={readClass}>{(doctor as any)[field]}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Working Days', field: 'workingDays' },
                        { label: 'Working Hours', field: 'workingHours' },
                      ].map(({ label, field }) => (
                        <div key={field}>
                          <label className="block text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {label}
                          </label>
                          {isEditing ? (
                            <input type="text" value={(form as any)[field]} onChange={(e) => handleChange(field, e.target.value)} className={inputClass} />
                          ) : (
                            <div className={readClass}>{(doctor as any)[field]}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Security Tab */
          <div className="max-w-md">
            <Card>
              <CardHeader>
                <h3 className="text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#1E3A8A]" /> Change Password
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Update your login password</p>
              </CardHeader>
              <CardContent>
                {pwSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl text-[#22C55E] text-sm mb-4">
                    <CheckCircle className="w-4 h-4" />
                    Password updated successfully!
                  </div>
                )}
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        className={`${inputClass} pr-10`}
                        placeholder="Enter current password"
                        required
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">New Password</label>
                    <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className={inputClass} placeholder="Min. 6 characters" required minLength={6} />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Confirm New Password</label>
                    <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className={inputClass} placeholder="Repeat new password" required />
                  </div>
                  {pwError && (
                    <p className="text-red-500 text-xs">{pwError}</p>
                  )}
                  <Button type="submit" variant="primary" className="w-full gap-2">
                    <Lock className="w-4 h-4" />
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Company ID info */}
            <Card className="mt-4">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <IdCard className="w-5 h-5 text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm mb-0.5">Your Company ID</p>
                    <p className="text-xl text-[#1E3A8A]">{doctor.companyId}</p>
                    <p className="text-xs text-muted-foreground mt-1">Use this ID to log in to your account.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}