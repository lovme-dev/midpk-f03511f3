import { useResponsive } from "@/hooks/use-mobile";
import { ChevronRight, Play, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// Helper to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^&?/]+)/)?.[1];
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0`;
  }
  return url;
};

// Video data with correct thumbnails matching the reference images
// Order: First 4 are TOP row, Next 4 are BOTTOM row (for mobile column layout)
const videoData = [
  // TOP ROW (positions 1-4)
  {
    id: "video-001",
    title: "Midasbuy 2025 Christmas Special Live — Preview",
    thumbnail: "/video-thumbnails/christmas-2025.png",
    views: "1.9k",
    duration: "00:01:10",
    date: "Jan 6",
    youtubeUrl: "https://youtu.be/R48fEIuFV8I"
  },
  {
    id: "video-002",
    title: "Midasbuy x PUBG MOBILE November Giveaway Live —...",
    thumbnail: "/video-thumbnails/september-giveaway.png",
    views: "2.1k",
    duration: "00:00:58",
    date: "Jan 6",
    youtubeUrl: "https://youtu.be/OAHuY8yQTJ0"
  },
  {
    id: "video-003",
    title: "PUBG MOBILE Arctic Wolf!",
    thumbnail: "/video-thumbnails/arctic-wolf.webp",
    views: "2.9w",
    duration: "00:00:13",
    date: "Jul 6",
    youtubeUrl: "https://youtu.be/Cz1psrJoQT4"
  },
  {
    id: "video-004",
    title: "Blood Raven & Arcane Jester X-Suit",
    thumbnail: "/video-thumbnails/arcane-jester.jpeg",
    views: "1.1w",
    duration: "00:00:41",
    date: "Jul 6",
    youtubeUrl: "https://youtu.be/lcmzECMldQY"
  },
  // BOTTOM ROW (positions 5-8)
  {
    id: "video-005",
    title: "Midasbuy X Age of Empires Mobile Thanksgiving Special...",
    thumbnail: "/video-thumbnails/thanksgiving.png",
    views: "644",
    duration: "00:01:22",
    date: "Jan 6",
    youtubeUrl: "https://youtu.be/nbTWBfZTvJY"
  },
  {
    id: "video-006",
    title: "Midasbuy x PUBG MOBILE April Giveaway Live — Preview",
    thumbnail: "/video-thumbnails/april-giveaway.png",
    views: "3w",
    duration: "00:01:36",
    date: "Jul 6",
    youtubeUrl: "https://youtu.be/OAHuY8yQTJ0"
  },
  {
    id: "video-007",
    title: "Top up at Midasbuy accumulatively, get extra...",
    thumbnail: "/video-thumbnails/topup-accumulatively.webp",
    views: "1.9w",
    duration: "00:01:04",
    date: "Jul 6",
    youtubeUrl: "https://youtu.be/1Dd4sOCBTWM"
  },
  {
    id: "video-008",
    title: "Midasbuy Christmas-Special Live - Preview Now!",
    thumbnail: "/video-thumbnails/christmas-special.webp",
    views: "5.6k",
    duration: "00:01:17",
    date: "Jul 6",
    youtubeUrl: "https://youtu.be/1Dd4sOCBTWM"
  }
];

interface VideoCardProps {
  video: typeof videoData[0];
  onPlay: (youtubeUrl: string) => void;
  isMobile?: boolean;
}

const VideoCard = ({ video, onPlay, isMobile = false }: VideoCardProps) => {
  return (
    <div 
      className={`group cursor-pointer ${isMobile ? 'min-w-[160px] w-[160px]' : 'w-full'}`}
      onClick={() => onPlay(video.youtubeUrl)}
    >
      {/* Thumbnail */}
      <div className="relative rounded-lg overflow-hidden aspect-video mb-2">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
        
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Views count - bottom left */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium">{video.views}</span>
        </div>
        
        {/* Duration - bottom right */}
        <div className="absolute bottom-2 right-2 text-white text-xs font-medium">
          {video.duration}
        </div>
      </div>
      
      {/* Title */}
      <h3 className={`text-white font-medium line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}>
        {video.title}
      </h3>
      
      {/* Date */}
      <p className={`text-gray-400 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
        {video.date}
      </p>
    </div>
  );
};

interface MidasbuyVideoSectionProps {
  className?: string;
}

const MidasbuyVideoSection = ({ className = "" }: MidasbuyVideoSectionProps) => {
  const { isMobile, isTablet } = useResponsive();
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handlePlayVideo = (youtubeUrl: string) => {
    if (!youtubeUrl || youtubeUrl.trim() === "") {
      toast({
        title: t('videosPage.videoComingSoon', 'Video Coming Soon'),
        description: t('videosPage.videoNotAvailable', 'This video is not available yet. Please check back later!'),
        variant: "default",
      });
      return;
    }
    setPlayingVideo(youtubeUrl);
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  const handleSeeAll = () => {
    // Navigate to videos page
    navigate("/shop/videos");
  };

  // Split videos into two rows for mobile
  const firstRowVideos = videoData.slice(0, 4);
  const secondRowVideos = videoData.slice(4, 8);

  return (
    <div className={`mb-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl text-white font-bold tracking-wide">
          {t('header.midasbuyVideo', 'MIDASBUY VIDEO')}
        </h2>
        <button 
          onClick={handleSeeAll}
          className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-0.5 transition-colors"
        >
          {t('videosPage.seeAll', 'See All')}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Video Grid */}
      {isMobile ? (
        /* Mobile Layout - Both rows scroll together */
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2">
            {/* Video columns container */}
            <div className="flex gap-3">
              {firstRowVideos.map((video, index) => (
                <div key={video.id} className="flex flex-col gap-4">
                  {/* Top video */}
                  <VideoCard 
                    video={video} 
                    onPlay={handlePlayVideo}
                    isMobile={true}
                  />
                  {/* Bottom video */}
                  {secondRowVideos[index] && (
                    <VideoCard 
                      video={secondRowVideos[index]} 
                      onPlay={handlePlayVideo}
                      isMobile={true}
                    />
                  )}
                </div>
              ))}
            </div>
            
            {/* More Button - At the end of scroll, centered between both rows */}
            <div 
              className="min-w-[80px] flex flex-col items-center justify-center cursor-pointer flex-shrink-0"
              onClick={handleSeeAll}
            >
              <span className="text-blue-400 text-sm font-medium flex items-center gap-1">
                {t('videosPage.more', 'More')}
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop/Tablet Layout - 4x2 Grid */
        <div className="space-y-6">
          {/* First Row */}
          <div className={`grid ${isTablet ? 'grid-cols-3' : 'grid-cols-4'} gap-4`}>
            {firstRowVideos.slice(0, isTablet ? 3 : 4).map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onPlay={handlePlayVideo}
              />
            ))}
          </div>
          
          {/* Second Row */}
          <div className={`grid ${isTablet ? 'grid-cols-3' : 'grid-cols-4'} gap-4`}>
            {secondRowVideos.slice(0, isTablet ? 3 : 4).map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onPlay={handlePlayVideo}
              />
            ))}
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleCloseVideo}
        >
          <button 
            onClick={handleCloseVideo}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div 
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={getYouTubeEmbedUrl(playingVideo)}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MidasbuyVideoSection;
