import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Gift,
  User,
  Calendar,
  Hash,
  Copy,
  Check,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RedeemCode {
  id: string;
  player_id: string;
  username: string | null;
  redeem_code: string;
  status: string;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
}

type DateFilter = '24h' | '7d' | '30d' | 'all';

export function RedeemCodesManagement() {
  const { toast } = useToast();
  const [redeemCodes, setRedeemCodes] = useState<RedeemCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('24h');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: 'Copied!',
        description: 'Code copied to clipboard'
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy code'
      });
    }
  };

  useEffect(() => {
    fetchRedeemCodes();
  }, []);

  const fetchRedeemCodes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('redeem_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching redeem codes:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load redeem codes'
      });
    } else {
      setRedeemCodes(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('redeem_codes')
      .update({ 
        status, 
        reviewed_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update status'
      });
    } else {
      toast({
        title: 'Success',
        description: `Code marked as ${status}`
      });
      fetchRedeemCodes();
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    const { error } = await supabase
      .from('redeem_codes')
      .update({ notes })
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update notes'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Notes updated'
      });
    }
  };

  const archiveAndDeleteCodes = async (codeIds: string[]): Promise<boolean> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Not authenticated'
        });
        return false;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/archive-redeem-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session.access_token}`
        },
        body: JSON.stringify({ code_ids: codeIds })
      });

      const result = await response.json();
      
      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to archive codes'
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Archive error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to archive codes'
      });
      return false;
    }
  };

  const deleteCode = async (id: string) => {
    const success = await archiveAndDeleteCodes([id]);
    
    if (success) {
      toast({
        title: 'Success',
        description: 'Code archived and deleted'
      });
      fetchRedeemCodes();
    }
  };

  const toggleSelectCode = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCodes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCodes.map(c => c.id)));
    }
  };

  const deleteSelectedCodes = async () => {
    if (selectedIds.size === 0) return;
    
    setIsDeleting(true);
    const success = await archiveAndDeleteCodes(Array.from(selectedIds));
    
    if (success) {
      toast({
        title: 'Success',
        description: `${selectedIds.size} code(s) archived and deleted`
      });
      setSelectedIds(new Set());
      fetchRedeemCodes();
    }
    setIsDeleting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'already_used':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Already Used</Badge>;
      case 'invalid':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30"><XCircle className="w-3 h-3 mr-1" />Invalid</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getDateFilterLabel = (filter: DateFilter) => {
    switch (filter) {
      case '24h': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case 'all': return 'All Time';
    }
  };

  const filteredCodes = redeemCodes.filter(code => {
    const matchesSearch = 
      code.player_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.redeem_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (code.username && code.username.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || code.status === statusFilter;
    
    // Date filter logic
    const codeDate = new Date(code.created_at);
    const now = new Date();
    let matchesDate = true;
    
    if (dateFilter === '24h') {
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      matchesDate = codeDate >= oneDayAgo;
    } else if (dateFilter === '7d') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = codeDate >= sevenDaysAgo;
    } else if (dateFilter === '30d') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = codeDate >= thirtyDaysAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    total: redeemCodes.length,
    pending: redeemCodes.filter(c => c.status === 'pending').length,
    approved: redeemCodes.filter(c => c.status === 'approved').length,
    rejected: redeemCodes.filter(c => c.status === 'rejected').length
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Gift className="w-5 h-5 md:w-7 md:h-7 text-purple-400" />
            Redeem Codes
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">Manage customer redeem codes</p>
        </div>
        <Button onClick={fetchRedeemCodes} variant="outline" size="sm" className="gap-2 self-start">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-2 md:pt-4 md:p-6">
            <div className="text-lg md:text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-[10px] md:text-xs text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardContent className="p-2 md:pt-4 md:p-6">
            <div className="text-lg md:text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-[10px] md:text-xs text-gray-400">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-2 md:pt-4 md:p-6">
            <div className="text-lg md:text-2xl font-bold text-green-400">{stats.approved}</div>
            <div className="text-[10px] md:text-xs text-gray-400">Approved</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="p-2 md:pt-4 md:p-6">
            <div className="text-lg md:text-2xl font-bold text-red-400">{stats.rejected}</div>
            <div className="text-[10px] md:text-xs text-gray-400">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Date Filter Tabs */}
      <Card className="border-gray-700/50 bg-gray-800/50">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-gray-300 font-medium">Time Period</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(['24h', '7d', '30d', 'all'] as DateFilter[]).map((filter) => (
              <Button
                key={filter}
                variant={dateFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateFilter(filter)}
                className={`text-xs px-2 py-1 h-7 ${dateFilter === filter 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter === '24h' ? '24h' : filter === '7d' ? '7d' : filter === '30d' ? '30d' : 'All'}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search & Status Filters */}
      <Card className="border-gray-700/50 bg-gray-800/50">
        <CardContent className="p-3">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm bg-gray-900/50 border-gray-700"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize text-xs px-2 py-1 h-7"
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <Card className="border-blue-500/30 bg-blue-500/10">
          <CardContent className="p-3 space-y-2">
            {/* Header with count and clear */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">{selectedIds.size} selected</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIds(new Set())}
                className="border-gray-600 text-gray-300 h-7 text-xs px-2"
              >
                Clear
              </Button>
            </div>

            {/* Bulk Status Change Buttons */}
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                onClick={async () => {
                  for (const id of selectedIds) {
                    await updateStatus(id, 'approved');
                  }
                  setSelectedIds(new Set());
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-7 text-xs px-2 flex-1"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                UC Delivered
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  for (const id of selectedIds) {
                    await updateStatus(id, 'already_used');
                  }
                  setSelectedIds(new Set());
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-7 text-xs px-2 flex-1"
              >
                <XCircle className="w-3 h-3 mr-1" />
                Already Used
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  for (const id of selectedIds) {
                    await updateStatus(id, 'invalid');
                  }
                  setSelectedIds(new Set());
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-7 text-xs px-2 flex-1"
              >
                <XCircle className="w-3 h-3 mr-1" />
                Invalid
              </Button>
            </div>

            {/* Delete Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSelectedCodes}
              disabled={isDeleting}
              className="w-full bg-gray-700 hover:bg-gray-600 h-7 text-xs"
            >
              {isDeleting ? (
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Trash2 className="w-3 h-3 mr-1" />
              )}
              Delete Selected
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Codes List - Accordion Style like FAQ */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : filteredCodes.length === 0 ? (
        <Card className="border-gray-700/50 bg-gray-800/30">
          <CardContent className="py-12 text-center">
            <Gift className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No redeem codes found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {/* Select All Header */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <Checkbox
              checked={selectedIds.size === filteredCodes.length && filteredCodes.length > 0}
              onCheckedChange={toggleSelectAll}
              className="border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4"
            />
            <span className="text-xs text-gray-400">
              {selectedIds.size === filteredCodes.length && filteredCodes.length > 0 
                ? 'Deselect' 
                : `Select All (${filteredCodes.length})`}
            </span>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {filteredCodes.map((code) => (
              <AccordionItem 
                key={code.id} 
                value={code.id}
                className="border border-gray-700/50 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 overflow-hidden"
              >
                <AccordionTrigger className="px-2 md:px-4 py-2 md:py-3 hover:no-underline hover:bg-gray-700/20">
                  <div className="flex flex-1 items-center justify-between pr-2 gap-2">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                      {/* Checkbox */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.has(code.id)}
                          onCheckedChange={() => toggleSelectCode(code.id)}
                          className="border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4"
                        />
                      </div>
                      <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Hash className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <div className="font-mono text-white text-xs md:text-sm font-bold flex items-center gap-1.5">
                          <span className="truncate max-w-[100px] md:max-w-none">{code.redeem_code}</span>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center h-5 w-5 md:h-6 md:w-6 rounded bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30 transition-colors flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(code.redeem_code, code.id);
                            }}
                            title="Copy Code"
                          >
                            {copiedId === code.id ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-purple-300" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                          <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(code.created_at).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'short' 
                            })} • {new Date(code.created_at).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {getStatusBadge(code.status)}
                    </div>
                  </div>
                </AccordionTrigger>
              <AccordionContent className="px-2 md:px-4 pb-3">
                <div className="space-y-3 pt-3 border-t border-gray-700/50">
                  {/* Details - Compact Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 text-[10px]">Player ID:</span>
                      <div className="flex items-center gap-1.5">
                        <p className="text-white font-mono text-xs truncate">{code.player_id}</p>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center h-5 w-5 rounded bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 transition-colors flex-shrink-0"
                          onClick={() => copyToClipboard(code.player_id, `pid-${code.id}`)}
                          title="Copy Player ID"
                        >
                          {copiedId === `pid-${code.id}` ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-blue-300" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px]">Username:</span>
                      <p className="text-white text-xs truncate">{code.username || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px]">Submitted:</span>
                      <p className="text-white text-xs">{new Date(code.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px]">Status:</span>
                      <div className="mt-0.5">{getStatusBadge(code.status)}</div>
                    </div>
                  </div>

                  {/* Notes - Compact */}
                  <div>
                    <span className="text-gray-500 text-[10px]">Notes:</span>
                    <Textarea
                      placeholder="Add notes..."
                      defaultValue={code.notes || ''}
                      onBlur={(e) => updateNotes(code.id, e.target.value)}
                      className="mt-1 bg-gray-900/50 border-gray-700 text-xs h-14"
                      rows={1}
                    />
                  </div>

                  {/* Actions - Compact */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => updateStatus(code.id, 'approved')}
                        className={`flex-1 py-2 text-xs ${
                          code.status === 'approved' 
                            ? 'bg-green-500/40 text-green-300 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                        }`}
                        disabled={code.status === 'approved'}
                        size="sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                        {code.status === 'approved' ? 'Delivered ✓' : 'UC Delivered'}
                      </Button>
                      
                      <Button 
                        onClick={() => deleteCode(code.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {/* Already Used Button - marks code as already_used */}
                    <Button 
                      onClick={() => updateStatus(code.id, 'already_used')}
                      className={`w-full py-2 text-xs ${
                        code.status === 'already_used' 
                          ? 'bg-red-500/40 text-red-300 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                      }`}
                      disabled={code.status === 'already_used'}
                      size="sm"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      {code.status === 'already_used' ? 'Marked Used ✓' : 'Already Used'}
                    </Button>

                    {/* Mark Invalid Button - marks code as invalid */}
                    <Button 
                      onClick={() => updateStatus(code.id, 'invalid')}
                      className={`w-full py-2 text-xs ${
                        code.status === 'invalid' 
                          ? 'bg-orange-500/40 text-orange-300 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                      }`}
                      disabled={code.status === 'invalid'}
                      size="sm"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      {code.status === 'invalid' ? 'Marked Invalid ✓' : 'Mark Invalid'}
                    </Button>
                  </div>

                  {code.status === 'approved' && (
                    <p className="text-[10px] text-green-400 text-center">
                      User will see "Code already used" message
                    </p>
                  )}
                  {code.status === 'already_used' && (
                    <p className="text-[10px] text-red-400 text-center">
                      User will see "This code is already used" error
                    </p>
                  )}
                  {code.status === 'invalid' && (
                    <p className="text-[10px] text-orange-400 text-center">
                      User will see "Redeem Code is Invalid" error
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </div>
      )}
    </div>
  );
}
