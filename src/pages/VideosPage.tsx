import { useState } from "react";
import { ChevronDown, Play, X } from "lucide-react";
import { useResponsive } from "@/hooks/use-mobile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
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

// All videos data matching the reference images exactly
// Homepage videos first (video-001 to video-008), then additional videos
const allVideosData = [
  // HOMEPAGE VIDEOS (Featured in Upcoming Live Stream + Video Grid)
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
    title: "Midasbuy x PUBG MOBILE November Giveaway Live — Preview Now!",
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
  {
    id: "video-005",
    title: "Midasbuy X Age of Empires Mobile Thanksgiving Special Live — Preview Now!",
    thumbnail: "/video-thumbnails/thanksgiving.png",
    views: "644",
    duration: "00:01:22",
    date: "Jan 6",
    youtubeUrl: "https://youtu.be/nbTWBfZTvJY"
  },
  {
    id: "video-006",
    title: "Midasbuy x PUBG MOBILE April Giveaway Live — Preview Now!",
    thumbnail: "/video-thumbnails/april-giveaway.png",
    views: "3w",
    duration: "00:01:36",
    date: "Jul 6",
    youtubeUrl: "https://youtu.be/OAHuY8yQTJ0"
  },
  {
    id: "video-007",
    title: "Top up at Midasbuy accumulatively, get extra rewards!",
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
  },
  // ADDITIONAL VIDEOS (with real URLs)
  {
    id: "video-009",
    title: "Get the UC with 5%-15% off on Midasbuy, and start Shelby engines in...",
    thumbnail: "/video-thumbnails/shelby-collab.webp",
    views: "4.1k",
    duration: "00:01:25",
    date: "Jul 6",
    youtubeUrl: "https://youtu.be/dls5BydCmNc"
  },
  {
    id: "video-010",
    title: "Wuthering Waves Recharge Tutorial! GET LIMITED 10% OFF ONLY ON...",
    thumbnail: "/video-thumbnails/wuthering-waves-tutorial.png",
    views: "3.7k",
    duration: "00:00:37",
    date: "Jul 25",
    youtubeUrl: "https://youtu.be/q8WrN99rUEM"
  },
  {
    id: "video-011",
    title: "Midasbuy x PUBG MOBILE May Giveaway Live — Preview Now!",
    thumbnail: "/video-thumbnails/may-giveaway.jpeg",
    views: "2.7k",
    duration: "00:01:07",
    date: "Jul 6",
    youtubeUrl: "https://youtu.be/OAHuY8yQTJ0"
  },
  {
    id: "video-012",
    title: "Only buy PUBG MOBILE UC from official store Midasbuy!",
    thumbnail: "/video-thumbnails/pubg-official-store.webp",
    views: "2.6k",
    duration: "00:00:33",
    date: "Jul 6",
    youtubeUrl: "https://youtu.be/BhI05cdC53c"
  },
  // Row 2
  {
    id: "video-013",
    title: "Wuthering Waves is now online! GET LIMITED 10% OFF ONLY ON...",
    thumbnail: "/video-thumbnails/wuthering-waves-online.png",
    views: "2.4k",
    duration: "00:02:39",
    date: "Jul 25",
    youtubeUrl: "https://youtu.be/71MrpFTCppw"
  },
  {
    id: "video-014",
    title: "Midasbuy x PUBG MOBILE Mummy Crate Special Live",
    thumbnail: "/video-thumbnails/mummy-crate.jpeg",
    views: "1.9k",
    duration: "00:01:32",
    date: "Jul 6",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "video-015",
    title: "Midasbuy X PUBG MOBILE 7th Anniversary Special Live - Preview...",
    thumbnail: "/video-thumbnails/7th-anniversary.jpeg",
    views: "1.9k",
    duration: "00:01:30",
    date: "Jul 6",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "video-016",
    title: "Midasbuy March Special Live - Preview Now!",
    thumbnail: "/video-thumbnails/march-special.webp",
    views: "1.3k",
    duration: "00:01:07",
    date: "Jul 6",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  // Row 3
  {
    id: "video-017",
    title: "Midasbuy 710 Live Stream",
    // Reference screenshots show this card uses the same creative as the Mummy Crate live;
    // we use the alternate crop/version provided in thumbnails.
    thumbnail: "/video-thumbnails/mummy-crate-alt.png",
    views: "693",
    duration: "00:01:32",
    date: "Jul 7",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "video-018",
    title: "Midasbuy VIP Program",
    thumbnail: "/video-thumbnails/vip-program.webp",
    views: "477",
    duration: "00:01:36",
    date: "Jul 6",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "video-019",
    title: "Midasbuy New Year Live - Preview/Subscribe Now!",
    thumbnail: "/video-thumbnails/new-year-live.webp",
    views: "373",
    duration: "00:01:14",
    date: "Jul 6",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "video-020",
    title: "Enjoy 100% extra bonus of Honor of Kings only at Midasbuy!",
    thumbnail: "/video-thumbnails/honor-of-kings-bonus.webp",
    views: "262",
    duration: "00:01:40",
    date: "Jul 6",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  // Row 4
  {
    id: "video-021",
    title: "Arena Breakout Infinite - Midasbuy (JP)",
    thumbnail: "/video-thumbnails/arena-breakout.webp",
    views: "191",
    duration: "00:01:55",
    date: "Jul 6",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "video-022",
    title: "Delta Force is AVAILABLE on PC and the official top-up store Midasbuy!",
    thumbnail: "/video-thumbnails/delta-force-available.jpeg",
    views: "170",
    duration: "00:03:58",
    date: "Jul 6",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "video-023",
    title: "Explore HOK's updates and exclusive events on Midasbuy!",
    thumbnail: "/video-thumbnails/hok-updates.webp",
    views: "166",
    duration: "00:01:37",
    date: "Jul 6",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "video-024",
    title: "Download Delta Force For Exclusive Gifts!",
    thumbnail: "/video-thumbnails/delta-force-gifts.webp",
    views: "145",
    duration: "00:03:31",
    date: "Jul 6",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
];

// Featured/Upcoming video
const featuredVideo = allVideosData[0];

interface VideoCardProps {
  video: typeof allVideosData[0];
  onPlay: (youtubeUrl: string) => void;
  size?: "normal" | "featured";
}

const VideoCard = ({ video, onPlay, size = "normal" }: VideoCardProps) => {
  const isFeatured = size === "featured";
  
  return (
    <div 
      className={`group cursor-pointer ${isFeatured ? 'w-full' : 'w-full'}`}
      onClick={() => onPlay(video.youtubeUrl)}
    >
      {/* Thumbnail */}
      <div className={`relative rounded-lg overflow-hidden ${isFeatured ? 'aspect-video' : 'aspect-video'} mb-2`}>
        {video.thumbnail ? (
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <Play className="w-12 h-12 text-gray-600" />
          </div>
        )}
        
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className={`${isFeatured ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center`}>
            <Play className={`${isFeatured ? 'w-8 h-8' : 'w-6 h-6'} text-white fill-white`} />
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
      <h3 className={`text-white font-medium line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors ${isFeatured ? 'text-base md:text-lg' : 'text-xs'}`}>
        {video.title}
      </h3>
      
      {/* Date */}
      <p className={`text-gray-400 ${isFeatured ? 'text-xs' : 'text-[10px]'}`}>
        {video.date}
      </p>
    </div>
  );
};

interface VideosPageProps {
  onLogout?: () => void;
}

const VideosPage = ({ onLogout }: VideosPageProps) => {
  const { isMobile, isTablet } = useResponsive();
  const [activeTab, setActiveTab] = useState<"video" | "live">("video");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
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
    setPlayingVideoUrl(youtubeUrl);
  };

  const handleCloseVideo = () => {
    setPlayingVideoUrl(null);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, allVideosData.length));
  };

  const visibleVideos = allVideosData.slice(0, visibleCount);
  const gridCols = isMobile ? 2 : isTablet ? 3 : 4;

  return (
    <>
      <Helmet>
        <title>Midasbuy Live & Video - Watch Gaming Videos</title>
        <meta name="description" content="Watch Midasbuy gaming videos, live streams, and special events. Get exclusive previews and gaming content." />
      </Helmet>

      <div className="min-h-screen bg-[#0c1730]">
        <Header onLogout={onLogout} />
        
        {/* Purple Header Banner */}
        <div className="relative w-full h-16 md:h-20 overflow-hidden">
          <img 
            src="/images/videos-header-banner.png"
            alt="Videos Header"
            className={`w-full h-full object-cover ${isMobile ? 'object-center' : 'object-right'}`}
          />
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Page Title */}
          <h1 className="text-xl md:text-2xl font-bold text-white mb-6">
            {t('videosPage.title', 'MIDASBUY LIVE & VIDEO')}
          </h1>

          {/* Upcoming Live Stream Section */}
          <div className="mb-8">
            <h2 className="text-base md:text-lg font-bold text-white mb-4">
              {t('videosPage.upcomingLiveStream', 'UPCOMING LIVE STREAM')}
            </h2>
            
            {/* Featured Video - Split Layout on Desktop */}
            <div className={`${isMobile ? '' : 'grid grid-cols-2 gap-6'} bg-[#1a2744] ${isMobile ? 'rounded-t-xl rounded-b-lg' : 'rounded-lg'} overflow-hidden`}>
              {/* Video Thumbnail */}
              <div 
                className={`relative aspect-video cursor-pointer group ${isMobile ? 'rounded-t-xl' : ''} overflow-hidden`}
                onClick={() => handlePlayVideo(featuredVideo.youtubeUrl)}
              >
                {featuredVideo.thumbnail ? (
                  <img 
                    src={featuredVideo.thumbnail} 
                    alt={featuredVideo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Play className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                
                {/* Views & Duration */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-medium">{featuredVideo.views}</span>
                </div>
                <div className="absolute bottom-2 right-2 text-white text-sm font-medium">
                  {featuredVideo.duration}
                </div>
              </div>
              
              {/* Video Info - Desktop Only */}
              {!isMobile && (
                <div className="p-6 flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {featuredVideo.title.toUpperCase()}
                  </h3>
                  <p className="text-gray-400">{featuredVideo.date}</p>
                </div>
              )}
            </div>
            
            {/* Mobile: Title below video */}
            {isMobile && (
              <div className="mt-3">
                <h3 className="text-base font-bold text-white mb-1">
                  {featuredVideo.title}
                </h3>
                <p className="text-gray-400 text-sm">{featuredVideo.date}</p>
              </div>
            )}
          </div>

          {/* Video & Live Record Section */}
          <div className="mb-6">
            <h2 className="text-sm md:text-lg font-bold text-white mb-4">
              {t('videosPage.videoAndLiveRecord', 'VIDEO & LIVE RECORD')}
            </h2>
            
            {/* Tabs and Filter */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveTab("video")}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                    activeTab === "video" 
                      ? "bg-gradient-to-r from-[#0099FF] to-[#0062FF] text-white" 
                      : "bg-white/10 backdrop-blur-sm text-gray-300 border border-white/20 hover:bg-white/15"
                  }`}
                >
                  {t('videosPage.video', 'VIDEO')}
                </button>
                <button
                  onClick={() => setActiveTab("live")}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                    activeTab === "live" 
                      ? "bg-gradient-to-r from-[#0099FF] to-[#0062FF] text-white" 
                      : "bg-white/10 backdrop-blur-sm text-gray-300 border border-white/20 hover:bg-white/15"
                  }`}
                >
                  {t('videosPage.liveRecord', 'LIVE RECORD')}
                </button>
              </div>
              
              <button 
                onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                  isGameDropdownOpen 
                    ? "bg-gradient-to-r from-[#0099FF] to-[#0062FF] text-white" 
                    : "bg-white/10 backdrop-blur-sm text-gray-300 border border-white/20 hover:bg-white/15"
                }`}
              >
                {t('videosPage.chooseGame', 'CHOOSE GAME')}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Video Grid - Only show when VIDEO tab is active */}
            {activeTab === "video" ? (
              <div className={`grid gap-4 ${
                isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4'
              }`}>
                {visibleVideos.map((video) => (
                  <VideoCard 
                    key={video.id} 
                    video={video} 
                    onPlay={handlePlayVideo}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16">
                <p className="text-gray-400 text-sm">{t('videosPage.noLiveRecords', 'No live records available')}</p>
              </div>
            )}

            {/* Load More Button */}
            {activeTab === "video" && visibleCount < allVideosData.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/15 text-white text-xs rounded-full font-medium transition-colors border border-white/20"
                >
                  {t('videosPage.loadMore', 'Load More')}
                </button>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>

      {/* Video Player Modal */}
      {playingVideoUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
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
              src={getYouTubeEmbedUrl(playingVideoUrl)}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VideosPage;
