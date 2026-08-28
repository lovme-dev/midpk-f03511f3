import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Pencil, Trash2, Upload, ShoppingBag } from 'lucide-react';
import { staticShopImages } from '@/data/shopProducts';
import type { ShopProductRow } from '@/hooks/useShopProducts';

const CATEGORIES = [
  { id: 'rp', label: 'RP (Royal Pass)' },
  { id: 'growthgift', label: 'Growthgift' },
  { id: 'subscriptiongift', label: 'Subscriptiongift' },
  { id: 'weekly-deal', label: 'Weekly Deal Pack' },
];

const emptyForm: ShopProductRow = {
  id: '',
  name: '',
  short_title: '',
  price: 0,
  original_price: null,
  price_prefix: 'From',
  image_url: null,
  category: 'growthgift',
  discount: null,
  badge: null,
  badge_color: null,
  sort_order: 0,
  is_active: true,
};

const previewImage = (row: ShopProductRow) => row.image_url || staticShopImages[row.id] || '';

export default function ShopProductsManagement() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ShopProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<ShopProductRow>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from('shop_products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'Load failed', description: error.message, variant: 'destructive' });
    } else {
      setProducts((data || []) as unknown as ShopProductRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel('admin-shop-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shop_products' }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNew = () => {
    setForm({ ...emptyForm, sort_order: (products.length + 1) * 10 });
    setIsNew(true);
    setDialogOpen(true);
  };

  const openEdit = (row: ShopProductRow) => {
    setForm({ ...row });
    setIsNew(false);
    setDialogOpen(true);
  };

  const handleUpload = async (file: File) => {
    if (!form.id) {
      toast({
        title: 'Product ID required',
        description: 'Pehle product ID likhein, phir image upload karein.',
        variant: 'destructive',
      });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `shop-products/${form.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('site-assets')
        .upload(path, file, { cacheControl: '3600', upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('site-assets').getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast({ title: 'Image uploaded', description: 'Save karne par live ho jayegi.' });
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.id.trim() || !form.name.trim() || !form.short_title.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Product ID, name aur short title zaroori hain.',
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      short_title: form.short_title.trim(),
      price: Number(form.price) || 0,
      original_price: form.original_price != null && String(form.original_price) !== '' ? Number(form.original_price) : null,
      price_prefix: form.price_prefix || null,
      image_url: form.image_url || null,
      category: form.category,
      discount: form.discount || null,
      badge: form.badge || null,
      badge_color: form.badge_color || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    };

    const { error } = isNew
      ? await supabase.from('shop_products').insert(payload as any)
      : await supabase.from('shop_products').update(payload as any).eq('id', form.id);

    setSaving(false);
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Saved', description: 'Shop item live update ho gaya.' });
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (row: ShopProductRow) => {
    if (!confirm(`Delete "${row.short_title}" permanently?`)) return;
    const { error } = await supabase.from('shop_products').delete().eq('id', row.id);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Deleted', description: 'Item shop se hata diya gaya.' });
    load();
  };

  const toggleActive = async (row: ShopProductRow) => {
    const { error } = await supabase
      .from('shop_products')
      .update({ is_active: !row.is_active } as any)
      .eq('id', row.id);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" /> Shop Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Elite Pass, Prime aur Growthgift packs — image, title aur price update karte hi shop page par live change ho jata hai.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((row) => (
            <Card key={row.id} className={row.is_active ? '' : 'opacity-60'}>
              <CardContent className="p-4 flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {previewImage(row) ? (
                    <img src={previewImage(row)} alt={row.short_title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-semibold text-sm truncate" title={row.name}>{row.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{row.short_title}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold">{Number(row.price).toLocaleString()} PKR</span>
                    {row.original_price ? (
                      <span className="text-xs line-through text-muted-foreground">
                        {Number(row.original_price).toLocaleString()}
                      </span>
                    ) : null}
                    {row.discount ? <Badge variant="secondary">{row.discount}</Badge> : null}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Switch checked={row.is_active} onCheckedChange={() => toggleActive(row)} />
                      <span className="text-xs text-muted-foreground">
                        {row.is_active ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(row)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? 'Add Shop Product' : 'Edit Shop Product'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {previewImage(form) ? (
                  <img src={previewImage(form)} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shop-image" className="text-sm">Product Image</Label>
                <Input
                  id="shop-image"
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  Nayi image purani ko permanently replace kar degi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Product ID (code)</Label>
                <Input
                  value={form.id}
                  disabled={!isNew}
                  placeholder="a19-elite-pass-50"
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>Full Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>Short Title (orders / email)</Label>
                <Input
                  value={form.short_title}
                  onChange={(e) => setForm({ ...form, short_title: e.target.value })}
                />
              </div>
              <div>
                <Label>Price (PKR)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Original Price</Label>
                <Input
                  type="number"
                  value={form.original_price ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, original_price: e.target.value === '' ? null : Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Discount label</Label>
                <Input
                  value={form.discount ?? ''}
                  placeholder="-30%"
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                />
              </div>
              <div>
                <Label>Price prefix</Label>
                <Input
                  value={form.price_prefix ?? ''}
                  placeholder="From"
                  onChange={(e) => setForm({ ...form, price_prefix: e.target.value })}
                />
              </div>
              <div>
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                />
              </div>
              <div className="col-span-2 flex items-center gap-2 pt-1">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                />
                <span className="text-sm">Shop page par show karein</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || uploading}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
