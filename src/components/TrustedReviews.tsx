import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface TrustedReviewsProps {
  rating?: number;
  reviewCount?: number;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TrustedReviews = ({ 
  rating = 5.0, 
  reviewCount = 2902376, 
  showText = true, 
  size = "md",
  className = ""
}: TrustedReviewsProps) => {
  const sizeClasses = {
    sm: {
      container: "flex items-center gap-1.5",
      star: "h-3 w-3",
      rating: "text-sm font-bold",
      count: "text-xs",
      text: "text-xs"
    },
    md: {
      container: "flex items-center gap-2",
      star: "h-4 w-4",
      rating: "text-base font-bold",
      count: "text-sm",
      text: "text-sm"
    },
    lg: {
      container: "flex items-center gap-3",
      star: "h-5 w-5",
      rating: "text-lg font-bold",
      count: "text-base",
      text: "text-base"
    }
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toLocaleString();
  };

  return (
    <motion.div 
      className={`${sizeClasses[size].container} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Rating Number */}
      <span className={`${sizeClasses[size].rating} text-yellow-400`}>
        {rating.toFixed(1)}
      </span>
      
      {/* Stars */}
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size].star} ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      
      {/* Review Count */}
      <span className={`${sizeClasses[size].count} text-gray-300`}>
        ({formatReviewCount(reviewCount)})
      </span>
      
      {/* Trusted Text */}
      {showText && (
        <span className={`${sizeClasses[size].text} text-green-400 font-medium`}>
          Trusted Worldwide
        </span>
      )}
    </motion.div>
  );
};

export default TrustedReviews;