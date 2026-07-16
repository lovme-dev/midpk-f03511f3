import React from "react";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "loading...",
  fullScreen = true,
}) => {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-[#13182B]"
          : "flex items-center justify-center"
      }
    >
      {/* Dark rounded box - Opacity reduced to 20% */}
      <div className="bg-black/[0.67] text-white rounded-lg w-[92px] h-[70px] flex flex-col items-center justify-center shadow-lg backdrop-blur-[1px]">
        {/* Spinner: Thicker border (3px) */}
        <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin mb-1.5" />
        {/* Text */}
        <span className="text-[10px] font-normal tracking-wide opacity-90">{message}</span>
      </div>
    </div>
  );
};

export default LoadingScreen;

