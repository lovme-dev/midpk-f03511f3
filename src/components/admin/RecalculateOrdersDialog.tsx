import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatOrderPrice } from '@/utils/formatOrderPrice';
import { Calculator, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { EXCHANGE_RATES } from '@/utils/exchangeRates';

interface Order {
  id: string;
  transaction_id: string;
  price: number;
  currency_code: string | null;
  pkr_amount: number | null;
  exchange_rate: number | null;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

interface RecalculateOrdersDialogProps {
  orders: Order[];
  onOrdersUpdated: () => void;
}

export function RecalculateOrdersDialog({ orders, onOrdersUpdated }: RecalculateOrdersDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [newCurrency, setNewCurrency] = useState<string>('');
  const [customRate, setCustomRate] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Find potentially misconfigured orders (PKR currency but high amounts that look like original currency was different)
  const suspiciousOrders = useMemo(() => {
    return orders.filter(order => {
      // Orders with PKR currency that have no exchange_rate or pkr_amount
      // These were likely international orders saved incorrectly
      const isPKR = order.currency_code?.toUpperCase() === 'PKR';
      const noExchangeRate = !order.exchange_rate || order.exchange_rate === 1;
      const noPkrAmount = !order.pkr_amount;
      
      // If it's PKR but has common international price patterns
      // For example, prices like 12350 PKR might actually be correct PKR
      // But prices like 50.00, 100.00, 150.00 might have been USD/EUR/RUB originally
      
      return isPKR && noExchangeRate && noPkrAmount;
    });
  }, [orders]);

  // Available currencies for correction
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  ];

  const toggleOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const selectAll = () => {
    if (selectedOrders.size === suspiciousOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(suspiciousOrders.map(o => o.id)));
    }
  };

  const getExchangeRate = (currency: string): number => {
    if (customRate && !isNaN(parseFloat(customRate))) {
      return parseFloat(customRate);
    }
    // PKR rate relative to USD
    const pkrRate = EXCHANGE_RATES['PKR'] || 278;
    const currencyRate = EXCHANGE_RATES[currency] || 1;
    
    // Convert: how many PKR per 1 unit of this currency
    // If PKR = 278 per USD and RUB = 87 per USD
    // Then 1 RUB = 278/87 = 3.19 PKR
    return pkrRate / currencyRate;
  };

  const handleRecalculate = async () => {
    if (selectedOrders.size === 0 || !newCurrency) {
      toast({
        title: "Selection Required",
        description: "Please select orders and a target currency",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    const rate = getExchangeRate(newCurrency);
    
    let successCount = 0;
    let failCount = 0;

    for (const orderId of selectedOrders) {
      const order = orders.find(o => o.id === orderId);
      if (!order) continue;

      try {
        // The current price is in PKR, we need to find original amount
        // If price = 12350 PKR and rate = 3.19 (PKR per RUB)
        // Then original RUB = 12350 / 3.19 = ~3870 (doesn't look right)
        // 
        // Actually, if the price was saved as PKR when it should have been the original currency:
        // We need to keep the pkr_amount as the actual PKR value
        // And update the price to be the original currency amount
        
        // Scenario: User paid 50 RUB, but price was saved as 50 (displayed as PKR)
        // The actual PKR charged would have been 50 * rate
        // So: price should stay as 50, currency becomes RUB, pkr_amount = 50 * rate
        
        const originalAmount = order.price;
        const pkrEquivalent = Math.round(originalAmount * rate);

        const { error } = await supabase
          .from('orders')
          .update({
            currency_code: newCurrency,
            exchange_rate: rate,
            pkr_amount: pkrEquivalent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (error) {
          console.error('Failed to update order:', orderId, error);
          failCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error('Error updating order:', err);
        failCount++;
      }
    }

    setIsProcessing(false);
    
    toast({
      title: "Orders Updated",
      description: `Successfully updated ${successCount} orders. ${failCount > 0 ? `Failed: ${failCount}` : ''}`,
      variant: failCount > 0 ? "destructive" : "default",
    });

    if (successCount > 0) {
      onOrdersUpdated();
      setSelectedOrders(new Set());
      setOpen(false);
    }
  };

  const previewCalculation = (order: Order) => {
    if (!newCurrency) return null;
    const rate = getExchangeRate(newCurrency);
    const pkrEquivalent = Math.round(order.price * rate);
    return {
      originalAmount: order.price,
      newCurrency,
      rate,
      pkrEquivalent,
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calculator className="h-4 w-4" />
          <span className="hidden sm:inline">Fix Currency</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Recalculate & Fix Order Currencies
          </DialogTitle>
          <DialogDescription>
            Fix orders that were saved with incorrect PKR currency. Select orders and assign their correct original currency.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong className="text-yellow-500">Caution:</strong>
              <p className="text-muted-foreground mt-1">
                This will update the currency and calculate PKR equivalent. Only use this for orders where you know the original currency was different from PKR.
              </p>
            </div>
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target Currency</Label>
              <Select value={newCurrency} onValueChange={setNewCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select original currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Custom Exchange Rate (optional)</Label>
              <Input
                type="number"
                placeholder={`Auto: ${newCurrency ? getExchangeRate(newCurrency).toFixed(2) : '...'} PKR per 1 ${newCurrency || 'unit'}`}
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
              />
            </div>
          </div>

          {newCurrency && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
              Rate: 1 {newCurrency} = {getExchangeRate(newCurrency).toFixed(2)} PKR
            </div>
          )}

          {/* Orders List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Orders to Fix ({suspiciousOrders.length} found)</Label>
              <Button variant="ghost" size="sm" onClick={selectAll}>
                {selectedOrders.size === suspiciousOrders.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {suspiciousOrders.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  No orders need fixing. All orders have proper currency data.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="p-2 text-left w-10"></th>
                      <th className="p-2 text-left">Order ID</th>
                      <th className="p-2 text-left">Current Price</th>
                      <th className="p-2 text-left">Preview</th>
                      <th className="p-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suspiciousOrders.map(order => {
                      const preview = previewCalculation(order);
                      return (
                        <tr 
                          key={order.id} 
                          className={`border-b hover:bg-muted/30 cursor-pointer ${selectedOrders.has(order.id) ? 'bg-primary/10' : ''}`}
                          onClick={() => toggleOrder(order.id)}
                        >
                          <td className="p-2">
                            <Checkbox 
                              checked={selectedOrders.has(order.id)}
                              onCheckedChange={() => toggleOrder(order.id)}
                            />
                          </td>
                          <td className="p-2 font-mono text-xs">
                            {order.transaction_id.substring(0, 20)}...
                          </td>
                          <td className="p-2">
                            <Badge variant="outline" className="bg-red-500/10 text-red-400">
                              {formatOrderPrice(order.price, 'PKR')}
                            </Badge>
                          </td>
                          <td className="p-2">
                            {preview ? (
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="bg-green-500/10 text-green-400">
                                  {formatOrderPrice(preview.originalAmount, preview.newCurrency)}
                                </Badge>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-xs text-muted-foreground">
                                  ≈ {preview.pkrEquivalent.toLocaleString()} PKR
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Select currency</span>
                            )}
                          </td>
                          <td className="p-2 text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRecalculate}
              disabled={selectedOrders.size === 0 || !newCurrency || isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Fix {selectedOrders.size} Orders
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
