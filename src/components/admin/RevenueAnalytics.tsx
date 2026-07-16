import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, TrendingUp, DollarSign, Globe, Calendar } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

// Exchange rates to PKR (fallback values)
const EXCHANGE_RATES_TO_PKR: Record<string, number> = {
  PKR: 1,
  USD: 280.50, EUR: 305.00, GBP: 355.00, JPY: 1.85, CHF: 315.00,
  AED: 76.40, SAR: 74.80, KWD: 912.00, QAR: 77.00, OMR: 729.00,
  INR: 3.35, BDT: 2.55, NPR: 2.10, LKR: 0.87,
  IDR: 0.018, MYR: 63.00, PHP: 4.90, THB: 8.20, VND: 0.011, SGD: 208.00,
  CNY: 38.50, HKD: 36.00, TWD: 8.70, KRW: 0.21,
  RUB: 3.05, TRY: 8.20, PLN: 69.00, UAH: 6.80,
  EGP: 5.70, NGN: 0.18, KES: 2.18, ZAR: 15.30,
  BRL: 47.50, MXN: 14.00, CAD: 197.00, AUD: 178.00,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹',
  PKR: 'Rs', RUB: '₽', TRY: '₺', IDR: 'Rp', MYR: 'RM',
  SAR: '﷼', AED: 'د.إ', BDT: '৳', PHP: '₱', THB: '฿',
  VND: '₫', KRW: '₩', CNY: '¥', BRL: 'R$', MXN: '$',
};

const CURRENCY_FLAGS: Record<string, string> = {
  PKR: '🇵🇰', USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵',
  INR: '🇮🇳', RUB: '🇷🇺', TRY: '🇹🇷', SAR: '🇸🇦', AED: '🇦🇪',
  IDR: '🇮🇩', MYR: '🇲🇾', BDT: '🇧🇩', PHP: '🇵🇭', THB: '🇹🇭',
  VND: '🇻🇳', KRW: '🇰🇷', CNY: '🇨🇳', BRL: '🇧🇷', MXN: '🇲🇽',
  CAD: '🇨🇦', AUD: '🇦🇺', SGD: '🇸🇬', EGP: '🇪🇬', ZAR: '🇿🇦',
};

interface Order {
  id: string;
  price: number;
  currency_code: string | null;
  status: string;
  created_at: string;
}

interface CurrencyRevenue {
  currency: string;
  amount: number;
  orderCount: number;
  amountInPKR: number;
}

interface DayRevenue {
  date: string;
  currencies: CurrencyRevenue[];
  totalPKR: number;
  orderCount: number;
}

export function RevenueAnalytics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | '7days' | '30days'>('7days');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let startDate: Date;
      const endDate = endOfDay(new Date());

      switch (period) {
        case 'today':
          startDate = startOfDay(new Date());
          break;
        case '7days':
          startDate = startOfDay(subDays(new Date(), 6));
          break;
        case '30days':
          startDate = startOfDay(subDays(new Date(), 29));
          break;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('id, price, currency_code, status, created_at')
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [period]);

  // Calculate revenue by currency
  const currencyBreakdown = useMemo(() => {
    const breakdown: Record<string, CurrencyRevenue> = {};

    orders.forEach(order => {
      const currency = (order.currency_code || 'PKR').toUpperCase();
      const price = order.price || 0;
      const rate = EXCHANGE_RATES_TO_PKR[currency] || 1;

      if (!breakdown[currency]) {
        breakdown[currency] = {
          currency,
          amount: 0,
          orderCount: 0,
          amountInPKR: 0,
        };
      }

      breakdown[currency].amount += price;
      breakdown[currency].orderCount += 1;
      breakdown[currency].amountInPKR += price * rate;
    });

    return Object.values(breakdown).sort((a, b) => b.amountInPKR - a.amountInPKR);
  }, [orders]);

  // Calculate daily breakdown
  const dailyBreakdown = useMemo(() => {
    const breakdown: Record<string, DayRevenue> = {};

    orders.forEach(order => {
      const date = format(new Date(order.created_at), 'yyyy-MM-dd');
      const currency = (order.currency_code || 'PKR').toUpperCase();
      const price = order.price || 0;
      const rate = EXCHANGE_RATES_TO_PKR[currency] || 1;

      if (!breakdown[date]) {
        breakdown[date] = {
          date,
          currencies: [],
          totalPKR: 0,
          orderCount: 0,
        };
      }

      let currencyEntry = breakdown[date].currencies.find(c => c.currency === currency);
      if (!currencyEntry) {
        currencyEntry = { currency, amount: 0, orderCount: 0, amountInPKR: 0 };
        breakdown[date].currencies.push(currencyEntry);
      }

      currencyEntry.amount += price;
      currencyEntry.orderCount += 1;
      currencyEntry.amountInPKR += price * rate;
      breakdown[date].totalPKR += price * rate;
      breakdown[date].orderCount += 1;
    });

    return Object.values(breakdown)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders]);

  // Total stats
  const totals = useMemo(() => {
    const totalPKR = currencyBreakdown.reduce((sum, c) => sum + c.amountInPKR, 0);
    const totalOrders = orders.length;
    const uniqueCurrencies = currencyBreakdown.length;
    return { totalPKR, totalOrders, uniqueCurrencies };
  }, [currencyBreakdown, orders]);

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    const noDecimals = ['JPY', 'KRW', 'VND', 'IDR', 'PKR'].includes(currency);
    if (noDecimals) {
      return `${symbol} ${Math.round(amount).toLocaleString()}`;
    }
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatPKR = (amount: number) => {
    return `Rs ${Math.round(amount).toLocaleString()}`;
  };

  return (
    <Card className="border-0 shadow-lg bg-card">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Revenue Analytics
          </CardTitle>
          <CardDescription>
            Revenue breakdown by currency with PKR conversion
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList className="bg-muted">
              <TabsTrigger value="today" className="text-xs sm:text-sm">Today</TabsTrigger>
              <TabsTrigger value="7days" className="text-xs sm:text-sm">7 Days</TabsTrigger>
              <TabsTrigger value="30days" className="text-xs sm:text-sm">30 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={fetchOrders} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No completed orders in this period</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Total Revenue (PKR)</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{formatPKR(totals.totalPKR)}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totals.totalOrders}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Currencies</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totals.uniqueCurrencies}</p>
                </CardContent>
              </Card>
            </div>

            {/* Currency Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Revenue by Currency
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currencyBreakdown.map((item) => (
                  <Card key={item.currency} className="bg-muted/30 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{CURRENCY_FLAGS[item.currency] || '🌍'}</span>
                          <span className="font-semibold text-foreground">{item.currency}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.orderCount} orders
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {formatCurrency(item.amount, item.currency)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ≈ {formatPKR(item.amountInPKR)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Daily Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Breakdown
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {dailyBreakdown.map((day) => (
                  <Card key={day.date} className="bg-muted/20 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {format(new Date(day.date), 'EEEE, MMM d, yyyy')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {day.orderCount} orders
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {formatPKR(day.totalPKR)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {day.currencies
                          .sort((a, b) => b.amountInPKR - a.amountInPKR)
                          .map((c) => (
                            <Badge 
                              key={c.currency} 
                              variant="outline" 
                              className="text-xs py-1 px-2"
                            >
                              {CURRENCY_FLAGS[c.currency] || '🌍'} {c.currency}: {formatCurrency(c.amount, c.currency)}
                              <span className="text-muted-foreground ml-1">({c.orderCount})</span>
                            </Badge>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
