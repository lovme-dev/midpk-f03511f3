import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { formatOrderPrice } from '@/utils/formatOrderPrice';
import { Archive, Search, Clock, User, Package, DollarSign, Trash2, RefreshCw, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ArchivedOrder {
  id: string;
  original_id: string;
  user_id: string;
  package_id: string | null;
  price: number | null;
  status: string | null;
  payment_method: string | null;
  transaction_id: string | null;
  player_id: string | null;
  currency_code: string | null;
  product_type: string | null;
  product_name: string | null;
  product_amount: string | null;
  original_created_at: string | null;
  archived_at: string;
  archived_reason: string | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
  uc_packages?: {
    name: string;
    uc_amount: number;
  } | null;
}

interface ArchivedOrdersDialogProps {
  archivedCount?: number;
}

export function ArchivedOrdersDialog({ archivedCount = 0 }: ArchivedOrdersDialogProps) {
  const [open, setOpen] = useState(false);
  const [archivedOrders, setArchivedOrders] = useState<ArchivedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const { toast } = useToast();

  const loadArchivedOrders = async () => {
    if (!open) return;
    setLoading(true);
    try {
      // Step 1: Fetch archived orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders_archive')
        .select('*')
        .order('archived_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (!ordersData || ordersData.length === 0) {
        setArchivedOrders([]);
        return;
      }

      // Step 2: Get unique user_ids and package_ids
      const userIds = [...new Set(ordersData.map(o => o.user_id).filter(Boolean))];
      const packageIds = [...new Set(ordersData.map(o => o.package_id).filter(Boolean))];

      // Step 3: Fetch profiles
      let profilesMap: Record<string, { full_name: string | null; email: string | null }> = {};
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);

        if (profilesData) {
          profilesData.forEach(p => {
            profilesMap[p.user_id] = { full_name: p.full_name, email: p.email };
          });
        }
      }

      // Step 4: Fetch packages
      let packagesMap: Record<string, { name: string; uc_amount: number }> = {};
      if (packageIds.length > 0) {
        const { data: packagesData } = await supabase
          .from('uc_packages')
          .select('id, name, uc_amount')
          .in('id', packageIds);

        if (packagesData) {
          packagesData.forEach(p => {
            packagesMap[p.id] = { name: p.name, uc_amount: p.uc_amount };
          });
        }
      }

      // Step 5: Merge data
      const enrichedOrders: ArchivedOrder[] = ordersData.map(order => ({
        ...order,
        profiles: profilesMap[order.user_id] || null,
        uc_packages: order.package_id ? packagesMap[order.package_id] || null : null,
      }));

      setArchivedOrders(enrichedOrders);
    } catch (error) {
      console.error('Failed to load archived orders:', error);
      toast({
        title: "Error",
        description: "Failed to load archived orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadArchivedOrders();
    }
  }, [open]);

  const filteredOrders = useMemo(() => {
    return archivedOrders.filter(order => {
      const matchesSearch = 
        order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.player_id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesReason = reasonFilter === 'all' || order.archived_reason === reasonFilter;
      
      return matchesSearch && matchesReason;
    });
  }, [archivedOrders, searchTerm, reasonFilter]);

  const deleteArchivedOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders_archive')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      setArchivedOrders(prev => prev.filter(o => o.id !== orderId));
      toast({
        title: "Deleted",
        description: "Archived order permanently deleted",
      });
    } catch (error) {
      console.error('Failed to delete archived order:', error);
      toast({
        title: "Error",
        description: "Failed to delete archived order",
        variant: "destructive",
      });
    }
  };

  const clearAllArchived = async () => {
    if (!confirm('Are you sure you want to permanently delete ALL archived orders? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders_archive')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      setArchivedOrders([]);
      toast({
        title: "Cleared",
        description: "All archived orders permanently deleted",
      });
    } catch (error) {
      console.error('Failed to clear archived orders:', error);
      toast({
        title: "Error",
        description: "Failed to clear archived orders",
        variant: "destructive",
      });
    }
  };

  const getReasonBadge = (reason: string | null) => {
    switch (reason) {
      case 'pending_timeout':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">⏰ Pending Timeout</Badge>;
      case 'failed_timeout':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500">❌ Failed Timeout</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-PK', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-orange-500/20 text-orange-400 border-orange-500 hover:bg-orange-500/30 gap-2"
        >
          <Archive className="h-4 w-4" />
          Archive
          {archivedCount > 0 && (
            <Badge className="bg-orange-500 text-white ml-1 h-5 min-w-5 px-1.5">
              {archivedCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Archive className="h-5 w-5 text-orange-400" />
            Archived Orders
            <Badge className="bg-orange-500/20 text-orange-400 ml-2">
              {archivedOrders.length} orders
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 py-3 border-b flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email, name, transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-background">
              <SelectValue placeholder="Filter by reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="pending_timeout">Pending Timeout</SelectItem>
              <SelectItem value="failed_timeout">Failed Timeout</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadArchivedOrders} disabled={loading} size="icon">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          {archivedOrders.length > 0 && (
            <Button variant="destructive" onClick={clearAllArchived} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Archive className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No archived orders</p>
              <p className="text-sm text-muted-foreground">Expired pending and failed orders will appear here</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="text-foreground">Transaction ID</TableHead>
                  <TableHead className="text-foreground">Customer</TableHead>
                  <TableHead className="text-foreground">Package</TableHead>
                  <TableHead className="text-foreground">Player ID</TableHead>
                  <TableHead className="text-foreground">Amount</TableHead>
                  <TableHead className="text-foreground">Reason</TableHead>
                  <TableHead className="text-foreground">Original Date</TableHead>
                  <TableHead className="text-foreground">Archived</TableHead>
                  <TableHead className="text-foreground w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-xs">
                      {order.transaction_id?.split('-').pop()?.toUpperCase() || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[120px]">{order.profiles?.full_name || 'Unknown'}</span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {order.profiles?.email || 'No email'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="text-sm truncate max-w-[100px]">
                          {order.uc_packages?.name || order.product_name || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {order.uc_packages?.uc_amount || order.product_amount || 'N/A'} {order.product_type || 'UC'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {order.player_id || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="font-semibold text-sm">
                          {formatOrderPrice(order.price || 0, order.currency_code)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getReasonBadge(order.archived_reason)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(order.original_created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(order.archived_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        onClick={() => deleteArchivedOrder(order.id)}
                        title="Delete permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}