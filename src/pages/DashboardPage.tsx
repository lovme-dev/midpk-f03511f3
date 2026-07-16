import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Home, User, Mail, Calendar, Gamepad2, ShoppingBag, Save, Link as LinkIcon, Edit3, History, HelpCircle, Upload } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

interface GameProfile {
  id: string;
  game: string;
  player_id: string;
  username: string | null;
  server: string | null;
  region: string | null;
  updated_at: string;
}

interface PurchaseHistory {
  id: string;
  packageName: string;
  price: number;
  date: string;
  status: string;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gameProfile, setGameProfile] = useState<GameProfile | null>(null);
  const [recentPurchases, setRecentPurchases] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingGame, setIsEditingGame] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', avatar_url: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [gameForm, setGameForm] = useState({ player_id: '', username: '', server: '', region: '' });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
        setProfileForm({
          full_name: profileData?.full_name || '',
          avatar_url: '' // Database doesn't store avatar_url yet
        });
      }

      // Game profiles table doesn't exist yet - commenting out
      /*
      // Fetch game profile
      const { data: gameData, error: gameError } = await supabase
        .from('game_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('game', 'pubg_mobile')
        .maybeSingle();

      if (gameError) {
        console.error('Error fetching game profile:', gameError);
      } else {
        setGameProfile(gameData);
        if (gameData) {
          setGameForm({
            player_id: gameData.player_id || '',
            username: gameData.username || '',
            server: gameData.server || '',
            region: gameData.region || ''
          });
        }
      }
      */

      // Load recent purchases from localStorage
      const orderHistory = localStorage.getItem('orderHistory');
      if (orderHistory) {
        const purchases = JSON.parse(orderHistory);
        setRecentPurchases(purchases.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!user || !profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileForm.full_name,
          avatar_url: profileForm.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...profileForm });
      setIsEditingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveGameProfile = async () => {
    if (!user) return;
    
    if (gameForm.player_id && (gameForm.player_id.length < 8 || gameForm.player_id.length > 12 || !/^\d+$/.test(gameForm.player_id))) {
      toast({
        title: "Invalid Player ID",
        description: "PUBG Player ID must be 8-12 digits only.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Game profiles table doesn't exist yet - showing toast instead
      toast({
        title: "Feature Coming Soon",
        description: "Game profile storage is currently under development.",
        variant: "destructive",
      });
      return;
      
      /* Commented out until game_profiles table exists
      if (gameProfile) {
        // Update existing
        const { error } = await supabase
          .from('game_profiles')
          .update({
            player_id: gameForm.player_id,
            username: gameForm.username,
            server: gameForm.server,
            region: gameForm.region
          })
          .eq('id', gameProfile.id);

        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('game_profiles')
          .insert({
            user_id: user.id,
            game: 'pubg_mobile',
            player_id: gameForm.player_id,
            username: gameForm.username,
            server: gameForm.server,
            region: gameForm.region
          })
          .select()
          .single();

        if (error) throw error;
        setGameProfile(data);
      }

      setIsEditingGame(false);
      toast({
        title: "Game Profile Saved",
        description: "Your PUBG profile has been saved to the cloud.",
      });
      
      fetchData(); // Refresh data
      */
    } catch (error) {
      console.error('Error saving game profile:', error);
      toast({
        title: "Error",
        description: "Failed to save game profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const syncFromLocal = () => {
    const playerID = localStorage.getItem('playerID');
    const pubgUsername = localStorage.getItem('pubgUsername');
    
    if (playerID || pubgUsername) {
      setGameForm({
        player_id: playerID || '',
        username: pubgUsername || '',
        server: gameForm.server,
        region: gameForm.region
      });
      toast({
        title: "Synced from Local",
        description: "Player data has been loaded from local storage.",
      });
    } else {
      toast({
        title: "No Local Data",
        description: "No player data found in local storage.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>My Dashboard - Midasbuy</title>
      </Helmet>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-600/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-400/20 to-blue-600/20 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link to="/">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Home className="h-4 w-4 mr-2" />
                Back Home
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Account Overview */}
            <Card className="lg:col-span-2 animate-fade-in bg-white/10 border-white/20 backdrop-blur-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Overview
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditingProfile ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={isEditingProfile ? profileForm.avatar_url : profile?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {getInitials(isEditingProfile ? profileForm.full_name : (profile?.full_name || user?.email || ''))}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {isEditingProfile ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Full Name"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Change Avatar</label>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="avatar-upload"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-center p-2 border border-white/20 rounded-md bg-white/5 hover:bg-white/10 text-white/80">
                              <Upload className="h-4 w-4 mr-2" />
                              {avatarFile ? avatarFile.name : 'Choose new avatar'}
                            </div>
                          </label>
                        </div>
                      </div>
                      <Button onClick={saveProfile} className="mr-2 bg-white/20 hover:bg-white/30 text-white border-white/20">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-white">
                        {profile?.full_name || 'No name provided'}
                      </h3>
                      <p className="text-white/70 flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {profile?.email || user?.email}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Account Status
                  </label>
                  <Badge variant={user?.email_confirmed_at ? 'default' : 'secondary'} className="w-fit">
                    {user?.email_confirmed_at ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </label>
                  <p className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    {profile?.created_at ? formatDate(profile.created_at) : 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="animate-fade-in bg-white/10 border-white/20 backdrop-blur-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/#packages">
                <Button variant="outline" className="w-full justify-start hover-scale bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Buy UC Packages
                </Button>
              </Link>
              <Link to="/purchase-history">
                <Button variant="outline" className="w-full justify-start hover-scale bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <History className="h-4 w-4 mr-2" />
                  Purchase History
                </Button>
              </Link>
              <Link to="/help-center">
                <Button variant="outline" className="w-full justify-start hover-scale bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            {/* Game Profiles */}
            <Card className="animate-fade-in bg-white/10 border-white/20 backdrop-blur-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  PUBG Mobile Profile
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingGame(!isEditingGame)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditingGame ? 'Cancel' : 'Edit'}
                </Button>
              </div>
              <CardDescription>
                Cloud-synced gaming profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingGame ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Player ID</label>
                    <Input
                      placeholder="Enter your 8-12 digit PUBG Player ID"
                      value={gameForm.player_id}
                      onChange={(e) => setGameForm({...gameForm, player_id: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <Input
                      placeholder="Enter your PUBG username"
                      value={gameForm.username}
                      onChange={(e) => setGameForm({...gameForm, username: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Server</label>
                      <Input
                        placeholder="e.g., Asia"
                        value={gameForm.server}
                        onChange={(e) => setGameForm({...gameForm, server: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Region</label>
                      <Input
                        placeholder="e.g., Pakistan"
                        value={gameForm.region}
                        onChange={(e) => setGameForm({...gameForm, region: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveGameProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Cloud
                    </Button>
                    <Button variant="outline" onClick={syncFromLocal}>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Sync from Local
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {gameProfile ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Player ID</label>
                          <p className="font-mono">{gameProfile.player_id}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Username</label>
                          <p>{gameProfile.username || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Server</label>
                          <p>{gameProfile.server || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Region</label>
                          <p>{gameProfile.region || 'Not set'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Saved to cloud • Last updated {formatDate(gameProfile.updated_at)}
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Gamepad2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No PUBG profile saved</p>
                      <p className="text-sm">Click Edit to add your gaming details</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Purchases */}
          <Card className="animate-fade-in bg-white/10 border-white/20 backdrop-blur-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Recent Purchases
                </CardTitle>
                <Link to="/purchase-history">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <CardDescription>
                Your latest purchase history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentPurchases.length > 0 ? (
                <div className="space-y-3">
                  {recentPurchases.map((purchase, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{purchase.packageName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(purchase.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${purchase.price}</p>
                        <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {purchase.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No purchases yet</p>
                  <p className="text-sm">Start by buying UC packages</p>
                  <Link to="/purchase">
                    <Button className="mt-4" size="sm">
                      Browse Packages
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}