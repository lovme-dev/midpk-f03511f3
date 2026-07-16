import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Star, 
  StarHalf,
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  ShieldCheck, 
  Filter, 
  ChevronDown, 
  Search, 
  MoreHorizontal,
  Send,
  User,
  CornerDownRight,
  X,
  ArrowLeft,
  Camera,
  Upload,
  Trash2,
  Lock
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '@/contexts/AuthModalContext';
import defaultAvatar from '@/assets/default-avatar.jpeg';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import { useTranslation } from 'react-i18next';

// --- Types & Constants ---

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  isAdmin?: boolean;
}

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  helpfulCount: number;
  isLiked: boolean;
  verified: boolean;
  country: string;
  itemsPurchased?: string;
  reply?: {
    author: string;
    content: string;
    date: string;
  };
  comments: Comment[];
  isCurrentUser?: boolean;
}

const RECENT_TIMES = ['Just now', '2 mins ago', '15 mins ago', '1 hour ago', '3 hours ago', 'Today', 'Yesterday'];
const NOV_DATES = [
  '01 Nov, 2026', '03 Nov, 2026', '05 Nov, 2026', '08 Nov, 2026', 
  '12 Nov, 2026', '14 Nov, 2026', '19 Nov, 2026', '22 Nov, 2026', 
  '26 Nov, 2026', '30 Nov, 2026'
];

const COUNTRIES = ['IN', 'PK', 'TR', 'US', 'BR', 'ID', 'SA', 'BD'];

// Country-specific names - no mixing
const NAMES_BY_COUNTRY: Record<string, string[]> = {
  PK: ['Hamza Malik', 'Usman Ahmed', 'Bilal Khan', 'Zain Ali', 'Farhan Raza', 'Shahzaib Iqbal', 'Abdullah Tariq', 'Umer Siddiqui', 'Talha Noor', 'Hassan Javed', 'Asad Mehmood', 'Faisal Rehman', 'Danish Aslam', 'Ahsan Saeed', 'Adeel Nawaz', 'Kamran Younis', 'Naveed Shah', 'Waqas Hussain', 'Junaid Akram', 'Sohail Riaz'],
  US: ['Jake Wilson', 'Brandon Smith', 'Tyler Johnson', 'Ryan Miller', 'Chris Davis', 'Mike Thompson', 'Kevin Brown', 'Jason Taylor', 'Matt Anderson', 'Andrew Martin', 'David White', 'Steven Harris', 'Daniel Clark', 'James Robinson', 'Robert Walker', 'William Hall', 'Joseph Young', 'Charles King', 'Thomas Wright', 'Michael Scott'],
  IN: ['Rahul Sharma', 'Arjun Patel', 'Vikram Singh', 'Rohit Kumar', 'Amit Verma', 'Suresh Reddy', 'Karan Mehta', 'Deepak Gupta', 'Nikhil Joshi', 'Arun Nair', 'Sanjay Desai', 'Prakash Rao', 'Vijay Iyer', 'Rajesh Pillai', 'Gaurav Thakur', 'Manish Bhat', 'Ankit Kapoor', 'Vishal Malhotra', 'Sachin Hegde', 'Prateek Menon'],
  TR: ['Mehmet Yilmaz', 'Ahmet Demir', 'Mustafa Kaya', 'Emre Celik', 'Can Ozturk', 'Burak Aydin', 'Omer Sahin', 'Serkan Yildiz', 'Hakan Arslan', 'Kemal Erdogan', 'Tolga Aksoy', 'Okan Polat', 'Baris Koç', 'Deniz Kara', 'Enes Dogan', 'Volkan Aslan', 'Onur Bulut', 'Murat Tan', 'Cenk Gul', 'Tuncay Kurt'],
  BR: ['Lucas Silva', 'Gabriel Santos', 'Matheus Oliveira', 'Felipe Costa', 'Bruno Souza', 'Rafael Pereira', 'Gustavo Lima', 'Pedro Almeida', 'Thiago Rocha', 'Diego Ferreira', 'Caio Ribeiro', 'Leonardo Martins', 'Andre Carvalho', 'Rodrigo Barbosa', 'Vinicius Gomes', 'Marcos Araujo', 'Eduardo Castro', 'Fernando Dias', 'Henrique Nunes', 'Ricardo Moraes'],
  ID: ['Rizky Pratama', 'Adi Nugroho', 'Budi Santoso', 'Dimas Wijaya', 'Fajar Kusuma', 'Gilang Ramadhan', 'Hendra Saputra', 'Irfan Hidayat', 'Joko Susilo', 'Kevin Setiawan', 'Luthfi Rahman', 'Muhammad Putra', 'Nanda Permana', 'Oscar Wibowo', 'Prasetyo Andi', 'Reza Firmansyah', 'Satria Dwi', 'Taufik Hadi', 'Umar Faruq', 'Wahyu Surya'],
  SA: ['Khalid Al-Rashid', 'Omar Al-Saud', 'Faisal Al-Dosari', 'Sultan Al-Qahtani', 'Nawaf Al-Shehri', 'Turki Al-Otaibi', 'Mohammed Al-Harbi', 'Bandar Al-Zahrani', 'Abdulaziz Al-Ghamdi', 'Majed Al-Malki', 'Saud Al-Mutairi', 'Yusuf Al-Shamrani', 'Ibrahim Al-Dossary', 'Saleh Al-Ahmadi', 'Hamad Al-Subaie', 'Talal Al-Anazi', 'Rayan Al-Jaber', 'Nasser Al-Khaldi', 'Fahad Al-Thubaiti', 'Waleed Al-Shammari'],
  BD: ['Rahim Chowdhury', 'Kamal Hossain', 'Rafiq Rahman', 'Tanvir Ahmed', 'Shakil Mia', 'Faruk Islam', 'Jahid Hasan', 'Masud Rana', 'Rubel Khan', 'Sohel Uddin', 'Belal Sarker', 'Imran Mahmud', 'Nazmul Haque', 'Ripon Das', 'Shahin Alam', 'Liton Talukder', 'Milon Sheikh', 'Saiful Bhuiyan', 'Touhid Sikder', 'Habib Molla']
};

