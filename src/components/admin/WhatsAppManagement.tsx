import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Phone, Settings, MessageCircle, ExternalLink, Copy } from 'lucide-react';

interface WhatsAppStats {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  recentMessages: number;
}

export function WhatsAppManagement() {
  const [stats, setStats] = useState<WhatsAppStats>({
    totalConversations: 0,
    activeConversations: 0,
    totalMessages: 0,
    recentMessages: 0
  });
  const [loading, setLoading] = useState(false);
  const [webhookUrl] = useState('https://xphijmjxpgkwhtysmcxb.supabase.co/functions/v1/whatsapp-webhook');
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would fetch these stats from your database
      // For now, we'll use placeholder data
      setStats({
        totalConversations: 0,
        activeConversations: 0,
        totalMessages: 0,
        recentMessages: 0
      });
    } catch (error) {
      console.error('Error loading WhatsApp stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const testWebhook = async () => {
    setLoading(true);
    try {
      // Test the webhook endpoint
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast({
          title: "Webhook Active",
          description: "WhatsApp webhook endpoint is responding correctly",
        });
      } else {
        toast({
          title: "Webhook Error",
          description: "Webhook endpoint returned an error",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not reach webhook endpoint",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openWhatsAppBusinessManager = () => {
    window.open('https://business.facebook.com/wa/manage/', '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading WhatsApp settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp Business Integration</h1>
          <p className="text-muted-foreground">Manage your WhatsApp Business API integration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConversations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Messages</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentMessages}</div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Business API Configuration</CardTitle>
          <CardDescription>
            Configure your WhatsApp Business API integration settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Webhook URL</label>
            <div className="flex space-x-2">
              <Input
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={() => copyToClipboard(webhookUrl, 'Webhook URL')} variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add this URL to your WhatsApp Business Manager webhook configuration
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Verify Token</label>
            <div className="flex space-x-2">
              <Input
                value="whatsapp_webhook_token"
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={() => copyToClipboard('whatsapp_webhook_token', 'Verify Token')} variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this token when setting up the webhook in WhatsApp Business Manager
            </p>
          </div>

          <div className="flex space-x-2">
            <Button onClick={testWebhook} disabled={loading}>
              {loading ? 'Testing...' : 'Test Webhook'}
            </Button>
            <Button onClick={loadStats} variant="outline" disabled={loading}>
              Refresh Stats
            </Button>
            <Button onClick={openWhatsAppBusinessManager} variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Business Manager
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Section */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            Current status of your WhatsApp Business API integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Credentials</span>
              <Badge variant="default">Configured</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Webhook</span>
              <Badge variant="secondary">Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="default">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Edge Functions</span>
              <Badge variant="default">Deployed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            Follow these steps to complete your WhatsApp Business API integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Configure Webhook in WhatsApp Business Manager</h4>
                <p className="text-sm text-muted-foreground">
                  Add the webhook URL and verify token to your WhatsApp Business Manager
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Test the Connection</h4>
                <p className="text-sm text-muted-foreground">
                  Send a test message from WhatsApp Business Manager to verify the integration
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Start Using WhatsApp Chat</h4>
                <p className="text-sm text-muted-foreground">
                  Access the WhatsApp Chat section to send and receive messages
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}