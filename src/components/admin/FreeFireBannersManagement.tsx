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

interface FreeFireBanner {
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

const FREEFIRE_BANNER_TYPES = [
  { key: 'freefire_desktop', title: 'Free Fire Desktop Banner', deviceType: 'desktop', icon: Monitor, hasPositionControl: true },
  { key: 'freefire_mobile', title: 'Free Fire Mobile Banner', deviceType: 'mobile', icon: Smartphone, hasPositionControl: true },
  { key: 'freefire_characters', title: 'Free Fire Characters Image (Mobile)', deviceType: 'mobile', icon: Image, hasPositionControl: true },
];

export default function FreeFireBannersManagement() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<FreeFireBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_banners')
      .select('*')
      .eq('page_name', 'Free Fire')
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

  const getBannerByKey = (key: string): FreeFireBanner | undefined => {
    return banners.find(b => b.banner_key === key);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `freefire-banners/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({ variant: 'destructive', title: 'Upload failed', description: uploadError.message });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleFileUpload = async (bannerKey: string, file: File) => {
    setUploadingFor(bannerKey);
    const imageUrl = await uploadImage(file);
    
    if (imageUrl) {
      const existingBanner = getBannerByKey(bannerKey);
      const bannerType = FREEFIRE_BANNER_TYPES.find(t => t.key === bannerKey);
      
      if (existingBanner) {
        await supabase
          .from('site_banners')
          .update({ image_url: imageUrl })
          .eq('id', existingBanner.id);
      } else {
        await supabase
          .from('site_banners')
          .insert({
            banner_key: bannerKey,
            title: bannerType?.title || bannerKey,
            page_name: 'Free Fire',
            device_type: bannerType?.deviceType || 'mobile',
            image_url: imageUrl,
            is_active: true,
            display_order: FREEFIRE_BANNER_TYPES.findIndex(t => t.key === bannerKey),
            position_x: 0,
            position_y: 0,
            zoom_level: 100,
            light_enabled: true,
            light_intensity: 45,
            light_color: '#FF6B35',
            light_spread: 70
          });
      }
      
      toast({ title: 'Banner uploaded successfully' });
      fetchBanners();
    }
    setUploadingFor(null);
  };

  const updateBannerPosition = async (bannerId: string, updates: Partial<FreeFireBanner>) => {
    await supabase.from('site_banners').update(updates).eq('id', bannerId);
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, ...updates } : b));
  };

  const toggleBannerActive = async (bannerId: string, isActive: boolean) => {
    await supabase.from('site_banners').update({ is_active: isActive }).eq('id', bannerId);
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, is_active: isActive } : b));
    toast({ title: `Banner ${isActive ? 'activated' : 'deactivated'}` });
  };

  const updateLightSettings = async (bannerId: string, updates: Partial<FreeFireBanner>) => {
    await supabase.from('site_banners').update(updates).eq('id', bannerId);
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, ...updates } : b));
  };

  const resetLightEffect = async (bannerId: string) => {
    const updates = {
      light_enabled: true,
      light_intensity: 45,
      light_color: '#FF6B35',
      light_spread: 70
    };
    await supabase.from('site_banners').update(updates).eq('id', bannerId);
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, ...updates } : b));
    toast({ title: 'Light effect reset to defaults' });
  };

  const deleteBanner = async (bannerKey: string) => {
    const banner = getBannerByKey(bannerKey);
    if (!banner) return;
    
    await supabase.from('site_banners').delete().eq('id', banner.id);
    setBanners(prev => prev.filter(b => b.id !== banner.id));
    toast({ title: 'Banner deleted successfully' });
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Free Fire Banners</h2>
          <p className="text-gray-400">Manage Free Fire page banners and images</p>
        </div>
      </div>

      <div className="grid gap-6">
        {FREEFIRE_BANNER_TYPES.map((bannerType) => {
          const banner = getBannerByKey(bannerType.key);
          const IconComponent = bannerType.icon;
          
          return (
            <Card key={bannerType.key} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-orange-400" />
                    <div>
                      <CardTitle className="text-white">{bannerType.title}</CardTitle>
                      <CardDescription className="text-gray-400">{bannerType.deviceType} view</CardDescription>
                    </div>
                  </div>
                  {banner && (
                    <div className="flex items-center gap-2">
                      <Badge variant={banner.is_active ? "default" : "secondary"}>
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        checked={banner.is_active || false}
                        onCheckedChange={(checked) => toggleBannerActive(banner.id, checked)}
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {banner?.image_url && (
                  <div className="relative rounded-lg overflow-hidden bg-gray-900 p-2">
                    <img 
                      src={banner.image_url} 
                      alt={bannerType.title}
                      className="w-full h-32 object-contain rounded"
                      style={{
                        transform: `translate(${(banner.position_x || 0) / 10}px, ${(banner.position_y || 0) / 10}px) scale(${(banner.zoom_level || 100) / 100})`
                      }}
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
                )}
                
                <div className="flex gap-2">
                  <Label htmlFor={`upload-${bannerType.key}`} className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors">
                      <Upload className="h-4 w-4" />
                      {uploadingFor === bannerType.key ? 'Uploading...' : (banner ? 'Replace' : 'Upload')}
                    </div>
                    <Input
                      id={`upload-${bannerType.key}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(bannerType.key, file);
                      }}
                    />
                  </Label>
                </div>

                {banner && bannerType.hasPositionControl && (
                  <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                    <Label className="text-white text-sm">Position & Zoom Controls</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400 text-xs">X Position</Label>
                        <Slider
                          value={[banner.position_x || 0]}
                          min={-100}
                          max={100}
                          step={1}
                          onValueChange={([val]) => updateBannerPosition(banner.id, { position_x: val })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-400 text-xs">Y Position</Label>
                        <Slider
                          value={[banner.position_y || 0]}
                          min={-100}
                          max={100}
                          step={1}
                          onValueChange={([val]) => updateBannerPosition(banner.id, { position_y: val })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs">Zoom Level: {banner.zoom_level || 100}%</Label>
                      <Slider
                        value={[banner.zoom_level || 100]}
                        min={50}
                        max={200}
                        step={5}
                        onValueChange={([val]) => updateBannerPosition(banner.id, { zoom_level: val })}
                      />
                    </div>
                    
                    {/* Light Effect Controls - Only for mobile banner */}
                    {bannerType.key === 'freefire_mobile' && (
                      <div className="space-y-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-orange-400" />
                            <Label className="text-white text-sm">Light Effect</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={banner.light_enabled || false}
                              onCheckedChange={(checked) => updateLightSettings(banner.id, { light_enabled: checked })}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resetLightEffect(banner.id)}
                              className="text-xs text-gray-400 hover:text-white"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Reset
                            </Button>
                          </div>
                        </div>

                        {banner.light_enabled && (
                          <div className="space-y-4">
                            {/* Color Picker */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Palette className="h-4 w-4 text-gray-400" />
                                <Label className="text-gray-400 text-xs">Color</Label>
                              </div>
                              <Input
                                type="color"
                                value={banner.light_color || '#FF6B35'}
                                onChange={(e) => updateLightSettings(banner.id, { light_color: e.target.value })}
                                className="w-12 h-8 p-1 cursor-pointer bg-transparent border-gray-600"
                              />
                              <span className="text-xs text-gray-500">{banner.light_color || '#FF6B35'}</span>
                            </div>

                            {/* Intensity Slider */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-gray-400 text-xs">Intensity</Label>
                                <span className="text-xs text-gray-500">{banner.light_intensity || 45}%</span>
                              </div>
                              <Slider
                                value={[banner.light_intensity || 45]}
                                onValueChange={([val]) => updateLightSettings(banner.id, { light_intensity: val })}
                                min={0}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                            </div>

                            {/* Spread Slider */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-gray-400 text-xs">Spread</Label>
                                <span className="text-xs text-gray-500">{banner.light_spread || 70}%</span>
                              </div>
                              <Slider
                                value={[banner.light_spread || 70]}
                                onValueChange={([val]) => updateLightSettings(banner.id, { light_spread: val })}
                                min={20}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Size recommendations */}
                <p className="text-xs text-gray-500">
                  {bannerType.deviceType === 'desktop' 
                    ? 'Recommended: 1920x600px for desktop screens.'
                    : bannerType.key.includes('characters')
                    ? 'Recommended: 800x800px transparent PNG.'
                    : 'Recommended: 800x400px for mobile display.'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <Card className="bg-gray-800/30 border-gray-700">
        <CardHeader>
          <CardTitle className="text-base text-white">How it works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-400 space-y-2">
          <p>• Upload separate images for desktop and mobile for optimal display.</p>
          <p>• Use position and zoom controls to fine-tune banner placement.</p>
          <p>• Mobile banner supports light effect (ambient glow from left side).</p>
          <p>• Toggle Active switch to show/hide banners without deleting.</p>
          <p>• Changes apply instantly - refresh Free Fire page to see updates.</p>
        </CardContent>
      </Card>
    </div>
  );
}
