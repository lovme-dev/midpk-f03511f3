import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User, Mail, Phone, Hash, Save, LogOut, Shield, Award, ArrowLeft } from 'lucide-react';
import { CyberInput, CyberButton, CyberCard } from '@/components/ui/CyberUI';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import { PushNotificationSettings } from '@/components/PushNotificationSettings';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  gamerTag: string;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    avatarUrl: null,
    gamerTag: 'Player'
  });

  const [formState, setFormState] = useState<UserProfile>(profile);

  // Load profile data immediately from user metadata first, then fetch from DB
  useEffect(() => {
    // Set initial profile from user metadata immediately (instant UI)
    if (user) {
      const quickProfile = {
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        email: user.email || '',
        phone: '',
        avatarUrl: user.user_metadata?.avatar_url || null,
        gamerTag: user.user_metadata?.full_name?.split(' ')[0] || 'Player'
      };
      setProfile(quickProfile);
      setFormState(quickProfile);
    }
  }, [user]);

  // Redirect if not logged in (after loading check)
  useEffect(() => {
    // Small delay to prevent flash redirect on page load
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/auth');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  // Load full profile data from database (background fetch)
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        const loadedProfile = {
          name: data.full_name || user.user_metadata?.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          avatarUrl: user.user_metadata?.avatar_url || null,
          gamerTag: data.full_name?.split(' ')[0] || 'Player'
        };
        setProfile(loadedProfile);
        setFormState(loadedProfile);
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    const file = e.target.files[0];
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setFormState(prev => ({ ...prev, avatarUrl: publicUrl }));
      toast.success('Photo uploaded!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formState.name,
          phone: formState.phone,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(formState);
      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      setFormState(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Background styling
  const backgroundStyle = {
    background: `
      radial-gradient(circle at 10% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 20%),
      radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 20%),
      linear-gradient(135deg, #020617 0%, #0f172a 100%)
    `,
    minHeight: '100vh',
  };

  if (!user) return null;

  return (
    <>
      <SEOHelmet 
        title="My Profile - Midasbuy | Manage Your Gaming Account"
        description="View and manage your Midasbuy profile. Update your avatar, contact details, and gaming preferences. Track your purchase history and account settings."
        keywords="midasbuy profile, my account, gaming profile, user settings, account management"
        canonicalUrl="/profile"
        noIndex={true}
      />
    <div style={backgroundStyle} className="text-slate-200 min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Grid Overlay Effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <main className="relative z-10 flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
          {/* Header Section with Back Button */}
          <div className="relative mb-6 flex items-center justify-center">
            <button 
              onClick={() => navigate('/')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300 group"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 uppercase tracking-[0.15em] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                Player Profile
              </h1>
              <p className="text-slate-500 mt-1 font-medium tracking-widest text-[10px] uppercase">
                Customize Your Gaming Identity
              </p>
            </div>
          </div>

          <CyberCard className="mt-4">
            <div className="flex flex-col md:flex-row gap-10">
              
              {/* Left Column: Avatar & Identity */}
              <div className="flex flex-col items-center gap-6 md:w-1/3 md:border-r border-slate-700/50 md:pr-10">
                <div className="relative group">
                  {/* Avatar Ring */}
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-[3px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-500">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
                      {formState.avatarUrl ? (
                        <img 
                          src={formState.avatarUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <User className="w-16 h-16 text-slate-700" />
                      )}
                      
                      {/* Hover Overlay for Upload */}
                      {(isEditing || !formState.avatarUrl) && (
                        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${!formState.avatarUrl ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            {isUploading ? (
                              <div className="animate-spin h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full" />
                            ) : (
                              <>
                                <Camera className="w-6 h-6 text-cyan-400" />
                                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                                  {formState.avatarUrl ? 'Change' : 'Upload'}
                                </span>
                              </>
                            )}
                            <input 
                              id="avatar-upload" 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleFileChange}
                              disabled={(!isEditing && !!formState.avatarUrl) || isUploading}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 rounded-full border-4 border-slate-900 shadow-[0_0_10px_#22c55e]" />
                </div>

                <div className="text-center w-full space-y-2">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider break-words drop-shadow-md">
                    {profile.gamerTag || profile.name.split(' ')[0] || 'Player'}
                  </h2>
                  <p className="text-slate-400 text-xs font-medium tracking-wide">
                    Elite Member
                  </p>
                  
                  {!isEditing && (
                    <div className="flex items-center justify-center gap-2 text-[10px] text-cyan-500/80 mt-2 font-bold tracking-widest uppercase py-1 px-3 bg-cyan-950/30 rounded-full border border-cyan-900/50 inline-flex mx-auto">
                      <Shield size={10} /> Verified Account
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Form Inputs */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-500" />
                    Player Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <CyberInput 
                    label="Full Name" 
                    name="name"
                    value={formState.name} 
                    onChange={handleInputChange} 
                    icon={User}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <CyberInput 
                      label="Gamer Tag" 
                      name="gamerTag"
                      value={formState.gamerTag} 
                      onChange={handleInputChange} 
                      icon={Hash}
                      disabled={!isEditing}
                      placeholder="Your unique ID"
                    />
                    <CyberInput 
                      label="Phone Number" 
                      name="phone"
                      value={formState.phone} 
                      onChange={handleInputChange} 
                      icon={Phone}
                      type="tel"
                      disabled={!isEditing}
                      placeholder="Set Phone Number"
                    />
                  </div>

                  <CyberInput 
                    label="Email Address" 
                    name="email"
                    value={formState.email} 
                    onChange={handleInputChange} 
                    icon={Mail}
                    type="email"
                    disabled={true}
                    placeholder="name@example.com"
                  />
                </div>

                {/* Push Notification Settings */}
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Notifications
                  </h3>
                  <PushNotificationSettings />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end border-t border-slate-800 mt-2">
                  {isEditing ? (
                    <>
                      <CyberButton variant="secondary" onClick={toggleEdit} disabled={isLoading}>
                        Cancel
                      </CyberButton>
                      <CyberButton onClick={handleSave} isLoading={isLoading}>
                        <Save className="w-4 h-4" /> Save Changes
                      </CyberButton>
                    </>
                  ) : (
                    <>
                      <CyberButton variant="danger" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" /> Sign Out
                      </CyberButton>
                      <CyberButton onClick={toggleEdit}>
                        Edit Profile
                      </CyberButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CyberCard>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-slate-600 text-xs tracking-widest uppercase">
        <p>Midasbuy © 2026 // All Rights Reserved</p>
      </footer>
    </div>
    </>
  );
}
