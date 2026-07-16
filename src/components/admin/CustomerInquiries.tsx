import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Mail, 
  User, 
  Clock, 
  CheckCircle, 
  Circle, 
  Trash2,
  RefreshCw,
  MessageSquare,
  Send,
  Archive,
  MoreHorizontal,
  Languages,
  Loader2,
  PenSquare,
  Hash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { EmailReplyDialog } from './EmailReplyDialog';
import { ArchivedInquiriesDialog } from './ArchivedInquiriesDialog';

interface CustomerInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  status?: string;
  updated_at?: string;
}

export function CustomerInquiries() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [archivedDialogOpen, setArchivedDialogOpen] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());
  const [manualEmailOpen, setManualEmailOpen] = useState(false);
  const { toast } = useToast();

  // Track total inquiry count per email (active + archived)
  const [emailTotalCountMap, setEmailTotalCountMap] = useState<Record<string, number>>({});
  // Track admin response count per inquiry
  const [responseCountMap, setResponseCountMap] = useState<Record<string, number>>({});
  // Track total responses per email
  const [emailResponseCountMap, setEmailResponseCountMap] = useState<Record<string, number>>({});

  const fetchEmailStats = async () => {
    try {
      // Count archived inquiries per email
      const { data: archived } = await supabase
        .from('customer_inquiries_archive')
        .select('email');
      
      // Count email log responses per inquiry and per email
      const { data: emailLogs } = await supabase
        .from('inquiry_email_log')
        .select('inquiry_id, customer_email');

      // Build response count maps
      const respByInquiry: Record<string, number> = {};
      const respByEmail: Record<string, number> = {};
      (emailLogs || []).forEach((log: any) => {
        if (log.inquiry_id) {
          respByInquiry[log.inquiry_id] = (respByInquiry[log.inquiry_id] || 0) + 1;
        }
        const em = (log.customer_email || '').toLowerCase();
        if (em) respByEmail[em] = (respByEmail[em] || 0) + 1;
      });
      setResponseCountMap(respByInquiry);
      setEmailResponseCountMap(respByEmail);

      // Build archived email count
      const archivedCountMap: Record<string, number> = {};
      (archived || []).forEach((a: any) => {
        const em = (a.email || '').toLowerCase();
        archivedCountMap[em] = (archivedCountMap[em] || 0) + 1;
      });
      setEmailTotalCountMap(archivedCountMap);
    } catch (e) {
      console.error('Error fetching email stats:', e);
    }
  };

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
      await fetchEmailStats();
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load customer inquiries',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();

    // Set up realtime subscription for live updates
    const channel = supabase
      .channel('inquiries-list-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customer_inquiries',
        },
        (payload) => {
          const newInquiry = payload.new as CustomerInquiry;
          setInquiries(prev => [newInquiry, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_inquiries',
        },
        (payload) => {
          const updatedInquiry = payload.new as CustomerInquiry;
          setInquiries(prev =>
            prev.map(inq => (inq.id === updatedInquiry.id ? updatedInquiry : inq))
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'customer_inquiries',
        },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          setInquiries(prev => prev.filter(inq => inq.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_inquiries')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setInquiries(prev =>
        prev.map(inq => (inq.id === id ? { ...inq, is_read: true } : inq))
      );

      toast({
        title: 'Marked as read',
        description: 'Inquiry has been marked as read',
      });
    } catch (error) {
      console.error('Error marking as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark inquiry as read',
      });
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInquiries(prev => prev.filter(inq => inq.id !== id));

      toast({
        title: 'Deleted',
        description: 'Inquiry has been deleted',
      });
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete inquiry',
      });
    }
  };

  // Translate message to Urdu using Lovable AI
  const translateToUrdu = async (inquiryId: string, message: string) => {
    // If already translated, toggle back to original
    if (translatedMessages[inquiryId]) {
      setTranslatedMessages(prev => {
        const newMap = { ...prev };
        delete newMap[inquiryId];
        return newMap;
      });
      return;
    }

    setTranslatingIds(prev => new Set(prev).add(inquiryId));

    try {
      const { data, error } = await supabase.functions.invoke('translate-message', {
        body: { message, targetLanguage: 'Urdu' }
      });

      if (error) throw error;

      if (data?.translated) {
        setTranslatedMessages(prev => ({
          ...prev,
          [inquiryId]: data.translated
        }));
        toast({
          title: "✅ Translated",
          description: "Message Urdu mein translate ho gaya",
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        variant: 'destructive',
        title: 'Translation Failed',
        description: 'Message translate nahi ho saka',
      });
    } finally {
      setTranslatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(inquiryId);
        return newSet;
      });
    }
  };

  const unreadCount = inquiries.filter(inq => !inq.is_read).length;

  // Count inquiries per email (active + archived)
  const emailCountMap = inquiries.reduce<Record<string, number>>((acc, inq) => {
    const email = inq.email.toLowerCase();
    acc[email] = (acc[email] || 0) + 1;
    return acc;
  }, {});
  // Total = active + archived
  const emailGrandTotalMap: Record<string, number> = {};
  Object.keys(emailCountMap).forEach(em => {
    emailGrandTotalMap[em] = (emailCountMap[em] || 0) + (emailTotalCountMap[em] || 0);
  });

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === inquiries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(inquiries.map(i => i.id)));
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    try {
      const { error } = await supabase
        .from('customer_inquiries')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      setInquiries(prev => prev.filter(i => !selectedIds.has(i.id)));
      setSelectedIds(new Set());

      toast({
        title: 'Deleted',
        description: `${selectedIds.size} inquiries deleted`,
      });
    } catch (error) {
      console.error('Error deleting inquiries:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete inquiries',
      });
    }
  };

  const bulkArchive = async () => {
    if (selectedIds.size === 0) return;
    
    try {
      // Get selected inquiries
      const toArchive = inquiries.filter(i => selectedIds.has(i.id));
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Insert into archive
      const archiveData = toArchive.map(inq => ({
        original_id: inq.id,
        name: inq.name,
        email: inq.email,
        subject: inq.subject,
        message: inq.message,
        is_read: inq.is_read,
        status: inq.status || 'pending',
        original_created_at: inq.created_at,
        original_updated_at: inq.updated_at || inq.created_at,
        archived_by: user?.id || null,
      }));

      const { error: archiveError } = await supabase
        .from('customer_inquiries_archive')
        .insert(archiveData);

      if (archiveError) throw archiveError;

      // Delete from main table
      const { error: deleteError } = await supabase
        .from('customer_inquiries')
        .delete()
        .in('id', Array.from(selectedIds));

      if (deleteError) throw deleteError;

      setInquiries(prev => prev.filter(i => !selectedIds.has(i.id)));
      setSelectedIds(new Set());

      toast({
        title: 'Archived',
        description: `${selectedIds.size} inquiries moved to archive`,
      });
    } catch (error) {
      console.error('Error archiving inquiries:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to archive inquiries',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Customer Inquiries</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} New
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setManualEmailOpen(true);
            }}
            className="gap-2"
          >
            <PenSquare className="w-4 h-4" />
            Send Manual Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setArchivedDialogOpen(true)}
            className="gap-2"
          >
            <Archive className="w-4 h-4" />
            View Archive
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInquiries}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium text-foreground">No Inquiries Yet</h3>
            <p className="text-sm text-muted-foreground">
              Customer inquiries from the contact form will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total: {inquiries.length} inquiries
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                  className="text-xs h-8"
                >
                  {selectedIds.size === inquiries.length ? 'Deselect All' : 'Select All'}
                </Button>
                {selectedIds.size > 0 && (
                  <>
                    <Badge variant="secondary" className="text-xs">
                      {selectedIds.size} selected
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 text-xs h-8">
                          <MoreHorizontal className="w-4 h-4" />
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={bulkArchive} className="gap-2">
                          <Archive className="w-4 h-4" />
                          Archive Selected
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={bulkDelete} className="gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Delete Selected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="w-full">
              {inquiries.map((inquiry) => (
                <AccordionItem
                  key={inquiry.id}
                  value={inquiry.id}
                  className={`border-b border-border/30 ${selectedIds.has(inquiry.id) ? 'bg-primary/5' : ''}`}
                >
                  <AccordionTrigger className="hover:no-underline py-3 px-2 group">
                    <div className="flex items-center gap-3 w-full pr-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(inquiry.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelection(inquiry.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded border-border bg-background shrink-0"
                      />
                      {inquiry.is_read ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-primary fill-primary shrink-0" />
                      )}
                      <div className="flex flex-col items-start flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 w-full">
                          <span className={`font-medium truncate text-sm ${inquiry.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {inquiry.subject}
                          </span>
                          {!inquiry.is_read && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary">
                              New
                            </Badge>
                          )}
                          {emailGrandTotalMap[inquiry.email.toLowerCase()] > 1 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5 border-amber-500/50 text-amber-500">
                              <Hash className="w-2.5 h-2.5" />
                              {emailGrandTotalMap[inquiry.email.toLowerCase()]} inq
                            </Badge>
                          )}
                          {responseCountMap[inquiry.id] > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5 border-emerald-500/50 text-emerald-500">
                              <Send className="w-2.5 h-2.5" />
                              {responseCountMap[inquiry.id]} sent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span className="truncate">{inquiry.name}</span>
                          <span className="text-border">•</span>
                          <Clock className="w-3 h-3" />
                          <span>{format(new Date(inquiry.created_at), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-4">
                    <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Name:</span>
                        <span className="text-foreground font-medium">{inquiry.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {inquiry.email}
                        </a>
                      </div>
                      <div className="pt-2 border-t border-border/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Message:</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => translateToUrdu(inquiry.id, inquiry.message)}
                            disabled={translatingIds.has(inquiry.id)}
                            className="gap-1.5 text-xs h-6 px-2 text-primary hover:text-primary"
                          >
                            {translatingIds.has(inquiry.id) ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Translating...
                              </>
                            ) : translatedMessages[inquiry.id] ? (
                              <>
                                <Languages className="w-3 h-3" />
                                Show Original
                              </>
                            ) : (
                              <>
                                <Languages className="w-3 h-3" />
                                Translate to Urdu
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {translatedMessages[inquiry.id] || inquiry.message}
                        </p>
                        {translatedMessages[inquiry.id] && (
                          <p className="text-xs text-primary/60 mt-1 italic">
                            (Urdu translation - click button to see original)
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pt-2 flex-wrap">
                        {!inquiry.is_read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(inquiry.id)}
                            className="gap-1.5 text-xs h-8"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive hover:border-destructive/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setEmailDialogOpen(true);
                          }}
                          className="gap-1.5 text-xs h-8"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send Email Reply
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Email Reply Dialog - for existing inquiry */}
      <EmailReplyDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        inquiry={selectedInquiry}
      />

      {/* Manual Email Dialog - send to any email */}
      <EmailReplyDialog
        open={manualEmailOpen}
        onOpenChange={(open) => {
          setManualEmailOpen(open);
          if (!open) setSelectedInquiry(null);
        }}
        inquiry={null}
        manualMode={true}
      />

      {/* Archived Inquiries Dialog */}
      <ArchivedInquiriesDialog
        open={archivedDialogOpen}
        onOpenChange={setArchivedDialogOpen}
      />
    </div>
  );
}
