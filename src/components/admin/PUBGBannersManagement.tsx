import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Upload, Monitor, Smartphone, Image, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCcw, Sun, Palette } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface PUBGBanner {
  id: string;
  banner_key: string;
  title: string | null;
  description: string | null;
  image_url: string;
  page_name: string;
  device_type: string | null;
  is_active: boolean | null;
  display_order: number | null;
  position_x: number | null;
  position_y: number | null;
  zoom_level: number | null;
  light_intensity: number | null;
  light_color: string | null;
  light_spread: number | null;
  light_enabled: boolean | null;
}

const PUBG_BANNER_TYPES = [
  { key: 'pubg_uc_desktop', title: 'PUBG UC Desktop Banner', deviceType: 'desktop', icon: Monitor, hasPositionControl: true },
  { key: 'pubg_uc_mobile', title: 'PUBG UC Mobile Banner', deviceType: 'mobile', icon: Smartphone, hasPositionControl: true },
  { key: 'pubg_uc_characters', title: 'PUBG Characters Image (Mobile)', deviceType: 'mobile', icon: Image, hasPositionControl: true },
];

export default function PUBGBannersManagement() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<PUBGBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_banners')
      .select('*')
      .eq('page_name', 'PUBG UC')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
      toast({ variant: 'destructive', title: 'Failed to fetch banners', description: error.message });
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const getBannerByKey = (key: string): PUBGBanner | undefined => {
    return banners.find(b => b.banner_key === key);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `pubg-banners/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({ variant: 'destructive', title: 'Upload failed', description: uploadError.message });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(fileName);
    return publicUrl;
  };

  const deleteOldImage = async (imageUrl: string) => {
    // Extract path from URL if it's a supabase storage URL
    if (imageUrl.includes('site-assets')) {
      const path = imageUrl.split('site-assets/')[1];
      if (path) {
        await supabase.storage.from('site-assets').remove([path]);
      }
    }
  };

  const handleFileUpload = async (bannerKey: string, file: File, bannerType: typeof PUBG_BANNER_TYPES[0]) => {
    setUploadingFor(bannerKey);
    
    const existingBanner = getBannerByKey(bannerKey);
    
    // Upload new image first
    const imageUrl = await uploadImage(file);
    if (!imageUrl) {
      setUploadingFor(null);
      return;
    }

    // Delete old image if exists
    if (existingBanner?.image_url) {
      await deleteOldImage(existingBanner.image_url);
    }
    
    if (existingBanner) {
      // Update existing banner
      const { error } = await supabase
        .from('site_banners')
        .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
        .eq('id', existingBanner.id);

      if (error) {
        toast({ variant: 'destructive', title: 'Update failed', description: error.message });
      } else {
        toast({ title: 'Banner updated successfully!' });
        await fetchBanners();
      }
    } else {
      // Create new banner
      const { error } = await supabase
        .from('site_banners')
        .insert({
          banner_key: bannerKey,
          title: bannerType.title,
          page_name: 'PUBG UC',
          device_type: bannerType.deviceType,
          image_url: imageUrl,
          is_active: true,
          display_order: PUBG_BANNER_TYPES.findIndex(t => t.key === bannerKey),
        });

      if (error) {
        toast({ variant: 'destructive', title: 'Create failed', description: error.message });
      } else {
        toast({ title: 'Banner created successfully!' });
        await fetchBanners();
      }
    }
    
    setUploadingFor(null);
  };

  const toggleBannerActive = async (bannerKey: string) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const { error } = await supabase
      .from('site_banners')
      .update({ is_active: !banner.is_active, updated_at: new Date().toISOString() })
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Update failed', description: error.message });
    } else {
      toast({ title: `Banner ${!banner.is_active ? 'activated' : 'deactivated'}` });
      await fetchBanners();
    }
  };

  const deleteBanner = async (bannerKey: string) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const { error } = await supabase
      .from('site_banners')
      .delete()
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Delete failed', description: error.message });
    } else {
      toast({ title: 'Banner deleted successfully!' });
      await fetchBanners();
    }
  };

  const updatePosition = async (bannerKey: string, direction: 'up' | 'down' | 'left' | 'right') => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const step = 5; // pixels to move
    let newX = banner.position_x || 0;
    let newY = banner.position_y || 0;

    switch (direction) {
      case 'up': newY -= step; break;
      case 'down': newY += step; break;
      case 'left': newX -= step; break;
      case 'right': newX += step; break;
    }

    const { error } = await supabase
      .from('site_banners')
      .update({ position_x: newX, position_y: newY, updated_at: new Date().toISOString() })
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Position update failed', description: error.message });
    } else {
      await fetchBanners();
    }
  };

  const resetPosition = async (bannerKey: string) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const { error } = await supabase
      .from('site_banners')
      .update({ position_x: 0, position_y: 0, updated_at: new Date().toISOString() })
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Reset failed', description: error.message });
    } else {
      toast({ title: 'Position reset to default' });
      await fetchBanners();
    }
  };

  const updateZoom = async (bannerKey: string, change: number) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const currentZoom = banner.zoom_level || 100;
    const newZoom = Math.max(10, Math.min(200, currentZoom + change)); // Limit between 10% and 200%

    const { error } = await supabase
      .from('site_banners')
      .update({ zoom_level: newZoom, updated_at: new Date().toISOString() })
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Zoom update failed', description: error.message });
    } else {
      await fetchBanners();
    }
  };

  const resetZoom = async (bannerKey: string) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const { error } = await supabase
      .from('site_banners')
      .update({ zoom_level: 100, updated_at: new Date().toISOString() })
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Reset zoom failed', description: error.message });
    } else {
      toast({ title: 'Zoom reset to 100%' });
      await fetchBanners();
    }
  };

  // Light effect functions
  const updateLightIntensity = async (bannerKey: string, intensity: number) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const { error } = await supabase
      .from('site_banners')
      .update({ light_intensity: intensity, updated_at: new Date().toISOString() })
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Update failed', description: error.message });
    } else {
      await fetchBanners();
    }
  };

  const updateLightColor = async (bannerKey: string, color: string) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const { error } = await supabase
      .from('site_banners')
      .update({ light_color: color, updated_at: new Date().toISOString() })
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Update failed', description: error.message });
    } else {
      await fetchBanners();
    }
  };

  const updateLightSpread = async (bannerKey: string, spread: number) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const { error } = await supabase
      .from('site_banners')
      .update({ light_spread: spread, updated_at: new Date().toISOString() })
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Update failed', description: error.message });
    } else {
      await fetchBanners();
    }
  };

  const toggleLightEnabled = async (bannerKey: string) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const { error } = await supabase
      .from('site_banners')
      .update({ light_enabled: !banner.light_enabled, updated_at: new Date().toISOString() })
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Update failed', description: error.message });
    } else {
      toast({ title: `Light effect ${!banner.light_enabled ? 'enabled' : 'disabled'}` });
      await fetchBanners();
    }
  };

  const resetLightEffect = async (bannerKey: string) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;

    const { error } = await supabase
      .from('site_banners')
      .update({ 
        light_intensity: 45, 
        light_color: '#003C78', 
        light_spread: 70,
        light_enabled: true,
        updated_at: new Date().toISOString() 
      })
      .eq('id', banner.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Reset failed', description: error.message });
    } else {
      toast({ title: 'Light effect reset to defaults' });
      await fetchBanners();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">PUBG Banners</h1>
        <p className="text-muted-foreground">Manage PUBG UC page banners and character images. Changes appear instantly on the website.</p>
      </div>

      <div className="grid gap-6">
        {PUBG_BANNER_TYPES.map((bannerType) => {
          const banner = getBannerByKey(bannerType.key);
          const Icon = bannerType.icon;
          
          return (
            <Card key={bannerType.key} className="bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bannerType.title}</CardTitle>
                      <CardDescription>
                        {bannerType.deviceType === 'desktop' ? 'Desktop view' : 'Mobile view'} • {bannerType.key}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {banner && (
                      <>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`active-${bannerType.key}`} className="text-sm">
                            {banner.is_active ? 'Active' : 'Inactive'}
                          </Label>
                          <Switch
                            id={`active-${bannerType.key}`}
                            checked={banner.is_active || false}
                            onCheckedChange={() => toggleBannerActive(bannerType.key)}
                          />
                        </div>
                        <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                          {banner.is_active ? 'Live' : 'Hidden'}
                        </Badge>
                      </>
                    )}
                    {!banner && (
                      <Badge variant="outline">Not Set</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Preview */}
                {banner?.image_url ? (
                  <div className="relative">
                    <img 
                      src={banner.image_url} 
                      alt={bannerType.title}
                      className="w-full max-w-lg rounded-lg shadow-lg border border-border"
                    />
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteBanner(bannerType.key)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-lg h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                    <div className="text-center text-muted-foreground">
                      <Icon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No image uploaded</p>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-3">
                  <Label htmlFor={`upload-${bannerType.key}`} className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      <Upload className="h-4 w-4" />
                      {uploadingFor === bannerType.key ? 'Uploading...' : (banner ? 'Replace Image' : 'Upload Image')}
                    </div>
                    <Input
                      id={`upload-${bannerType.key}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingFor === bannerType.key}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(bannerType.key, file, bannerType);
                        }
                      }}
                    />
                  </Label>
                  {banner?.image_url && (
                    <p className="text-xs text-muted-foreground truncate max-w-xs">
                      {banner.image_url.split('/').pop()}
                    </p>
                  )}
                </div>

                {/* Position & Zoom Controls - For all banners */}
                {bannerType.hasPositionControl && banner && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    {/* Position Controls */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Position Adjustment</Label>
                        <span className="text-xs text-muted-foreground">
                          X: {banner.position_x || 0}px, Y: {banner.position_y || 0}px
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updatePosition(bannerType.key, 'up')}
                            className="h-8 w-8"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updatePosition(bannerType.key, 'left')}
                              className="h-8 w-8"
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updatePosition(bannerType.key, 'right')}
                              className="h-8 w-8"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updatePosition(bannerType.key, 'down')}
                            className="h-8 w-8"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => resetPosition(bannerType.key)}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset Position
                        </Button>
                      </div>
                    </div>

                    {/* Zoom Controls */}
                    <div className="space-y-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Zoom Level</Label>
                        <span className="text-xs text-muted-foreground font-mono">
                          {banner.zoom_level || 100}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateZoom(bannerType.key, -10)}
                          className="h-8"
                        >
                          <ZoomOut className="h-4 w-4 mr-1" />
                          -10%
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateZoom(bannerType.key, -5)}
                          className="h-8"
                        >
                          -5%
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateZoom(bannerType.key, 5)}
                          className="h-8"
                        >
                          +5%
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateZoom(bannerType.key, 10)}
                          className="h-8"
                        >
                          <ZoomIn className="h-4 w-4 mr-1" />
                          +10%
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => resetZoom(bannerType.key)}
                          className="h-8"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Use arrows to adjust position and zoom buttons to resize. Changes apply instantly.
                    </p>
                  </div>
                )}

                {/* Light Effect Controls - Only for Mobile Banner */}
                {bannerType.key === 'pubg_uc_mobile' && banner && (
                  <div className="space-y-4 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-blue-400" />
                        <Label className="text-sm font-medium">Light Effect</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="light-enabled" className="text-sm">
                          {banner.light_enabled ? 'On' : 'Off'}
                        </Label>
                        <Switch
                          id="light-enabled"
                          checked={banner.light_enabled ?? true}
                          onCheckedChange={() => toggleLightEnabled(bannerType.key)}
                        />
                      </div>
                    </div>

                    {/* Light Intensity */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Intensity</Label>
                        <span className="text-xs text-muted-foreground font-mono">
                          {banner.light_intensity ?? 45}%
                        </span>
                      </div>
                      <Slider
                        value={[banner.light_intensity ?? 45]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => updateLightIntensity(bannerType.key, value[0])}
                        className="w-full"
                      />
                    </div>

                    {/* Light Spread */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Spread</Label>
                        <span className="text-xs text-muted-foreground font-mono">
                          {banner.light_spread ?? 70}%
                        </span>
                      </div>
                      <Slider
                        value={[banner.light_spread ?? 70]}
                        min={30}
                        max={100}
                        step={5}
                        onValueChange={(value) => updateLightSpread(bannerType.key, value[0])}
                        className="w-full"
                      />
                    </div>

                    {/* Light Color */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Palette className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm">Color</Label>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {banner.light_color || '#003C78'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={banner.light_color || '#003C78'}
                          onChange={(e) => updateLightColor(bannerType.key, e.target.value)}
                          className="w-12 h-8 p-1 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={banner.light_color || '#003C78'}
                          onChange={(e) => updateLightColor(bannerType.key, e.target.value)}
                          placeholder="#003C78"
                          className="flex-1 h-8 text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Live Preview - Full left side light */}
                    <div className="space-y-2">
                      <Label className="text-sm">Preview (Full Left Side Light)</Label>
                      <div 
                        className="w-full h-24 rounded-lg border border-border overflow-hidden relative"
                        style={{ background: '#1a1a2e' }}
                      >
                        {/* Light from full left side */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to right, ${banner.light_color || '#003C78'}${Math.round((banner.light_intensity ?? 45) * 1.8).toString(16).padStart(2, '0')} 0%, ${banner.light_color || '#003C78'}${Math.round((banner.light_intensity ?? 45) * 0.8).toString(16).padStart(2, '0')} 25%, transparent ${banner.light_spread ?? 70}%)`
                          }}
                        />
                        <div className="absolute bottom-2 left-2 text-[10px] text-white/70 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400/50"></span>
                          Full left side light
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => resetLightEffect(bannerType.key)}
                      className="w-full"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset Light Effect to Defaults
                    </Button>
                  </div>
                )}

                {/* Size Recommendations */}
                <p className="text-xs text-muted-foreground">
                  {bannerType.deviceType === 'desktop' 
                    ? 'Recommended: 1920x400 pixels for best quality'
                    : bannerType.key === 'pubg_uc_characters'
                    ? 'Recommended: PNG with transparent background, 800x800 pixels'
                    : 'Recommended: 750x400 pixels for best quality'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• <strong>Desktop Banner:</strong> Shows on the PUBG UC page for desktop users</p>
          <p>• <strong>Mobile Banner:</strong> Shows on the PUBG UC page for mobile users (if set)</p>
          <p>• <strong>Characters Image:</strong> Decorative image shown behind the "Enter Player ID" button on mobile</p>
          <p>• Toggle the switch to show/hide any banner without deleting it</p>
          <p>• Changes are applied instantly - no need to refresh</p>
        </CardContent>
      </Card>
    </div>
  );
}
