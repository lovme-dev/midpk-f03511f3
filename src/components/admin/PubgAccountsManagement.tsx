import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Upload, Video, Image as ImageIcon, Trash2, Edit, Eye, EyeOff } from 'lucide-react';

interface PubgAccount {
  id: string;
  title: string;
  description: string | null;
  price: number;
  video_url: string | null;
  thumbnail_url: string | null;
  status: 'available' | 'sold';
  video_duration: number | null;
  created_at: string;
  updated_at: string;
}

interface AccountCredentials {
  login_email: string | null;
  login_password: string | null;
  recovery_info: string | null;
}

export function PubgAccountsManagement() {
  const [accounts, setAccounts] = useState<PubgAccount[]>([]);
  const [credentials, setCredentials] = useState<{ [accountId: string]: AccountCredentials }>({});
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState<PubgAccount | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    login_email: '',
    login_password: '',
    recovery_info: '',
    status: 'available' as 'available' | 'sold',
    video_duration: ''
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAccounts();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('pubg-accounts-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pubg_accounts'
      }, (payload) => {
        console.log('Real-time update:', payload);
        fetchAccounts(); // Refetch data when changes occur
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data: accountsData, error: accountsError } = await supabase
        .from('pubg_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (accountsError) throw accountsError;
      setAccounts((accountsData || []) as PubgAccount[]);

      // Fetch credentials separately (admin only)
      const { data: credentialsData, error: credentialsError } = await supabase
        .from('pubg_account_credentials')
        .select('account_id, login_email, login_password, recovery_info');

      if (!credentialsError && credentialsData) {
        const credentialsMap: { [accountId: string]: AccountCredentials } = {};
        credentialsData.forEach((cred: any) => {
          credentialsMap[cred.account_id] = {
            login_email: cred.login_email,
            login_password: cred.login_password,
            recovery_info: cred.recovery_info
          };
        });
        setCredentials(credentialsMap);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(Math.round(video.duration));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let video_url = editingAccount?.video_url || null;
      let thumbnail_url = editingAccount?.thumbnail_url || null;
      let video_duration = editingAccount?.video_duration || null;

      if (videoFile) {
        video_url = await uploadFile(videoFile, 'pubg-accounts', 'videos');
        video_duration = await getVideoDuration(videoFile);
      }

      if (thumbnailFile) {
        thumbnail_url = await uploadFile(thumbnailFile, 'pubg-accounts', 'thumbnails');
      }

      const accountData = {
        title: formData.title,
        description: formData.description || null,
        price: parseFloat(formData.price),
        video_url,
        thumbnail_url,
        status: formData.status,
        video_duration
      };

      const credentialsData = {
        login_email: formData.login_email || null,
        login_password: formData.login_password || null,
        recovery_info: formData.recovery_info || null
      };

      if (editingAccount) {
        // Update account
        const { error: accountError } = await supabase
          .from('pubg_accounts')
          .update(accountData)
          .eq('id', editingAccount.id);

        if (accountError) throw accountError;

        // Update or insert credentials
        const { error: credError } = await supabase
          .from('pubg_account_credentials')
          .upsert([{
            account_id: editingAccount.id,
            email: credentialsData.login_email,
            password: credentialsData.login_password
          }]);

        if (credError) throw credError;
        toast.success('Account updated successfully');
      } else {
        // Insert new account
        const { data: newAccount, error: accountError } = await supabase
          .from('pubg_accounts')
          .insert([accountData])
          .select()
          .single();

        if (accountError) throw accountError;

        // Insert credentials
        if (newAccount) {
          const { error: credError } = await supabase
            .from('pubg_account_credentials')
            .insert([{
              account_id: newAccount.id,
              email: credentialsData.login_email,
              password: credentialsData.login_password
            }]);

          if (credError) throw credError;
          
          setAccounts(prevAccounts => [newAccount as PubgAccount, ...prevAccounts]);
        }
        
        toast.success('Account created successfully');
      }

      resetForm();
      // Force a fresh fetch to ensure sync
      await fetchAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
      toast.error('Failed to save account. Please check the console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (account: PubgAccount) => {
    setEditingAccount(account);
    const accountCreds = credentials[account.id] || { login_email: null, login_password: null, recovery_info: null };
    setFormData({
      title: account.title,
      description: account.description || '',
      price: account.price.toString(),
      login_email: accountCreds.login_email || '',
      login_password: accountCreds.login_password || '',
      recovery_info: accountCreds.recovery_info || '',
      status: account.status,
      video_duration: account.video_duration?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      const { error } = await supabase
        .from('pubg_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Account deleted successfully');
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      login_email: '',
      login_password: '',
      recovery_info: '',
      status: 'available',
      video_duration: ''
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setEditingAccount(null);
    setShowForm(false);
  };

  // Function to open fresh form for new account
  const openNewAccountForm = () => {
    resetForm();
    setShowForm(true);
  };

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">PUBG Accounts Management</h2>
          <p className="text-muted-foreground">Manage PUBG accounts for sale</p>
        </div>
        <Button onClick={openNewAccountForm} className="bg-gradient-primary">
          Add New Account
        </Button>
      </div>

      {showForm && (
        <Card className="border-border bg-midasbuy-darkBlue/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">{editingAccount ? 'Edit Account' : 'Add New Account'}</CardTitle>
            <CardDescription className="text-white/70">
              {editingAccount ? 'Update account details' : 'Create a new PUBG account listing'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Account Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Royal Pass Account Level 100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">Price (PKR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="5000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the account..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video" className="text-white">Video File (MP4/WebM)</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail" className="text-white">Thumbnail Image</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-3 text-white">Account Login Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="login_email" className="text-white">Account Email/Username</Label>
                    <Input
                      id="login_email"
                      value={formData.login_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, login_email: e.target.value }))}
                      placeholder="account@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login_password" className="text-white">Account Password</Label>
                    <Input
                      id="login_password"
                      type="password"
                      value={formData.login_password}
                      onChange={(e) => setFormData(prev => ({ ...prev, login_password: e.target.value }))}
                      placeholder="password123"
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="recovery_info" className="text-white">Recovery Information (Optional)</Label>
                  <Textarea
                    id="recovery_info"
                    value={formData.recovery_info}
                    onChange={(e) => setFormData(prev => ({ ...prev, recovery_info: e.target.value }))}
                    placeholder="Phone number, security questions, etc."
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.status === 'available'}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, status: checked ? 'available' : 'sold' }))
                  }
                />
                <Label className="text-white">Available for Purchase</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading} className="bg-gradient-primary">
                  {uploading ? 'Saving...' : editingAccount ? 'Update Account' : 'Create Account'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-1 md:gap-2">
        {accounts.map((account) => (
          <Card key={account.id} className="border-border bg-card">
            <CardContent className="p-1.5 md:p-3">
              <div className="flex justify-between items-start gap-1 md:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <h3 className="text-xs md:text-sm font-semibold text-foreground truncate">{account.title}</h3>
                    <Badge variant={account.status === 'available' ? 'default' : 'secondary'} className="text-[10px] md:text-xs px-1 py-0">
                      {account.status}
                    </Badge>
                  </div>
                  <p className="text-sm md:text-lg font-bold text-primary mb-0.5 md:mb-1">PKR {account.price}</p>
                  {account.description && (
                    <p className="text-[10px] md:text-xs text-muted-foreground mb-1 md:mb-2 line-clamp-1">{account.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 p-1 md:p-2 bg-muted/50 rounded text-[10px] md:text-xs">
                    <div className="space-y-0.5">
                      <Label className="text-[9px] md:text-xs text-muted-foreground">Email</Label>
                      <div className="flex items-center gap-0.5 md:gap-1">
                        <Input
                          type={showPasswords[account.id] ? 'text' : 'password'}
                          value={credentials[account.id]?.login_email || 'Not provided'}
                          readOnly
                          className="h-4 md:h-6 text-[9px] md:text-xs p-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 md:h-6 md:w-6 p-0"
                          onClick={() => togglePasswordVisibility(account.id)}
                        >
                          {showPasswords[account.id] ? <EyeOff className="h-2 w-2 md:h-3 md:w-3" /> : <Eye className="h-2 w-2 md:h-3 md:w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-[9px] md:text-xs text-muted-foreground">Password</Label>
                      <Input
                        type={showPasswords[account.id] ? 'text' : 'password'}
                        value={credentials[account.id]?.login_password || 'Not provided'}
                        readOnly
                        className="h-4 md:h-6 text-[9px] md:text-xs p-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-0.5 md:gap-1">
                  <div className="flex gap-0.5 md:gap-1 mb-0.5 md:mb-1">
                    {account.video_url && (
                      <Badge variant="outline" className="text-[8px] md:text-xs px-0.5 md:px-1 py-0">
                        <Video className="h-1.5 w-1.5 md:h-2 md:w-2" />
                      </Badge>
                    )}
                    {account.thumbnail_url && (
                      <Badge variant="outline" className="text-[8px] md:text-xs px-0.5 md:px-1 py-0">
                        <ImageIcon className="h-1.5 w-1.5 md:h-2 md:w-2" />
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-0.5 md:gap-1">
                    <Button variant="outline" size="sm" className="h-5 w-5 md:h-7 md:w-7 p-0" onClick={() => handleEdit(account)}>
                      <Edit className="h-2 w-2 md:h-3 md:w-3" />
                    </Button>
                    <Button variant="destructive" size="sm" className="h-5 w-5 md:h-7 md:w-7 p-0" onClick={() => handleDelete(account.id)}>
                      <Trash2 className="h-2 w-2 md:h-3 md:w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No PUBG accounts found. Create your first account to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}