import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  TrendingUp, 
  Users, 
  Search, 
  ExternalLink, 
  Activity,
  BarChart3,
  Eye
} from 'lucide-react';
import { useEnhancedAnalytics } from '@/hooks/useEnhancedAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

interface EnhancedAnalyticsDashboardProps {
  timeframe: string;
}

export function EnhancedAnalyticsDashboard({ timeframe }: EnhancedAnalyticsDashboardProps) {
  const { analytics, loading } = useEnhancedAnalytics(timeframe);

  const getTimeframeLabel = () => {
    const hours = parseInt(timeframe);
    if (hours === 1) return 'Last Hour';
    if (hours === 24) return 'Last 24 Hours';
    if (hours === 168) return 'Last 7 Days';
    if (hours === 720) return 'Last 30 Days';
    return `Last ${hours} Hours`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {analytics.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {getTimeframeLabel()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {analytics.uniqueVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {getTimeframeLabel()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Live Users</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {analytics.liveUsers.toLocaleString()}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Active right now
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources & Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.trafficSources.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No traffic data available for this period
              </p>
            ) : (
              analytics.trafficSources.map((source, index) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {source.source.includes('Search') ? (
                        <Search className="h-4 w-4 text-blue-500" />
                      ) : source.source === 'Direct' ? (
                        <Globe className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ExternalLink className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{source.count}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {source.percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress value={source.percentage} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topCountries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No country data available for this period
              </p>
            ) : (
              analytics.topCountries.map((country, index) => (
                <div key={country.country} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span className="w-6 h-4 rounded bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center text-xs text-white font-bold">
                        {index + 1}
                      </span>
                      {country.country}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{country.count}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {country.percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress value={country.percentage} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hourly Traffic Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Hourly Traffic (Last 24 Hours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-2">
            {analytics.hourlyViews.map((hour, index) => (
              <div key={hour.hour} className="flex flex-col items-center space-y-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t min-h-[4px]"
                  style={{ 
                    height: `${Math.max(4, (hour.views / Math.max(...analytics.hourlyViews.map(h => h.views), 1)) * 80)}px` 
                  }}
                  title={`${hour.hour}: ${hour.views} views`}
                />
                <span className="text-xs text-muted-foreground transform -rotate-45">
                  {hour.hour}
                </span>
                <span className="text-xs font-medium">{hour.views}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}