// Used names tracker to prevent duplicates
const usedNames = new Set<string>();

const getUniqueName = (country: string): string => {
  const countryNames = NAMES_BY_COUNTRY[country] || NAMES_BY_COUNTRY['US'];
  const availableNames = countryNames.filter(name => !usedNames.has(name));
  
  if (availableNames.length === 0) {
    // Reset if all names used
    countryNames.forEach(name => usedNames.delete(name));
    const randomName = countryNames[Math.floor(Math.random() * countryNames.length)];
    usedNames.add(randomName);
    return randomName;
  }
  
  const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
  usedNames.add(randomName);
  return randomName;
};

const ITEMS = [
  '2000 + 1250 UC', 
  '3000 + 1250 UC', 
  '7000 + 3904 UC', 
  '12000 + 5668 UC', 
  '2000 + 1250 UC (Bonus Pack)'
];

const FEEDBACK_TEMPLATES = [
  "I was worried about buying the 3000+1250 UC pack, but it arrived instantly! Trusted.",
  "The 60% OFF deal on the 7000+3904 UC pack is insane. Maxed out my X-Suit today.",
  "Got the 2000 + 1250 UC. Delivery was immediate. Best prices I've seen for big packs.",
  "Finally upgraded my M416 Glacier to Max level using the 7000 UC pack. Thanks!",
  "Payment was smooth. I bought the 3000 UC pack and received the 1250 bonus immediately.",
  "Authentic UC. I always buy the 7000+3904 pack here for my clan giveaways.",
  "Safe and secure. The 3000 + 1250 UC pack is the best value right now.",
  "Customer support helped me when my bank declined. Fixed in 5 mins. Got my 2000 UC.",
];

const COMMENT_TEMPLATES = [
  "Bro, did you get the bonus UC instantly?",
  "Congrats on the Glacier skin!",
  "Is this site legit? I want to buy the 3000 pack too.",
  "Same here, got mine in under 1 minute.",
  "Nice! I'm waiting for my salary to buy the 7k pack.",
  "Trusted 100%.",
  "Enjoy the game bro!",
  "How long did it take?",
  "Can I use Easypaisa for this?",
  "Best site ever.",
  "I just bought 2 packs, waiting for delivery.",
  "Don't worry, it usually takes 30 seconds.",
  "Wow, 60% off is huge.",
  "Adding this to my favorites.",
  "Valid review, I know him from Discord.",
  "Glacier Max looks sick!",
  "Checking my account now... received!",
  "Thanks for the info.",
  "Legit 100% no ban risk.",
  "Midasbuy OP."
];

