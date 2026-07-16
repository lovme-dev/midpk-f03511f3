import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Feedback {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface MyFeedbacksPageProps {
  onLogout: () => void;
}

export default function MyFeedbacksPage({ onLogout }: MyFeedbacksPageProps) {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    in_review: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('customer_inquiries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const feedbackList = (data || []) as Feedback[];
      setFeedbacks(feedbackList);

      // Calculate stats
      const newStats = {
        pending: feedbackList.filter(f => f.status === 'pending').length,
        in_review: feedbackList.filter(f => f.status === 'in_review').length,
        approved: feedbackList.filter(f => f.status === 'approved').length,
        rejected: feedbackList.filter(f => f.status === 'rejected').length
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-yellow-400 text-xs">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'in_review':
        return (
          <span className="flex items-center gap-1 text-blue-400 text-xs">
            <Eye className="w-3 h-3" />
            In Review
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center gap-1 text-green-400 text-xs">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-red-400 text-xs">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      <Header onLogout={onLogout} />
      
      <main className="flex-1 pt-16 pb-24">
        {/* Back Button and Title */}
        <div className="px-4 py-4">
          <button 
            onClick={() => navigate('/help-center')}
            className="flex items-center gap-1 text-[#38bdf8] text-sm mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Help Center
          </button>
          <h1 className="text-white text-2xl font-bold uppercase tracking-wide">
            MY FEEDBACKS
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="px-4 grid grid-cols-4 gap-2 mb-6">
          <div className="bg-[#1a2a3f] rounded-lg p-3 text-center">
            <p className="text-yellow-400 text-xl font-bold">{stats.pending}</p>
            <p className="text-[#8b9cb8] text-[10px]">Pending</p>
          </div>
          <div className="bg-[#1a2a3f] rounded-lg p-3 text-center">
            <p className="text-blue-400 text-xl font-bold">{stats.in_review}</p>
            <p className="text-[#8b9cb8] text-[10px]">In Review</p>
          </div>
          <div className="bg-[#1a2a3f] rounded-lg p-3 text-center">
            <p className="text-green-400 text-xl font-bold">{stats.approved}</p>
            <p className="text-[#8b9cb8] text-[10px]">Approved</p>
          </div>
          <div className="bg-[#1a2a3f] rounded-lg p-3 text-center">
            <p className="text-red-400 text-xl font-bold">{stats.rejected}</p>
            <p className="text-[#8b9cb8] text-[10px]">Rejected</p>
          </div>
        </div>

        {/* Feedbacks List */}
        <div className="px-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-[#8b9cb8] text-sm">Loading...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#8b9cb8] text-sm">No feedbacks submitted yet.</p>
            </div>
          ) : (
            feedbacks.map((feedback) => (
              <div 
                key={feedback.id}
                className="bg-[#1a2a3f] rounded-xl p-4 border border-[#2a3a4f]"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white text-sm font-medium flex-1 pr-2 line-clamp-1">
                    {feedback.subject}
                  </h3>
                  {getStatusBadge(feedback.status)}
                </div>
                <p className="text-[#6b7c8f] text-xs line-clamp-2 mb-2">
                  {feedback.message}
                </p>
                <p className="text-[#5a6a7e] text-[10px]">
                  {formatDate(feedback.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
