import { useState, useEffect, useCallback } from "react";
import { Clock, Zap } from "lucide-react";
import { useResponsive } from "@/hooks/use-mobile";

interface AdvancedCountdownProps {
  className?: string;
  compact?: boolean; // New prop for smaller mobile version
}

// Move countdown durations outside component to prevent recreation on every render
const countdownDurations = [22, 23, 24, 15, 18, 20, 16, 25, 19, 21, 17, 26, 14, 27, 13, 28];

const AdvancedCountdown = ({ className = "", compact = false }: AdvancedCountdownProps) => {
  const { isMobile } = useResponsive();
  const [currentDurationIndex, setCurrentDurationIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });

  // Initialize countdown with current duration
  const initializeCountdown = useCallback((durationHours: number, durationIndex: number) => {
    const now = new Date().getTime();
    const endTime = now + (durationHours * 60 * 60 * 1000);
    
    // Save end time to localStorage with duration index
    localStorage.setItem('countdownEndTime', endTime.toString());
    localStorage.setItem('countdownDurationIndex', durationIndex.toString());
    
    return endTime;
  }, []);

  // Calculate time left
  const calculateTimeLeft = useCallback((endTime: number) => {
    const now = new Date().getTime();
    const difference = endTime - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, expired: false };
  }, []);

  // Initialize countdown on component mount
  useEffect(() => {
    const savedEndTime = localStorage.getItem('countdownEndTime');
    const savedDurationIndex = localStorage.getItem('countdownDurationIndex');
    
    let endTime: number;
    let durationIndex = 0;

    if (savedEndTime && savedDurationIndex) {
      endTime = parseInt(savedEndTime);
      durationIndex = parseInt(savedDurationIndex);
      
      // Check if saved countdown is still valid
      const timeCheck = calculateTimeLeft(endTime);
      if (timeCheck.expired) {
        // Move to next duration and start new countdown
        durationIndex = (durationIndex + 1) % countdownDurations.length;
        endTime = initializeCountdown(countdownDurations[durationIndex], durationIndex);
      }
    } else {
      // First time, start with first duration
      endTime = initializeCountdown(countdownDurations[0], 0);
    }

    setCurrentDurationIndex(durationIndex);

    // Update countdown every second
    const interval = setInterval(() => {
      const timeLeft = calculateTimeLeft(endTime);
      
      if (timeLeft.expired) {
        // Move to next duration and start new countdown
        const nextIndex = (durationIndex + 1) % countdownDurations.length;
        setCurrentDurationIndex(nextIndex);
        
        const nextDuration = countdownDurations[nextIndex];
        endTime = new Date().getTime() + (nextDuration * 60 * 60 * 1000);
        
        localStorage.setItem('countdownEndTime', endTime.toString());
        localStorage.setItem('countdownDurationIndex', nextIndex.toString());
        
        durationIndex = nextIndex;
      } else {
        setTimeLeft(timeLeft);
      }
    }, 1000);

    // Initial calculation
    const initialTimeLeft = calculateTimeLeft(endTime);
    if (!initialTimeLeft.expired) {
      setTimeLeft(initialTimeLeft);
    }

    return () => clearInterval(interval);
  }, []); // Remove dependencies to prevent infinite loop

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  // Adjust sizing based on mobile and compact prop
  const isCompactMode = compact || isMobile;

  return (
    <div className={`${className} inline-flex items-center gap-2 bg-gradient-to-r from-red-600/90 to-orange-500/90 rounded-full px-4 py-2 border border-red-500/30 shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center gap-1">
        <Zap className={`${isCompactMode ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-300 animate-pulse`} />
        <Clock className={`${isCompactMode ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
      </div>
      
      <span className={`text-white font-semibold ${
        isCompactMode ? 'text-xs' : 'text-sm'
      } uppercase tracking-wide`}>
        Limited OFFER:
      </span>
      
      <div className="flex items-center gap-1">
        <span className={`text-white font-bold ${
          isCompactMode ? 'text-xs' : 'text-sm'
        } tabular-nums`}>
          {formatTime(timeLeft.hours)}
        </span>
        <span className={`text-white/70 ${isCompactMode ? 'text-xs' : 'text-sm'}`}>h</span>
        
        <span className={`text-white font-bold ${
          isCompactMode ? 'text-xs' : 'text-sm'
        } tabular-nums`}>
          {formatTime(timeLeft.minutes)}
        </span>
        <span className={`text-white/70 ${isCompactMode ? 'text-xs' : 'text-sm'}`}>m</span>
        
        <span className={`text-white font-bold ${
          isCompactMode ? 'text-xs' : 'text-sm'
        } tabular-nums`}>
          {formatTime(timeLeft.seconds)}
        </span>
        <span className={`text-white/70 ${isCompactMode ? 'text-xs' : 'text-sm'}`}>s</span>
      </div>
    </div>
  );
};

export default AdvancedCountdown;