const generateCommentDate = (reviewDate: string): string => {
  if (reviewDate.includes('Nov, 2026')) {
    const day = parseInt(reviewDate.split(' ')[0]);
    const delay = Math.floor(Math.random() * 5);
    const commentDay = day + delay;
    
    if (commentDay > 30) {
      const decDay = commentDay - 30;
      return `0${decDay} Dec, 2026`;
    }
    
    const dayStr = commentDay < 10 ? `0${commentDay}` : `${commentDay}`;
    return `${dayStr} Nov, 2026`;
  }

  if (reviewDate === 'Yesterday') return 'Today';
  if (reviewDate === 'Today') return 'Just now';
  if (reviewDate.includes('ago')) return 'Just now';
  if (reviewDate === 'Just now') return 'Just now';
  
  return 'Just now';
};

const generateReviews = (count: number, startIndex: number = 0): Review[] => {
  // Reset used names for fresh generation
  usedNames.clear();
  
  return Array.from({ length: count }).map((_, idx) => {
    const i = startIndex + idx;
    const isViral = i < 200; 
    
    const reviewDate = i < 200 
      ? NOV_DATES[Math.floor(Math.random() * NOV_DATES.length)] 
      : RECENT_TIMES[i % RECENT_TIMES.length];

    // Select country first
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];

    const numComments = isViral 
      ? Math.floor(Math.random() * 41) + 20
      : Math.floor(Math.random() * 6);

    const comments: Comment[] = [];
    for (let j = 0; j < numComments; j++) {
      // Comments can be from any country
      const commentCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      const commentNames = NAMES_BY_COUNTRY[commentCountry] || NAMES_BY_COUNTRY['US'];
      comments.push({
        id: `cmt-${i}-${j}-${Math.random().toString(36)}`,
        author: commentNames[Math.floor(Math.random() * commentNames.length)],
        avatar: `https://picsum.photos/seed/${Math.random()}/50/50`,
        content: COMMENT_TEMPLATES[Math.floor(Math.random() * COMMENT_TEMPLATES.length)],
        date: generateCommentDate(reviewDate)
      });
    }

    return {
      id: `rev-${Math.random().toString(36).substr(2, 9)}`,
      author: getUniqueName(country),
      avatar: `https://picsum.photos/seed/${i + 123}/150/150`,
      rating: Math.random() > 0.1 ? 5 : 4,
      date: reviewDate,
      content: FEEDBACK_TEMPLATES[Math.floor(Math.random() * FEEDBACK_TEMPLATES.length)],
      helpfulCount: isViral ? Math.floor(Math.random() * 500) + 50 : Math.floor(Math.random() * 50) + 1,
      isLiked: false,
      verified: true,
      country: country,
      itemsPurchased: ITEMS[Math.floor(Math.random() * ITEMS.length)],
      comments: comments,
      reply: (Math.random() > 0.9 && !isViral) ? {
          author: "Midasbuy Support",
          content: "Thank you for trusting us with your purchase! Good luck with your crate openings! 🎮",
          date: "Just now"
      } : undefined,
      isCurrentUser: false
    };
  });
};

// --- Sub-Components ---

