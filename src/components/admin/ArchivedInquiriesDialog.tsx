import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Archive, 
  User, 
  Mail, 
  Clock, 
  Trash2,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ArchivedInquiry {
  id: string;
  original_id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  status: string;
  original_created_at: string;
  archived_at: string;
}

interface ArchivedInquiriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchivedInquiriesDialog({ open, onOpenChange }: ArchivedInquiriesDialogProps) {
  const [archivedInquiries, setArchivedInquiries] = useState<ArchivedInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchArchivedInquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_inquiries_archive')
        .select('*')
        .order('archived_at', { ascending: false });

      if (error) throw error;
      setArchivedInquiries(data || []);
    } catch (error) {
      console.error('Error fetching archived inquiries:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load archived inquiries',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchArchivedInquiries();
      setSelectedIds(new Set());
    }
  }, [open]);

  const filteredInquiries = archivedInquiries.filter(inquiry =>
    inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    if (selectedIds.size === filteredInquiries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInquiries.map(i => i.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;

    try {
      const { error } = await supabase
        .from('customer_inquiries_archive')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      setArchivedInquiries(prev => prev.filter(i => !selectedIds.has(i.id)));
      setSelectedIds(new Set());

      toast({
        title: 'Deleted',
        description: `${selectedIds.size} archived inquiries permanently deleted`,
      });
    } catch (error) {
      console.error('Error deleting archived inquiries:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete archived inquiries',
      });
    }
  };

  const clearAllArchive = async () => {
    if (archivedInquiries.length === 0) return;

    try {
      const { error } = await supabase
        .from('customer_inquiries_archive')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      setArchivedInquiries([]);
      setSelectedIds(new Set());

      toast({
        title: 'Archive Cleared',
        description: 'All archived inquiries have been permanently deleted',
      });
    } catch (error) {
      console.error('Error clearing archive:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to clear archive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Archived Inquiries
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search archived inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchArchivedInquiries}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Bulk Actions */}
        {filteredInquiries.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-muted/30 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              className="text-xs"
            >
              {selectedIds.size === filteredInquiries.length ? 'Deselect All' : 'Select All'}
            </Button>
            {selectedIds.size > 0 && (
              <>
                <Badge variant="secondary" className="text-xs">
                  {selectedIds.size} selected
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelected}
                  className="gap-1 text-xs ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Selected
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllArchive}
              className="gap-1 text-xs text-red-400 hover:text-red-300 hover:border-red-400/50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium text-white">No Archived Inquiries</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No results match your search' : 'Archived inquiries will appear here'}
              </p>
            </div>
          ) : (
            filteredInquiries.map((inquiry) => (
              <Card
                key={inquiry.id}
                className={`border-border/50 cursor-pointer transition-colors ${
                  selectedIds.has(inquiry.id) ? 'bg-primary/10 border-primary/50' : ''
                }`}
                onClick={() => toggleSelection(inquiry.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(inquiry.id)}
                      onChange={() => toggleSelection(inquiry.id)}
                      className="mt-1 h-4 w-4 rounded border-gray-600 bg-background"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white truncate">{inquiry.subject}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          Archived
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {inquiry.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {inquiry.email}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{inquiry.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Created: {format(new Date(inquiry.original_created_at), 'MMM d, yyyy h:mm a')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Archive className="w-3 h-3" />
                          Archived: {format(new Date(inquiry.archived_at), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
