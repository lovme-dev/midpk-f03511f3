import { useNavigate } from "@/lib/router-compat";
import reviewStars from "@/assets/review-stars.png";

interface ReviewRatingBadgeProps {
  rating?: number;
  reviewCount?: number;
  className?: string;
}

const ReviewRatingBadge = ({
  rating = 4.9,
  reviewCount = 80837,
  className = "",
}: ReviewRatingBadgeProps) => {
  const navigate = useNavigate();

  const formatReviewCount = (count: number) => {
    return count.toLocaleString();
  };

  return (
    <button
      onClick={() => navigate('/customer-reviews')}
      className={`flex flex-col items-center gap-1 cursor-pointer group ${className}`}
    >
      {/* Star Image */}
      <img loading="lazy" decoding="async" 
        src={reviewStars} 
        alt="Review Stars" 
        className="h-5 w-auto object-contain"
      />

      {/* Verified Reviews Text - same color as Payment Channels text */}
      <span className="text-xs text-white group-hover:text-gray-200 transition-colors">
        {formatReviewCount(reviewCount)} verified reviews
      </span>
    </button>
  );
};

export default ReviewRatingBadge;