const StarRating = ({ rating, size = 16 }: { rating: number, size?: number }) => {
  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-700 text-slate-700'
          }`}
        />
      ))}
    </div>
  );
};

// Note: VerifiedBadge needs t() from the parent component, so we'll handle it in ReviewCard
const VerifiedBadge = ({ label }: { label: string }) => (
  <div className="flex items-center space-x-1 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full w-fit">
    <CheckCircle2 size={12} />
    <span>{label}</span>
  </div>
);

// Review Card Component
interface ReviewCardProps {
  review: Review;
  index: number;
  onLike: (id: string) => void;
  onAddComment: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  userAvatarUrl: string | null;
}

const ReviewCard = ({ review, index, onLike, onAddComment, onDelete, isLoggedIn, onLoginRequired, userAvatarUrl }: ReviewCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    
    onAddComment(review.id, commentText);
    setCommentText("");
    setShowComments(true);
  };

  return (
    <div 
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-4 hover:border-blue-500/30 hover:bg-slate-800 hover:shadow-xl hover:shadow-blue-500/5 hover:scale-[1.01] transition-all duration-300 shadow-sm animate-fade-in"
      style={{ animationDelay: `${(index % 10) * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={review.avatar} 
              alt={review.author} 
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
            />
            <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5 border border-slate-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center text-slate-300">
                {review.country}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white text-sm md:text-base flex items-center gap-2">
              {review.author}
              {review.verified && <VerifiedBadge label={t('customerReviews.verifiedPurchase', 'Verified Purchase')} />}
            </h4>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
              {review.itemsPurchased && (
                <>
                  <span className="text-yellow-500 font-medium">{review.itemsPurchased}</span>
                  <span>•</span>
                </>
              )}
              <span>{review.date}</span>
            </div>
          </div>
        </div>
        
        {review.isCurrentUser && (
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center text-slate-500 hover:text-white cursor-pointer transition-colors p-1 rounded-full hover:bg-slate-700/50"
            >
                <MoreHorizontal size={20} />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 w-32 overflow-hidden animate-fade-in origin-top-right">
                  <button 
                      onClick={() => onDelete(review.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50 hover:text-red-300 transition-colors flex items-center gap-2"
                  >
                      <Trash2 size={14} /> Delete
                  </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-3">
        <StarRating rating={review.rating} size={18} />
      </div>

      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        {review.content}
      </p>

      {review.reply && (
          <div className="bg-slate-700/30 border-l-2 border-blue-500 p-3 rounded-r-lg mb-4 text-sm">
              <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-blue-400 text-xs">{review.reply.author}</span>
                  <span className="text-slate-500 text-[10px]">{review.reply.date}</span>
              </div>
              <p className="text-slate-400 text-xs">{review.reply.content}</p>
          </div>
      )}

      {!showComments && review.comments.length > 0 && (
        <div 
          onClick={() => setShowComments(true)}
          className="mb-4 bg-slate-900/40 p-3 rounded-lg border border-slate-700/30 flex gap-3 items-center cursor-pointer hover:bg-slate-900/60 transition-colors group"
        >
           <CornerDownRight size={16} className="text-slate-500" />
           <div className="flex-1">
             <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-slate-300">{review.comments[0].author}</span>
                <span className="text-slate-500 text-[10px]">{review.comments[0].date}</span>
             </div>
             <p className="text-xs text-slate-400 line-clamp-1 group-hover:text-slate-300 transition-colors">
               {review.comments[0].content}
             </p>
           </div>
           <div className="text-[10px] text-blue-400 font-medium whitespace-nowrap">
             View all {review.comments.length} replies
           </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onLike(review.id)}
            className={`flex items-center space-x-1.5 transition-colors text-xs font-medium group ${review.isLiked ? 'text-blue-400' : 'text-slate-400 hover:text-blue-400'}`}
          >
            <ThumbsUp size={14} className={`group-hover:scale-110 transition-transform ${review.isLiked ? 'fill-blue-400' : ''}`} />
            <span>Helpful ({review.helpfulCount})</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center space-x-1.5 transition-colors text-xs font-medium ${showComments ? 'text-blue-400' : 'text-slate-400 hover:text-blue-400'}`}
          >
            <MessageSquare size={14} />
            <span>Comment {review.comments.length > 0 && `(${review.comments.length})`}</span>
          </button>
        </div>
        <div className="flex items-center text-xs text-slate-500 gap-1">
            <ShieldCheck size={12} className="text-blue-500" />
            <span>Midasbuy Guaranteed</span>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-700/30 animate-fade-in">
          {review.comments.length > 0 && (
            <div className="space-y-3 mb-4 pl-2 max-h-60 overflow-y-auto pr-1">
              {review.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 text-sm">
                  <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full border border-slate-600 shrink-0" />
                  <div className="bg-slate-700/40 rounded-lg p-3 flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-200 text-xs">{comment.author}</span>
                      <span className="text-slate-500 text-[10px]">{comment.date}</span>
                    </div>
                    <p className="text-slate-300 text-xs">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
              {userAvatarUrl ? (
                <img src={userAvatarUrl} alt="You" className="w-full h-full object-cover" />
              ) : (
                <img src={defaultAvatar} alt="You" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="relative flex-1">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..." 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-2 pl-4 pr-10 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:bg-slate-700 transition-all"
              >
                <Send size={12} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// --- Modal Component for Write Review ---

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: { name: string; rating: number; content: string; avatar: string | null }) => void;
  userProfile: { name: string; avatarUrl: string | null };
}

const WriteReviewModal = ({ isOpen, onClose, onSubmit, userProfile }: WriteReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: userProfile.name, rating, content, avatar: userProfile.avatarUrl });
    setRating(5);
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white mb-6">Write a Review</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Profile Display (Read-only) */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-600 overflow-hidden">
              <img 
                src={userProfile.avatarUrl || defaultAvatar} 
                alt="Your Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Name Display (Read-only) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Your Name</label>
            <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-sm text-white">
              {userProfile.name || 'Anonymous'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star 
                    size={28} 
                    className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-800 text-slate-600'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Review</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience..."
              required
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---

interface CustomerReviewsPageProps {
  onLogout: () => void;
}

export default function CustomerReviewsPage({ onLogout }: CustomerReviewsPageProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState('All');
  const [visibleReviews, setVisibleReviews] = useState(6);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; avatarUrl: string | null }>({ name: '', avatarUrl: null });
  const [userCountry, setUserCountry] = useState<string>('US');
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const { t } = useTranslation();

  useEffect(() => {
    setReviews(generateReviews(30, 0));
    
    // Detect user's real country from IP
    const detectUserCountry = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const geoData = await geoResponse.json();
        if (geoData.country_code) {
          setUserCountry(geoData.country_code);
        }
      } catch (error) {
        console.error('Failed to detect country:', error);
      }
    };
    detectUserCountry();
    
    // Check if user is logged in and fetch profile
    const checkAuthAndLoadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
      
      if (session?.user) {
        // Fetch user profile from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', session.user.id)
          .single();
        
        setUserProfile({
          name: profileData?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatarUrl: session.user.user_metadata?.avatar_url || null
        });
      }
    };
    checkAuthAndLoadProfile();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', session.user.id)
          .single();
        
        setUserProfile({
          name: profileData?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatarUrl: session.user.user_metadata?.avatar_url || null
        });
      } else {
        setUserProfile({ name: '', avatarUrl: null });
        setUserId(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const totalReviews = 80837;
  const averageRating = 4.9;
  const ratingDistribution = [88, 8, 2, 1, 1];

  const handleLoadMore = () => {
    const currentCount = reviews.length;
    const newReviews = generateReviews(5, currentCount);
    setReviews(prev => [...prev, ...newReviews]);
    setVisibleReviews(prev => prev + 5);
  };

  const handleLike = (id: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === id) {
        return {
          ...review,
          isLiked: !review.isLiked,
          helpfulCount: review.isLiked ? review.helpfulCount - 1 : review.helpfulCount + 1
        };
      }
      return review;
    }));
  };

  const handleAddComment = (id: string, text: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === id) {
        const newComment: Comment = {
          id: `cmt-${Date.now()}`,
          author: userProfile.name || "You",
          avatar: userProfile.avatarUrl || defaultAvatar,
          content: text,
          date: "Just now"
        };
        return {
          ...review,
          comments: [...review.comments, newComment]
        };
      }
      return review;
    }));
  };

  const handleDeleteReview = (id: string) => {
    setReviews(prev => prev.filter(review => review.id !== id));
  };

  const handleReviewSubmit = (reviewData: { name: string; rating: number; content: string; avatar: string | null }) => {
    const newReview: Review = {
      id: `rev-new-${Date.now()}`,
      author: userProfile.name || reviewData.name,
      avatar: userProfile.avatarUrl || reviewData.avatar || defaultAvatar,
      rating: reviewData.rating,
      date: 'Just now',
      content: reviewData.content,
      helpfulCount: 0,
      isLiked: false,
      verified: false,
      country: userCountry,
      itemsPurchased: undefined,
      comments: [],
      isCurrentUser: true
    };
    
    setReviews(prev => [newReview, ...prev]);
    setIsReviewModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue flex flex-col">
      <SEOHelmet 
        title="Customer Reviews - Midasbuy | 80,000+ Verified Reviews"
        description="Read 80,000+ verified customer reviews for Midasbuy. See real feedback from gamers worldwide about PUBG UC and Free Fire diamond purchases. 4.9 star rating."
        keywords="midasbuy reviews, customer reviews, PUBG UC reviews, Free Fire reviews, verified reviews, gaming store reviews"
        canonicalUrl="/customer-reviews"
      />
      <Header onLogout={onLogout} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pt-24">
        
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-slate-400 hover:text-white mb-2 hover:bg-slate-800/50 w-fit px-3 py-2 rounded-lg transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t('customerReviews.back', 'Back')}</span>
        </button>

        {/* Hero / Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 mt-2">
          
          {/* Left: Overall Rating */}
          <div className="md:col-span-4 lg:col-span-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700 shadow-lg relative overflow-hidden animate-fade-in flex flex-col items-center justify-center">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Star size={100} />
            </div>

            <div className="text-center relative z-10 w-full">
                <div className="flex items-end justify-center gap-2 mb-1">
                    <h2 className="text-5xl font-extrabold text-white leading-none">{averageRating}</h2>
                    <span className="text-slate-400 font-medium mb-1.5">/ 5.0</span>
                </div>
                
                <div className="flex items-center justify-center mb-3 space-x-1">
                    {[1, 2, 3, 4].map(i => (
                        <Star key={i} size={20} className="fill-yellow-400 text-yellow-400 drop-shadow-md" />
                    ))}
                    <div className="relative">
                        <Star size={20} className="text-slate-600 fill-slate-700/50" />
                        <StarHalf size={20} className="absolute top-0 left-0 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                    </div>
                </div>
                
                <p className="text-slate-400 text-xs mb-4">{totalReviews.toLocaleString()} {t('customerReviews.verifiedReviews', 'verified reviews')}</p>
                
                {isLoggedIn ? (
                  <button 
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all hover:scale-[1.02] shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                      {t('customerReviews.writeReview', 'Write a Review')}
                  </button>
                ) : (
                  <button 
                    onClick={() => openAuthModal()}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 border border-slate-600"
                  >
                      <Lock size={14} />
                      {t('customerReviews.loginToReview', 'Login to Write Review')}
                  </button>
                )}
            </div>
          </div>

          {/* Right: Rating Breakdown */}
          <div className="md:col-span-8 lg:col-span-8 bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50 flex flex-col justify-center animate-fade-in backdrop-blur-sm" style={{ animationDelay: '100ms' }}>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                {t('customerReviews.ratingDistribution', 'Rating Distribution')}
                <span className="text-[10px] font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">{t('customerReviews.last12Months', 'Last 12 months')}</span>
            </h3>
            <div className="space-y-2">
              {ratingDistribution.map((percent, index) => {
                const stars = 5 - index;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center w-8 text-slate-400 text-xs font-medium">
                        <span>{stars}</span>
                        <Star size={10} className="ml-0.5" />
                    </div>
                    
                    <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    
                    <div className="w-8 text-right text-slate-400 text-xs font-medium">{percent}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 py-4">
          <h3 className="text-2xl font-bold text-white">Recent Reviews ({totalReviews.toLocaleString()})</h3>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
             {['All', '5 Stars', 'Verified Purchase'].map(f => (
                 <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                        filter === f 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                 >
                     {f}
                 </button>
             ))}
             
             <div className="h-6 w-px bg-slate-700 mx-2 hidden md:block"></div>
             
             <button className="flex items-center space-x-2 text-slate-300 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 hover:text-white">
                 <Filter size={14} />
                 <span className="text-sm">Sort: Newest</span>
                 <ChevronDown size={14} />
             </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8">
                <div className="space-y-4">
                    {reviews.slice(0, visibleReviews).map((review, index) => (
                        <ReviewCard 
                          key={review.id} 
                          review={review} 
                          index={index} 
                          onLike={handleLike}
                          onAddComment={handleAddComment}
                          onDelete={handleDeleteReview}
                          isLoggedIn={isLoggedIn}
                          onLoginRequired={() => {
                            toast.error("Please login to comment on reviews", {
                              action: {
                                label: "Login",
                                onClick: () => openAuthModal()
                              }
                            });
                          }}
                          userAvatarUrl={userProfile.avatarUrl}
                        />
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={handleLoadMore}
                        className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-8 rounded-full border border-slate-600 transition-all hover:shadow-lg"
                    >
                        <span>{t('customerReviews.loadMore', 'Show More Reviews')}</span>
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="hidden lg:block lg:col-span-4">
                <div className="sticky top-28 space-y-6">
                    {/* Trust Badges */}
                    <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Why Midasbuy?</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                <span className="text-slate-300 text-sm">Official PUBG Mobile Partner</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                <span className="text-slate-300 text-sm">Instant Delivery Guaranteed</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                <span className="text-slate-300 text-sm">24/7 Customer Support</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                <span className="text-slate-300 text-sm">Secure Payment Methods</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

      </main>

      <Footer />

      <WriteReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        onSubmit={handleReviewSubmit}
        userProfile={userProfile}
      />

    </div>
  );
}
