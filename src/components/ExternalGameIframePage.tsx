import { useParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";

interface GameConfig {
  name: string;
  pathSlug: string;
  externalPath: string;
}

// Game configurations with their external Midasbuy paths
const GAME_CONFIGS: Record<string, GameConfig> = {
  honorofkings: {
    name: "Honor of Kings",
    pathSlug: "hok",
    externalPath: "buy/hok"
  },
  deltaforce: {
    name: "Delta Force",
    pathSlug: "dfm",
    externalPath: "buy/dfm"
  },
  dragonheir: {
    name: "Dragonheir: Silent Gods",
    pathSlug: "dragonheir-silent-gods",
    externalPath: "buy/dragonheir-silent-gods"
  },
  undawn: {
    name: "Undawn",
    pathSlug: "undawngl",
    externalPath: "buy/undawngl"
  },
  arenabreakout: {
    name: "Arena Breakout",
    pathSlug: "uamo",
    externalPath: "buy/uamo"
  },
  nba: {
    name: "NBA Infinite",
    pathSlug: "nba",
    externalPath: "buy/nba"
  },
  ludo: {
    name: "Ludo World",
    pathSlug: "ludo",
    externalPath: "shop/ludo"
  }
};

interface ExternalGameIframePageProps {
  gameKey: string;
}

const ExternalGameIframePage = ({ gameKey }: ExternalGameIframePageProps) => {
  const { countryCode } = useParams<{ countryCode: string }>();
  
  const gameConfig = GAME_CONFIGS[gameKey];
  const country = countryCode?.toLowerCase() || 'pk';
  
  // Build the external URL
  const externalUrl = `https://www.midasbuy.com/midasbuy/${country}/${gameConfig?.externalPath || ''}`;
  
  useEffect(() => {
    // Redirect to external URL immediately
    // External sites like midasbuy.com block iframe embedding due to security policies
    // So we redirect directly to the external URL
    if (gameConfig) {
      window.location.href = externalUrl;
    }
  }, [gameConfig, externalUrl]);

  // Show loading screen while redirecting
  return (
    <LoadingScreen message={`Redirecting to ${gameConfig?.name || 'game'}...`} />
  );
};

export default ExternalGameIframePage;
