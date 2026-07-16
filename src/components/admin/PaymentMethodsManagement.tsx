import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePaymentMethodSettings, type PaymentMethodSetting } from '@/hooks/usePaymentMethodSettings';
import { Loader2, Plus, Trash2, CreditCard } from 'lucide-react';

const PaymentMethodsManagement = () => {
  const { methods, loading, refresh } = usePaymentMethodSettings();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const toggleEnabled = async (m: PaymentMethodSetting, value: boolean) => {
    setSavingId(m.id);
    const { error } = await (supabase as any)
      .from('payment_method_settings')
      .update({ enabled: value })
      .eq('id', m.id);
    setSavingId(null);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: value ? 'Enabled' : 'Disabled',
        description: `${m.display_name} ${value ? 'ab live payments mein show hoga' : 'checkout se hide ho gaya, server bhi block karega'}.`,
      });
      refresh();
    }
  };

  const renameMethod = async (m: PaymentMethodSetting, newDisplayName: string) => {
    if (!newDisplayName.trim() || newDisplayName === m.display_name) return;
    setSavingId(m.id);
    const { error } = await (supabase as any)
      .from('payment_method_settings')
      .update({ display_name: newDisplayName.trim() })
      .eq('id', m.id);
    setSavingId(null);
    if (error) toast({ title: 'Rename failed', description: error.message, variant: 'destructive' });
    else refresh();
  };

  const removeMethod = async (m: PaymentMethodSetting) => {
    if (!confirm(`Delete "${m.display_name}"?`)) return;
    setSavingId(m.id);
    const { error } = await (supabase as any)
      .from('payment_method_settings')
      .delete()
      .eq('id', m.id);
    setSavingId(null);
    if (error) toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Deleted', description: `${m.display_name} removed.` }); refresh(); }
  };

  const addMethod = async () => {
    if (!newKey.trim() || !newName.trim()) {
      toast({ title: 'Both fields required', variant: 'destructive' });
      return;
    }
    setAdding(true);
    const nextOrder = (methods[methods.length - 1]?.sort_order ?? 0) + 10;
    const { error } = await (supabase as any)
      .from('payment_method_settings')
      .insert({
        method_key: newKey.trim().toLowerCase().replace(/\s+/g, '_'),
        display_name: newName.trim(),
        enabled: true,
        sort_order: nextOrder,
      });
    setAdding(false);
    if (error) {
      toast({ title: 'Add failed', description: error.message, variant: 'destructive' });
    } else {
      setNewKey(''); setNewName('');
      toast({ title: 'Added', description: `${newName} added.` });
      refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" /> Payment Methods
        </CardTitle>
        <CardDescription>
          Har payment gateway ko enable/disable karo. Disabled methods checkout par hide honge aur
          server-side payment functions bhi block kar dengi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {methods.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-lg border p-3 bg-card"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Input
                      defaultValue={m.display_name}
                      onBlur={(e) => renameMethod(m, e.target.value)}
                      className="max-w-xs h-8"
                    />
                    <Badge variant="outline" className="text-xs font-mono">
                      {m.method_key}
                    </Badge>
                    {m.enabled ? (
                      <Badge className="bg-green-600 hover:bg-green-600">Live</Badge>
                    ) : (
                      <Badge variant="destructive">Disabled</Badge>
                    )}
                  </div>
                  {m.description && (
                    <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
                  )}
                </div>
                <Switch
                  checked={m.enabled}
                  onCheckedChange={(v) => toggleEnabled(m, v)}
                  disabled={savingId === m.id}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeMethod(m)}
                  disabled={savingId === m.id}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <Label className="text-sm font-medium">Add new payment method</Label>
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              placeholder="key (e.g. sadapay)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="md:max-w-xs"
            />
            <Input
              placeholder="Display name (e.g. SadaPay)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button onClick={addMethod} disabled={adding}>
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsManagement;
