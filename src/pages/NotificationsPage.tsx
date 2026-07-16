import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NotificationInbox } from '@/components/notifications/NotificationInbox';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/notifications' } });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-midasbuy-darkBlue flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Notifications - Midasbuy</title>
        <meta name="description" content="View your notifications and updates from Midasbuy" />
      </Helmet>
      
      <div className="min-h-screen bg-midasbuy-darkBlue flex flex-col">
        <Header onLogout={() => {}} />
        
        <main className="flex-1 container mx-auto px-4 py-8 mt-16">
          <div className="max-w-2xl mx-auto">
            <NotificationInbox />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
