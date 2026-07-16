import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, ShoppingCart, Package, DollarSign, TrendingUp, Calendar, Star, Eye, Activity, UserCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { Skeleton } from '@/components/ui/skeleton';
import { EnhancedAnalyticsDashboard } from './EnhancedAnalyticsDashboard';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalPackages: number;
  totalRevenue: number;
  recentOrders: any[];
  analytics: {
    totalViews: number;
    uniqueVisitors: number;
    liveUsers: number;
    topPages: Array<{ path: string; views: number }>;
  };
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalPackages: 0,
    totalRevenue: 0,
    recentOrders: [],
    analytics: {
      totalViews: 0,
      uniqueVisitors: 0,
      liveUsers: 0,
      topPages: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7'); // days
  const { toast } = useToast();
  const { analytics: realTimeAnalytics, loading: analyticsLoading } = useRealTimeAnalytics();
  const { orders: liveOrders, newOrderCount } = useOrderNotifications();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [timeframe]);

  // Refresh stats when live orders change (new orders come in)
  useEffect(() => {
    if (liveOrders.length > 0) {
      loadDashboardStats();
    }
  }, [liveOrders.length]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get total packages
      const { count: packagesCount } = await supabase
        .from('uc_packages')
        .select('*', { count: 'exact', head: true });

      // Get total revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('price')
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.price), 0) || 0;

      // Get recent orders (simple fetch, no joins)
      const { data: recentOrdersRaw } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Enrich recent orders with profiles and packages
      let recentOrdersData: any[] = [];
      if (recentOrdersRaw && recentOrdersRaw.length > 0) {
        const userIds = [...new Set(recentOrdersRaw.map(o => o.user_id).filter(Boolean))];
        const packageIds = [...new Set(recentOrdersRaw.map(o => o.package_id).filter(Boolean))];

        let profilesMap: Record<string, any> = {};
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, full_name, email')
            .in('user_id', userIds);
          profiles?.forEach(p => { profilesMap[p.user_id] = p; });
        }

        let packagesMap: Record<string, any> = {};
        if (packageIds.length > 0) {
          const { data: packages } = await supabase
            .from('uc_packages')
            .select('id, name, uc_amount')
            .in('id', packageIds);
          packages?.forEach(p => { packagesMap[p.id] = p; });
        }

        recentOrdersData = recentOrdersRaw.map(order => ({
          ...order,
          profiles: profilesMap[order.user_id] || null,
          uc_packages: order.package_id ? packagesMap[order.package_id] || null : null,
        }));
      }

      // Get analytics data with proper timeframe filtering
      let totalViews = 0;
      let uniqueVisitors = 0;
      let liveUsersCount = 0;
      let topPages: Array<{ path: string; views: number }> = [];

      try {
        const daysBack = parseInt(timeframe);
        const dateThreshold = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();
        
        // Get page views within timeframe
        const { count: viewsCount } = await supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dateThreshold);

        // Get unique visitors within timeframe
        const { data: uniqueData } = await supabase
          .from('page_views')
          .select('user_id, session_id')
          .gte('created_at', dateThreshold);

        // Get top pages within timeframe
        const { data: pageData } = await supabase
          .from('page_views')
          .select('path')
          .gte('created_at', dateThreshold);

        // Live users (last 5 minutes - not affected by timeframe)
        const { count: liveCount } = await supabase
          .from('live_users')
          .select('*', { count: 'exact', head: true })
          .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

        totalViews = viewsCount || 0;
        uniqueVisitors = uniqueData ? new Set(uniqueData.map(d => d.user_id || d.session_id)).size : 0;
        liveUsersCount = liveCount || 0;
        
        // Calculate top pages
        if (pageData) {
          const pathCounts = pageData.reduce((acc: Record<string, number>, { path }) => {
            acc[path] = (acc[path] || 0) + 1;
            return acc;
          }, {});
          
          topPages = Object.entries(pathCounts)
            .map(([path, views]) => ({ path, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);
        }
      } catch (error) {
        console.log('Analytics error:', error);
      }

      setStats({
        totalUsers: usersCount || 0,
        totalOrders: ordersCount || 0,
        totalPackages: packagesCount || 0,
        totalRevenue,
        recentOrders: recentOrdersData || [],
        analytics: {
          totalViews,
          uniqueVisitors,
          liveUsers: liveUsersCount,
          topPages,
        },
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midasbuy-darkBlue via-midasbuy-navy to-midasbuy-darkBlue">
        <div className="space-y-6 p-6">
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-midasbuy-navy/50 border-blue-600/30">
                <CardContent className="p-6">
                  <div className="h-16 bg-blue-600/20 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midasbuy-darkBlue via-midasbuy-navy to-midasbuy-darkBlue">
      <div className="space-y-6 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
            <p className="text-blue-200">Monitor your business performance and key metrics</p>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40 bg-midasbuy-navy border-blue-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-midasbuy-navy border-blue-600">
              <SelectItem value="1">Last 1 Hour</SelectItem>
              <SelectItem value="24">Last 24 Hours</SelectItem>
              <SelectItem value="168">Last 7 Days</SelectItem>
              <SelectItem value="720">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Real-Time Website Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-600 to-blue-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Website Views</CardTitle>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Eye className="h-4 w-4 text-blue-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {analyticsLoading ? (
                  <Skeleton className="h-8 w-20 bg-blue-500/20" />
                ) : (
                  realTimeAnalytics.totalViews.toLocaleString()
                )}
              </div>
              <div className="flex items-center text-xs text-blue-200 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Total impressions
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-600 to-emerald-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Unique Visitors</CardTitle>
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <UserCheck className="h-4 w-4 text-emerald-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {analyticsLoading ? (
                  <Skeleton className="h-8 w-20 bg-emerald-500/20" />
                ) : (
                  realTimeAnalytics.uniqueVisitors.toLocaleString()
                )}
              </div>
              <div className="flex items-center text-xs text-emerald-200 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Today's unique visitors
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-600 to-orange-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Live Users</CardTitle>
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Activity className="h-4 w-4 text-orange-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {analyticsLoading ? (
                  <Skeleton className="h-8 w-20 bg-orange-500/20" />
                ) : (
                  realTimeAnalytics.liveUsers.toLocaleString()
                )}
              </div>
              <div className="flex items-center text-xs text-orange-200 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                Active in last 5 minutes
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-600 to-purple-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Top Page</CardTitle>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Star className="h-4 w-4 text-purple-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.analytics.topPages[0]?.path || '/'}
              </div>
              <div className="flex items-center text-xs text-purple-200 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.analytics.topPages[0]?.views || 0} views
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-midasbuy-navy/50 border-blue-600/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Total Users</CardTitle>
              <div className="bg-blue-600/20 p-2 rounded-lg">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
              <div className="flex items-center text-xs text-blue-300 mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                Active customers
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-midasbuy-navy/50 border-blue-600/30 relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Total Orders</CardTitle>
              <div className="bg-green-600/20 p-2 rounded-lg relative">
                <ShoppingCart className="h-4 w-4 text-green-400" />
                {newOrderCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {newOrderCount > 99 ? '99+' : newOrderCount}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalOrders}</div>
              <div className="flex items-center text-xs text-blue-300 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                All time orders
                {newOrderCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                    {newOrderCount} New!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-midasbuy-navy/50 border-blue-600/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">UC Packages</CardTitle>
              <div className="bg-purple-600/20 p-2 rounded-lg">
                <Package className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalPackages}</div>
              <div className="flex items-center text-xs text-blue-300 mt-1">
                <Star className="h-3 w-3 mr-1" />
                Available packages
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-midasbuy-navy/50 border-blue-600/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Total Revenue</CardTitle>
              <div className="bg-orange-600/20 p-2 rounded-lg">
                <DollarSign className="h-4 w-4 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">₹{stats.totalRevenue.toFixed(2)}</div>
              <div className="flex items-center text-xs text-blue-300 mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                From completed orders
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Analytics Dashboard */}
        <EnhancedAnalyticsDashboard timeframe={timeframe} />

        {/* Enhanced Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Website Analytics Detail */}
          <Card className="border-0 shadow-lg bg-midasbuy-navy/50 border-blue-600/30">
            <CardHeader className="border-b border-blue-600/30 bg-blue-600/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye className="h-5 w-5" />
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {stats.analytics.topPages.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-300">No page views yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.analytics.topPages.slice(0, 5).map((page, index) => (
                    <div key={page.path} className="flex items-center justify-between p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{page.path}</span>
                      </div>
                      <span className="text-blue-300 font-semibold">{page.views} views</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-0 shadow-lg bg-midasbuy-navy/50 border-blue-600/30">
            <CardHeader className="border-b border-blue-600/30 bg-blue-600/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <ShoppingCart className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {stats.recentOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-300">No recent orders found</p>
                </div>
              ) : (
                <div className="divide-y divide-blue-600/20">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="p-4 hover:bg-blue-600/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-white">
                                {order.profiles?.full_name || order.profiles?.email || 'Unknown User'}
                              </p>
                              <p className="text-xs text-blue-300">
                                {order.uc_packages?.name} - {order.uc_packages?.amount} UC
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-blue-300 ml-10">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-white">₹{Number(order.price).toFixed(2)}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' 
                              ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                              : order.status === 'pending'
                              ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                              : 'bg-red-600/20 text-red-400 border border-red-600/30'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-lg bg-midasbuy-navy/50 border-blue-600/30">
            <CardHeader className="border-b border-blue-600/30 bg-blue-600/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-600/20 p-4 rounded-lg border border-green-600/30">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round((stats.recentOrders.filter(o => o.status === 'completed').length / Math.max(stats.recentOrders.length, 1)) * 100)}%
                  </div>
                  <div className="text-sm text-green-300">Success Rate</div>
                </div>
                <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
                  <div className="text-2xl font-bold text-blue-400">
                    ₹{stats.recentOrders.length > 0 ? (stats.totalRevenue / Math.max(stats.totalOrders, 1)).toFixed(0) : '0'}
                  </div>
                  <div className="text-sm text-blue-300">Avg Order Value</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Order Status Distribution</h4>
                <div className="space-y-2">
                  {['completed', 'pending', 'failed', 'cancelled'].map(status => {
                    const count = stats.recentOrders.filter(o => o.status === status).length;
                    const percentage = Math.round((count / Math.max(stats.recentOrders.length, 1)) * 100);
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm capitalize text-blue-200">{status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-blue-800/50 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                status === 'completed' ? 'bg-green-400' :
                                status === 'pending' ? 'bg-yellow-400' :
                                status === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-blue-300">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}