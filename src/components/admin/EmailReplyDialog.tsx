import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Send, 
  Mail, 
  FileText, 
  Edit3, 
  Loader2,
  User,
  Hash,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  CreditCard
} from 'lucide-react';

interface EmailReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
  } | null;
  manualMode?: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  icon: React.ReactNode;
}

// Extract Order ID from inquiry message or subject
const extractOrderId = (text: string): string | null => {
  // Match patterns like ORD-1234567890-abc123, ORD-xxx
  const orderPatterns = [
    /ORD-\d{13}-[a-zA-Z0-9]+/gi,
    /ORD-[a-zA-Z0-9-]+/gi,
    /Order:\s*([A-Z0-9-]+)/gi,
    /order\s*id[:\s]*([A-Z0-9-]+)/gi,
  ];
  
  for (const pattern of orderPatterns) {
    const match = text.match(pattern);
    if (match && match[0]) {
      return match[0].replace(/Order:\s*/i, '').replace(/order\s*id[:\s]*/i, '');
    }
  }
  return null;
};

export function EmailReplyDialog({ open, onOpenChange, inquiry, manualMode = false }: EmailReplyDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('refund_cancelled');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // Manual mode fields
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const { toast } = useToast();

  // Extract order ID from inquiry
  const orderId = inquiry ? extractOrderId(`${inquiry.subject} ${inquiry.message}`) : null;

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'refund_cancelled',
      name: 'Order Cancelled - Refund',
      subject: `Re: ${inquiry?.subject || 'Your Order'} - Refund Information`,
      icon: <RefreshCw className="w-4 h-4" />,
      content: `Thank you for contacting Midasbuy Support.

We understand your concern regarding your order${orderId ? ` (${orderId})` : ''}. After reviewing your case, we regret to inform you that your order has been cancelled due to a payment processing issue.

📌 REFUND INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━
• Your payment amount is currently on hold with your bank/payment provider
• The refund will be automatically processed within 2-15 business days
• The exact timeline depends on your bank's processing time
• No action is required from your side

⚠️ IMPORTANT NOTE:
For future purchases, we recommend using a different payment method or card to avoid similar issues.

If you have any further questions or if the refund is not reflected in your account after 15 business days, please don't hesitate to contact us again.

We sincerely apologize for any inconvenience caused.`
    },
    {
      id: 'payment_failed',
      name: 'Payment Failed',
      subject: `Re: ${inquiry?.subject || 'Your Order'} - Payment Issue`,
      icon: <CreditCard className="w-4 h-4" />,
      content: `Thank you for reaching out to Midasbuy Support.

We have reviewed your inquiry regarding the payment issue${orderId ? ` for order ${orderId}` : ''}.

📌 PAYMENT STATUS:
━━━━━━━━━━━━━━━━━━━━━━━━
• Your payment was not successfully processed
• If any amount was deducted from your account, it will be automatically refunded
• Refund timeline: 2-15 business days (depending on your bank)

💡 RECOMMENDED STEPS:
1. Please check your bank statement after 3-5 business days
2. If the amount was deducted, it will be reversed automatically
3. For a new purchase, please try using a different payment method

We apologize for any inconvenience and thank you for your patience.`
    },
    {
      id: 'order_pending',
      name: 'Order Under Review',
      subject: `Re: ${inquiry?.subject || 'Your Order'} - Order Status Update`,
      icon: <AlertCircle className="w-4 h-4" />,
      content: `Thank you for contacting Midasbuy Support.

We have received your inquiry regarding your order${orderId ? ` (${orderId})` : ''} and our team is currently reviewing it.

📌 CURRENT STATUS:
━━━━━━━━━━━━━━━━━━━━━━━━
• Your order is under review by our processing team
• We are verifying the payment and delivery details
• You will receive an update within 24-48 hours

📧 WHAT TO EXPECT:
• Our team will process your request as soon as possible
• If UC/Diamonds delivery is confirmed, they will be credited to your game account
• If there's any issue, we will contact you with further instructions

Thank you for your patience and understanding.`
    },
    {
      id: 'delivery_confirmed',
      name: 'Delivery Confirmed',
      subject: `Re: ${inquiry?.subject || 'Your Order'} - Delivery Confirmation`,
      icon: <CheckCircle className="w-4 h-4" />,
      content: `Thank you for contacting Midasbuy Support.

We're happy to inform you that your order${orderId ? ` (${orderId})` : ''} has been successfully delivered!

📌 DELIVERY DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━
• Your UC/Diamonds have been credited to your game account
• Please check your in-game wallet to confirm the balance
• If you don't see the items, please restart your game

💡 HELPFUL TIPS:
• Make sure you're checking the correct Player ID/Account
• Sometimes it may take a few minutes to reflect in-game
• If still not visible after 30 minutes, please contact us again

Thank you for choosing Midasbuy! We appreciate your business.`
    }
  ];

  // Reset manual fields when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setManualEmail('');
      setManualName('');
    }
  }, [open]);

  // Set initial template content when inquiry changes
  useEffect(() => {
    if (inquiry || manualMode) {
      const template = emailTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        setEmailSubject(template.subject);
        setEmailContent(template.content);
      }
    }
  }, [inquiry, selectedTemplate, manualMode]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailContent(template.content);
      setIsEditing(false);
    }
  };

  const handleSendEmail = async () => {
    const targetEmail = manualMode ? manualEmail : inquiry?.email;
    const targetName = manualMode ? manualName : inquiry?.name;

    if (!targetEmail || !emailContent.trim() || !emailSubject.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: manualMode ? 'Please enter customer email, subject and content' : 'Please fill in all required fields',
      });
      return;
    }

    if (manualMode && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(manualEmail)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
      });
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-inquiry-reply', {
        body: {
          customerEmail: targetEmail,
          customerName: targetName || 'Valued Customer',
          subject: emailSubject,
          emailContent: emailContent,
          orderId: orderId,
          templateType: selectedTemplate,
        },
      });

      if (error) throw error;

      // Log the email send
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('inquiry_email_log').insert({
        inquiry_id: inquiry?.id || null,
        customer_email: targetEmail,
        template_type: selectedTemplate,
        subject: emailSubject,
        sent_by: user?.id || null,
      });

      toast({
        title: '✅ Email Sent',
        description: `Email sent to ${targetEmail}`,
      });

      // Mark inquiry as read after sending (only for inquiry mode)
      if (!manualMode && inquiry) {
        await supabase
          .from('customer_inquiries')
          .update({ is_read: true })
          .eq('id', inquiry.id);
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Send',
        description: error.message || 'Could not send email. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!manualMode && !inquiry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="w-5 h-5 text-primary" />
            {manualMode ? 'Send Manual Email' : 'Reply to Customer Inquiry'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info Section */}
          {manualMode ? (
            /* Manual Mode - input fields */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex flex-col gap-1">
                <Label htmlFor="manual-name" className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Customer Name (Optional)
                </Label>
                <Input
                  id="manual-name"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Ali Hassan"
                  className="bg-background border-border"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="manual-email" className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Customer Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="manual-email"
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="bg-background border-border"
                />
              </div>
            </div>
          ) : (
            /* Inquiry Mode - show inquiry info */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm font-medium text-foreground">{inquiry?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm font-medium text-primary">{inquiry?.email}</span>
              </div>
              {orderId && (
                <div className="flex items-center gap-2 col-span-full">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Order ID:</span>
                  <Badge variant="secondary" className="font-mono text-xs">{orderId}</Badge>
                </div>
              )}
              <div className="col-span-full">
                <span className="text-sm text-muted-foreground">Original Message:</span>
                <p className="text-sm text-foreground/80 mt-1 p-2 bg-background rounded border border-border/30 max-h-20 overflow-y-auto">
                  {inquiry?.message}
                </p>
              </div>
            </div>
          )}

          {/* Template Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Email Template</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {emailTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={selectedTemplate === template.id ? 'text-primary' : 'text-muted-foreground'}>
                      {template.icon}
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${
                    selectedTemplate === template.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {template.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Email Subject */}
          <div>
            <Label htmlFor="email-subject" className="text-sm font-medium mb-2 block">
              Email Subject
            </Label>
            <Input
              id="email-subject"
              value={emailSubject}
              onChange={(e) => {
                setEmailSubject(e.target.value);
                setIsEditing(true);
              }}
              className="bg-background border-border"
              placeholder="Enter email subject..."
            />
          </div>

          {/* Email Content Preview/Edit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Email Content</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="gap-1.5 text-xs h-7"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'Preview' : 'Edit'}
              </Button>
            </div>
            
            {isEditing ? (
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[300px] bg-background border-border font-mono text-sm"
                placeholder="Enter email content..."
              />
            ) : (
              <div className="min-h-[300px] p-4 rounded-lg border border-border bg-[#0f1a2e] overflow-y-auto">
                {/* Email Preview */}
                <div className="max-w-md mx-auto">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary to-purple-600 rounded-t-lg p-4 text-center">
                    <h3 className="text-white font-bold text-lg">Midasbuy Support</h3>
                    <p className="text-white/80 text-xs mt-1">Customer Support Response</p>
                  </div>
                  
                  {/* Content */}
                  <div className="bg-[#1a2744] p-4 rounded-b-lg border border-border/30 border-t-0">
                     <p className="text-white text-sm mb-3">
                       Dear <span className="text-primary font-medium">{manualMode ? (manualName || 'Valued Customer') : (inquiry?.name || 'Valued Customer')}</span>,
                     </p>
                    
                    {orderId && (
                      <div className="bg-primary/10 rounded p-2 mb-3 border border-primary/30">
                        <span className="text-muted-foreground text-xs">Order Reference:</span>
                        <p className="text-primary text-xs font-mono">{orderId}</p>
                      </div>
                    )}
                    
                    <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {emailContent}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-border/30">
                      <p className="text-gray-300 text-sm">Best Regards,</p>
                      <p className="text-primary font-bold text-sm">Midasbuy Support Team</p>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-border/30 text-center">
                      <p className="text-muted-foreground text-xs">© 2026 Midasbuy. All rights reserved.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSending || !emailContent.trim() || !emailSubject.trim()}
            className="gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
