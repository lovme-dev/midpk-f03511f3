import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar, AdminSidebarTrigger } from '@/components/admin/AdminSidebar';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { OrdersManagement } from '@/components/admin/OrdersManagement';
import { PubgAccountsManagement } from '@/components/admin/PubgAccountsManagement';
import ComprehensiveSEOManager from '@/components/admin/ComprehensiveSEOManager';
import BlogManagement from '@/components/admin/BlogManagement';
import PUBGBannersManagement from '@/components/admin/PUBGBannersManagement';
import FreeFireBannersManagement from '@/components/admin/FreeFireBannersManagement';
import BGMIBannersManagement from '@/components/admin/BGMIBannersManagement';
import { SendNotification } from '@/components/admin/SendNotification';
import { AdminNotificationHistory } from '@/components/admin/AdminNotificationHistory';
import { NotificationSettings } from '@/components/admin/NotificationSettings';
import { CustomerInquiries } from '@/components/admin/CustomerInquiries';
import { RevenueAnalytics } from '@/components/admin/RevenueAnalytics';
import { RedeemCodesManagement } from '@/components/admin/RedeemCodesManagement';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface UCPackage { id: string; name: string; uc_amount: number; price: number; discount_percentage?: number; popular?: boolean; created_at?: string; }
interface SiteAsset { id: string; asset_key: string; url: string; }
interface PaymentCredential { id: string; name: string; method: string; value: string; }
interface ContentBlock { id: string; content_key: string; title: string | null; content: string | null; }
// SiteBanner interface removed - now handled by PUBGBannersManagement component

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || localStorage.getItem('adminActiveTab') || 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  // WhatsApp tabs removed: if a previous session stored them, reset to dashboard
  useEffect(() => {
    if (['whatsapp', 'whatsapp-control', 'whatsapp-chat'].includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [activeTab]);

  // SEO basics
  useEffect(() => {
    document.title = 'Admin Dashboard - Manage UC, Assets, Payments, Content';
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'Admin Dashboard to manage UC packages, site assets, payment credentials, and content blocks.');
    document.head.appendChild(metaDesc);
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.origin + '/admin');
    document.head.appendChild(canonical);
  }, []);

  // UC Packages
  const [ucPackages, setUcPackages] = useState<UCPackage[]>([]);
  const [ucLoading, setUcLoading] = useState(true);
  const [newUC, setNewUC] = useState({ name: '', amount: '', price: '' });

  // PUBG UC Page Management
  const [pubgUCPageMeta, setPubgUCPageMeta] = useState<{ id: string; meta_title: string; meta_description: string; meta_keywords: string; canonical_url: string; og_image: string } | null>(null);
  const [pubgUCPageContent, setPubgUCPageContent] = useState<{ id: string; content_key: string; title?: string; content?: string; image_url?: string; active: boolean; order_position: number }[]>([]);
  const [newContentBlock, setNewContentBlock] = useState({ content_key: '', title: '', content: '', image_url: '', order_position: 0 });

  useEffect(() => {
    const load = async () => {
      setUcLoading(true);
      const { data, error } = await supabase.from('uc_packages').select('*').order('created_at', { ascending: true });
      if (error) console.error(error);
      setUcPackages(data || []);
    setUcLoading(false);
    };
    load();
    fetchPubgUCPageMeta();
  }, []);

  const fetchPubgUCPageMeta = async () => {
    const { data, error } = await supabase
      .from('page_meta')
      .select('*')
      .or('path.eq.pubg-uc,page_id.eq.pubg-uc')
      .limit(1)
      .maybeSingle();
    if (error) console.error('Error fetching PUBG UC page meta:', error);
    setPubgUCPageMeta(data as any);
  };

  const updateUCPackage = async (pkg: UCPackage) => {
    const { error } = await supabase.from('uc_packages').update({ name: pkg.name, uc_amount: pkg.uc_amount, price: pkg.price }).eq('id', pkg.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Update failed', description: error.message });
    } else {
      toast({ title: 'UC package updated' });
    }
  };

  const addUCPackage = async () => {
    const parsed = { name: newUC.name.trim(), uc_amount: Number(newUC.amount), price: Number(newUC.price) };
    const { data, error } = await supabase.from('uc_packages').insert([parsed]).select('*');
    if (error) {
      toast({ variant: 'destructive', title: 'Add failed', description: error.message });
    } else {
      setUcPackages([...ucPackages, ...(data as any)]);
      setNewUC({ name: '', amount: '', price: '' });
      toast({ title: 'UC package added' });
    }
  };

  const deleteUCPackage = async (id: string) => {
    const { error } = await supabase.from('uc_packages').delete().eq('id', id);
    if (error) {
      toast({ variant: 'destructive', title: 'Delete failed', description: error.message });
    } else {
      setUcPackages(ucPackages.filter(p => p.id !== id));
      toast({ title: 'UC package deleted' });
    }
  };

  // Site Assets - DISABLED (table doesn't exist yet)
  const [assets, setAssets] = useState<SiteAsset[]>([]);
  const [assetKey, setAssetKey] = useState('');
  const [assetFile, setAssetFile] = useState<File | null>(null);

  // useEffect(() => {
  //   const load = async () => {
  //     const { data } = await supabase.from('site_assets').select('*').order('updated_at', { ascending: false });
  //     setAssets(data || []);
  //   };
  //   load();
  // }, []);

  const uploadAsset = async () => {
    toast({ variant: 'destructive', title: 'Feature disabled', description: 'Site assets table needs to be created first' });
  };

  // Payment Credentials - DISABLED (table doesn't exist yet)
  const [creds, setCreds] = useState<PaymentCredential[]>([]);
  const [newCred, setNewCred] = useState({ name: '', method: '', value: '' });

  // useEffect(() => {
  //   const load = async () => {
  //     const { data, error } = await supabase.from('payment_credentials').select('*').order('created_at', { ascending: true });
  //     if (!error) setCreds(data || []);
  //   };
  //   load();
  // }, []);

  const saveCred = async (c: PaymentCredential) => {
    toast({ variant: 'destructive', title: 'Feature disabled', description: 'Payment credentials table needs to be created first' });
  };
  const addCred = async () => {
    toast({ variant: 'destructive', title: 'Feature disabled', description: 'Payment credentials table needs to be created first' });
  };
  const deleteCred = async (id: string) => {
    toast({ variant: 'destructive', title: 'Feature disabled', description: 'Payment credentials table needs to be created first' });
  };

  // Content Blocks - DISABLED (table doesn't exist yet)
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [newBlock, setNewBlock] = useState({ content_key: '', title: '', content: '' });

  // useEffect(() => {
  //   const load = async () => {
  //     const { data } = await supabase.from('content_blocks').select('*').order('updated_at', { ascending: false });
  //     setBlocks(data || []);
  //   };
  //   load();
  // }, []);

  const saveBlock = async (b: ContentBlock) => {
    toast({ variant: 'destructive', title: 'Feature disabled', description: 'Content blocks table needs to be created first' });
  };
  const addBlock = async () => {
    toast({ variant: 'destructive', title: 'Feature disabled', description: 'Content blocks table needs to be created first' });
  };
  const deleteBlock = async (id: string) => {
    toast({ variant: 'destructive', title: 'Feature disabled', description: 'Content blocks table needs to be created first' });
  };

  // Admin management
  const [admins, setAdmins] = useState<{ user_id: string; email: string; since: string }[]>([]);
  const [users, setUsers] = useState<{ user_id: string; email: string | null; is_admin: boolean }[]>([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Banners Management - Now handled by PUBGBannersManagement component

  const loadAdmins = async () => {
    setAdminLoading(true);
    try {
      // Load list of admins
      const { data: adminData, error: adminError } = await supabase.rpc('list_admins');
      if (adminError) {
        console.error('Error loading admins:', adminError);
      } else {
        setAdmins(adminData || []);
      }

      // Load all users with admin status
      const { data: userData, error: userError } = await supabase.rpc('list_users_with_admin_status');
      if (userError) {
        console.error('Error loading users:', userError);
      } else {
        setUsers(userData || []);
      }
    } catch (err) {
      console.error('Error in loadAdmins:', err);
    }
    setAdminLoading(false);
  };

  // Load admins on component mount and when active tab changes to admins
  useEffect(() => {
    if (activeTab === 'admins') {
      loadAdmins();
    }
  }, [activeTab]);

  const grantAdmin = async () => {
    if (!adminEmail) return;
    setAdminLoading(true);
    try {
      const { data, error } = await supabase.rpc('grant_role_by_email', { 
        user_email: adminEmail.trim(), 
        target_role: 'admin' 
      });
      
      if (error) {
        toast({ variant: 'destructive', title: 'Grant failed', description: error.message });
      } else if (data && typeof data === 'object') {
        const result = data as { success: boolean; message: string };
        if (result.success) {
          toast({ title: 'Success', description: result.message });
          setAdminEmail('');
          await loadAdmins();
        } else {
          toast({ variant: 'destructive', title: 'Grant failed', description: result.message });
        }
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message || 'Unknown error' });
    }
    setAdminLoading(false);
  };

  const revokeAdminByEmail = async (email: string) => {
    setAdminLoading(true);
    try {
      const { data, error } = await supabase.rpc('revoke_role_by_email', { 
        user_email: email, 
        target_role: 'admin' 
      });
      
      if (error) {
        toast({ variant: 'destructive', title: 'Revoke failed', description: error.message });
      } else if (data && typeof data === 'object') {
        const result = data as { success: boolean; message: string };
        if (result.success) {
          toast({ title: 'Success', description: result.message });
          await loadAdmins();
        } else {
          toast({ variant: 'destructive', title: 'Revoke failed', description: result.message });
        }
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message || 'Unknown error' });
    }
    setAdminLoading(false);
  };

  const toggleAdminForUser = async (email: string | null, is_admin: boolean) => {
    if (!email) return;
    if (is_admin) {
      await revokeAdminByEmail(email);
    } else {
      setAdminLoading(true);
      try {
        const { data, error } = await supabase.rpc('grant_role_by_email', { 
          user_email: email, 
          target_role: 'admin' 
        });
        
        if (error) {
          toast({ variant: 'destructive', title: 'Grant failed', description: error.message });
        } else if (data && typeof data === 'object') {
          const result = data as { success: boolean; message: string };
          if (result.success) {
            toast({ title: 'Success', description: result.message });
            await loadAdmins();
          } else {
            toast({ variant: 'destructive', title: 'Grant failed', description: result.message });
          }
        }
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error', description: err.message || 'Unknown error' });
      }
      setAdminLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'revenue':
        return <RevenueAnalytics />;
      case 'customer-inquiries':
        return <CustomerInquiries />;
      case 'notification-settings':
        return <NotificationSettings />;
      case 'redeem-codes':
        return <RedeemCodesManagement />;
      case 'send-notification':
        return <SendNotification />;
      case 'notification-history':
        return <AdminNotificationHistory />;
      case 'pubg-uc-management':
        return renderPubgUCManagement();
      case 'packages':
        return renderUCPackages();
      case 'pubg-accounts':
        return <PubgAccountsManagement />;
      case 'blogs':
        return <BlogManagement />;
      case 'banners':
        return <PUBGBannersManagement />;
      case 'freefire-banners':
        return <FreeFireBannersManagement />;
      case 'bgmi-banners':
        return <BGMIBannersManagement />;
      case 'users':
        return <UsersManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'assets':
        return renderSiteAssets();
      case 'payment':
        return renderPaymentCredentials();
      case 'content':
        return renderContentBlocks();
      case 'admins':
        return renderAdminManagement();
      default:
        return <DashboardOverview />;
    }
  };

  // renderBannerManagement removed - now using PUBGBannersManagement component

  const renderUCPackages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">UC Packages Management</h1>
          <p className="text-gray-300">Manage and configure UC packages with professional controls</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary/10 px-4 py-2 rounded-lg">
            <div className="text-sm text-gray-400">Total Packages</div>
            <div className="text-2xl font-bold text-white">{ucPackages.length}</div>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            <div className="text-sm text-gray-400">Active</div>
            <div className="text-2xl font-bold text-green-700">
              {ucPackages.filter(p => (p as any).active !== false).length}
            </div>
          </div>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ucPackages.map((pkg, idx) => (
          <Card key={pkg.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">{pkg.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {(pkg as any).active !== false ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{pkg.uc_amount}</div>
                  <div className="text-xs text-muted-foreground">UC Amount</div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">₹{pkg.price}</div>
                  <div className="text-xs text-muted-foreground">Price</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                    <Label className="text-xs text-gray-300">Package Name</Label>
                  <Input 
                    value={pkg.name} 
                    onChange={(e) => {
                      const v = e.target.value; 
                      setUcPackages(prev => prev.map((x,i)=> i===idx?{...x,name:v}:x));
                    }}
                    className="h-8"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                      <Label className="text-xs text-gray-300">UC Amount</Label>
                    <Input 
                      type="number" 
                      value={pkg.uc_amount} 
                      onChange={(e) => {
                        const v = Number(e.target.value); 
                        setUcPackages(prev => prev.map((x,i)=> i===idx?{...x,uc_amount:v}:x));
                      }}
                      className="h-8"
                    />
                  </div>
                  <div>
                      <Label className="text-xs text-gray-300">Price (₹)</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={pkg.price} 
                      onChange={(e) => {
                        const v = Number(e.target.value); 
                        setUcPackages(prev => prev.map((x,i)=> i===idx?{...x,price:v}:x));
                      }}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => updateUCPackage(ucPackages[idx])}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => deleteUCPackage(pkg.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Package Card */}
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Add New Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Package Name</Label>
              <Input 
                placeholder="e.g., Starter Pack" 
                value={newUC.name} 
                onChange={(e)=> setNewUC(s=>({...s,name:e.target.value}))}
                className="h-8"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">UC Amount</Label>
                <Input 
                  type="number" 
                  placeholder="60" 
                  value={newUC.amount} 
                  onChange={(e)=> setNewUC(s=>({...s,amount:e.target.value}))}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Price (₹)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="99.00" 
                  value={newUC.price} 
                  onChange={(e)=> setNewUC(s=>({...s,price:e.target.value}))}
                  className="h-8"
                />
              </div>
            </div>

            <Button 
              onClick={addUCPackage} 
              className="w-full"
              disabled={!newUC.name || !newUC.amount || !newUC.price}
            >
              Add Package
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => {
                const percentage = prompt("Enter percentage increase (e.g., 10 for 10% increase):");
                if (percentage && !isNaN(Number(percentage))) {
                  const multiplier = 1 + (Number(percentage) / 100);
                  setUcPackages(prev => prev.map(pkg => ({
                    ...pkg,
                    price: Math.round(pkg.price * multiplier * 100) / 100
                  })));
                  toast({ title: `Prices increased by ${percentage}%` });
                }
              }}
            >
              Bulk Price Increase
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                ucPackages.forEach(pkg => updateUCPackage(pkg));
                toast({ title: "All packages updated" });
              }}
            >
              Save All Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPubgUCManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">PUBG UC Management</h1>
        <p className="text-gray-300">Comprehensive management of PUBG UC page content, SEO, and packages</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary/10 px-4 py-2 rounded-lg">
            <div className="text-sm text-gray-400">Total UC Packages</div>
            <div className="text-2xl font-bold text-white">{ucPackages.length}</div>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            <div className="text-sm text-gray-400">Content Blocks</div>
            <div className="text-2xl font-bold text-green-700">{pubgUCPageContent.length}</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="meta" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
          <TabsTrigger value="content">Content Blocks</TabsTrigger>
          <TabsTrigger value="packages">UC Packages</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="meta" className="space-y-6">
          <ComprehensiveSEOManager />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Blocks Management</CardTitle>
              <CardDescription>Manage content sections displayed on the PUBG UC page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {pubgUCPageContent.map((content, idx) => (
                  <Card key={content.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Content Key</Label>
                        <Input 
                          value={content.content_key}
                          onChange={(e) => {
                            const updated = [...pubgUCPageContent];
                            updated[idx] = {...content, content_key: e.target.value};
                            setPubgUCPageContent(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input 
                          value={content.title || ''}
                          onChange={(e) => {
                            const updated = [...pubgUCPageContent];
                            updated[idx] = {...content, title: e.target.value};
                            setPubgUCPageContent(updated);
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Content</Label>
                      <Textarea 
                        value={content.content || ''}
                        onChange={(e) => {
                          const updated = [...pubgUCPageContent];
                          updated[idx] = {...content, content: e.target.value};
                          setPubgUCPageContent(updated);
                        }}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <Label>Image URL</Label>
                        <Input 
                          value={content.image_url || ''}
                          onChange={(e) => {
                            const updated = [...pubgUCPageContent];
                            updated[idx] = {...content, image_url: e.target.value};
                            setPubgUCPageContent(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Order Position</Label>
                        <Input 
                          type="number"
                          value={content.order_position}
                          onChange={(e) => {
                            const updated = [...pubgUCPageContent];
                            updated[idx] = {...content, order_position: Number(e.target.value)};
                            setPubgUCPageContent(updated);
                          }}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button 
                          size="sm"
                          onClick={async () => {
                            const { error } = await supabase
                              .from('pubg_uc_page_content' as any)
                              .update({
                                content_key: content.content_key,
                                title: content.title,
                                content: content.content,
                                image_url: content.image_url,
                                order_position: content.order_position,
                                active: content.active
                              })
                              .eq('id', content.id);
                            if (error) {
                              toast({ variant: 'destructive', title: 'Error updating content', description: error.message });
                            } else {
                              toast({ title: 'Content updated successfully' });
                            }
                          }}
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant={content.active ? "default" : "secondary"}
                          onClick={async () => {
                            const updated = [...pubgUCPageContent];
                            updated[idx] = {...content, active: !content.active};
                            setPubgUCPageContent(updated);
                            const { error } = await supabase
                              .from('pubg_uc_page_content' as any)
                              .update({ active: !content.active })
                              .eq('id', content.id);
                            if (error) {
                              toast({ variant: 'destructive', title: 'Error toggling content' });
                            }
                          }}
                        >
                          {content.active ? 'Active' : 'Inactive'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Add New Content Block</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Content Key</Label>
                        <Input 
                          value={newContentBlock.content_key}
                          onChange={(e) => setNewContentBlock({...newContentBlock, content_key: e.target.value})}
                          placeholder="unique_content_key"
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input 
                          value={newContentBlock.title}
                          onChange={(e) => setNewContentBlock({...newContentBlock, title: e.target.value})}
                          placeholder="Content Title"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Content</Label>
                      <Textarea 
                        value={newContentBlock.content}
                        onChange={(e) => setNewContentBlock({...newContentBlock, content: e.target.value})}
                        placeholder="Content description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>Image URL</Label>
                        <Input 
                          value={newContentBlock.image_url}
                          onChange={(e) => setNewContentBlock({...newContentBlock, image_url: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label>Order Position</Label>
                        <Input 
                          type="number"
                          value={newContentBlock.order_position}
                          onChange={(e) => setNewContentBlock({...newContentBlock, order_position: Number(e.target.value)})}
                          placeholder="1"
                        />
                      </div>
                    </div>
                    <Button 
                      className="mt-4"
                      onClick={async () => {
                        if (!newContentBlock.content_key) {
                          toast({ variant: 'destructive', title: 'Content key is required' });
                          return;
                        }
                        const { data, error } = await supabase
                          .from('pubg_uc_page_content' as any)
                          .insert({
                            content_key: newContentBlock.content_key,
                            title: newContentBlock.title,
                            content: newContentBlock.content,
                            image_url: newContentBlock.image_url,
                            order_position: newContentBlock.order_position,
                            active: true
                          })
                          .select();
                        if (error) {
                          toast({ variant: 'destructive', title: 'Error adding content', description: error.message });
                        } else {
                          setPubgUCPageContent([...pubgUCPageContent, ...(data as any)]);
                          setNewContentBlock({ content_key: '', title: '', content: '', image_url: '', order_position: 0 });
                          toast({ title: 'Content block added successfully' });
                        }
                      }}
                      disabled={!newContentBlock.content_key}
                    >
                      Add Content Block
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>UC Packages Management</CardTitle>
              <CardDescription>Manage all {ucPackages.length} PUBG UC packages with advanced editing</CardDescription>
            </CardHeader>
            <CardContent>
              {renderUCPackages()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your changes will appear on the live PUBG UC page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-center text-muted-foreground">Live preview will be shown here</p>
                <Button 
                  className="mt-4 mx-auto block"
                  onClick={() => window.open('/', '_blank')}
                >
                  Open Live Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderSiteAssets = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Site Assets Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Site Assets</CardTitle>
          <CardDescription>Upload images and map them to asset keys (e.g., logo).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="assetKey">Asset Key</Label>
              <Input id="assetKey" placeholder="e.g., logo" value={assetKey} onChange={(e)=> setAssetKey(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="assetFile">Image File</Label>
              <Input id="assetFile" type="file" accept="image/*" onChange={(e)=> setAssetFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="mt-3">
            <Button onClick={uploadAsset} disabled={!assetKey || !assetFile}>Upload & Save</Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {assets.map(a => (
              <div key={a.id} className="border rounded-md p-3">
                <div className="text-sm font-medium mb-2">{a.asset_key}</div>
                <img src={a.url} alt={`${a.asset_key} image`} loading="lazy" className="rounded" />
                <a href={a.url} target="_blank" rel="noopener" className="text-xs underline mt-2 inline-block">Open</a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentCredentials = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment Credentials</CardTitle>
          <CardDescription>Manage provider credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creds.map((c, idx) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Input value={c.name} onChange={(e)=> setCreds(prev=> prev.map((x,i)=> i===idx?{...x,name:e.target.value}:x))} />
                    </TableCell>
                    <TableCell>
                      <Input value={c.method} onChange={(e)=> setCreds(prev=> prev.map((x,i)=> i===idx?{...x,method:e.target.value}:x))} />
                    </TableCell>
                    <TableCell>
                      <Textarea value={c.value} onChange={(e)=> setCreds(prev=> prev.map((x,i)=> i===idx?{...x,value:e.target.value}:x))} />
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" onClick={()=> saveCred(creds[idx])}>Save</Button>
                      <Button size="sm" variant="destructive" onClick={()=> deleteCred(c.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <Input placeholder="Name" value={newCred.name} onChange={(e)=> setNewCred(s=>({...s,name:e.target.value}))} />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Method" value={newCred.method} onChange={(e)=> setNewCred(s=>({...s,method:e.target.value}))} />
                  </TableCell>
                  <TableCell>
                    <Textarea placeholder="Value" value={newCred.value} onChange={(e)=> setNewCred(s=>({...s,value:e.target.value}))} />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={addCred}>Add</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContentBlocks = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Content Blocks Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Content Blocks</CardTitle>
          <CardDescription>Create and edit site content blocks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocks.map((b, idx) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <Input value={b.content_key} onChange={(e)=> setBlocks(prev=> prev.map((x,i)=> i===idx?{...x,content_key:e.target.value}:x))} />
                    </TableCell>
                    <TableCell>
                      <Input value={b.title || ''} onChange={(e)=> setBlocks(prev=> prev.map((x,i)=> i===idx?{...x,title:e.target.value}:x))} />
                    </TableCell>
                    <TableCell>
                      <Textarea value={b.content || ''} onChange={(e)=> setBlocks(prev=> prev.map((x,i)=> i===idx?{...x,content:e.target.value}:x))} />
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" onClick={()=> saveBlock(blocks[idx])}>Save</Button>
                      <Button size="sm" variant="destructive" onClick={()=> deleteBlock(b.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <Input placeholder="Key" value={newBlock.content_key} onChange={(e)=> setNewBlock(s=>({...s,content_key:e.target.value}))} />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Title" value={newBlock.title} onChange={(e)=> setNewBlock(s=>({...s,title:e.target.value}))} />
                  </TableCell>
                  <TableCell>
                    <Textarea placeholder="Content" value={newBlock.content} onChange={(e)=> setNewBlock(s=>({...s,content:e.target.value}))} />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={addBlock}>Add</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminManagement = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
          <CardDescription>Assign or revoke admin access.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="adminEmail">Grant admin by email</Label>
              <div className="flex gap-2 mt-1.5">
                <Input id="adminEmail" placeholder="user@example.com" value={adminEmail} onChange={(e)=> setAdminEmail(e.target.value)} />
                <Button onClick={grantAdmin} disabled={!adminEmail || adminLoading}>Grant</Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Current admins</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Since</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((a) => (
                    <TableRow key={a.user_id}>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>{new Date(a.since).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="destructive" onClick={()=> revokeAdminByEmail(a.email)}>Revoke</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">All users</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.user_id}>
                      <TableCell>{u.email || '-'}</TableCell>
                      <TableCell>{u.is_admin ? 'Admin' : 'User'}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={()=> toggleAdminForUser(u.email, u.is_admin)}>
                          {u.is_admin ? 'Revoke' : 'Grant'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="dark min-h-screen flex w-full bg-midasbuy-darkBlue">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 min-w-0 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <header className="flex items-center gap-4 border-b border-border/20 bg-black/20 backdrop-blur px-4 py-3 lg:px-6">
          <AdminSidebarTrigger setIsOpen={setSidebarOpen} />
          <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
        </header>
        
        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-x-hidden p-4 lg:p-6 text-foreground">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
