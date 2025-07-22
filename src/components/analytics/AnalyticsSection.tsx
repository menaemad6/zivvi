import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Download, Share2, Edit, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { UAParser } from 'ua-parser-js';

interface AnalyticsData {
  id: string;
  action_type: string;
  timestamp: string;
  metadata: unknown;
  cv_id: string;
  user_id: string | null;
  user_agent?: string | null; // Added for user agent
  cvs?: {
    id: string;
    name?: string | null;
    title?: string | null;
    user_id: string;
    profiles?: {
      full_name?: string | null;
    };
  };
}

interface CVAnalytics {
  cvId: string;
  cvName?: string;
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  totalEdits: number;
  recentActivity: AnalyticsData[];
}

interface AnalyticsSectionProps {
  cvId?: string;
  showAllCVs?: boolean;
}

// Helper to parse user agent string
const getUserAgentInfo = (ua: string | null | undefined) => {
  if (!ua) return null;
  try {
    const parser = new UAParser(ua);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    return `${browser.name || ''} ${browser.version || ''} on ${os.name || ''} ${os.version || ''}`.trim();
  } catch {
    return ua;
  }
};

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ 
  cvId, 
  showAllCVs = false 
}) => {
  const [analytics, setAnalytics] = useState<CVAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  // State to track which CVs are expanded to show all activity
  const [expandedCVs, setExpandedCVs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAnalytics();
  }, [cvId, showAllCVs, timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Build date filter
      let dateFilter = {};
      if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : 30;
        const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        dateFilter = { timestamp: { gte: fromDate } };
      }

      // Fetch analytics data
      let query = supabase
        .from('cv_analytics')
        .select(`
          *,
          cvs!cv_analytics_cv_id_fkey (
            id,
            name,
            title,
            user_id,
            profiles:profiles!cvs_user_id_fkey (
              full_name
            )
          )
        `)
        .eq('cvs.user_id', user.id)
        .order('timestamp', { ascending: false });

      if (cvId) {
        query = query.eq('cv_id', cvId);
      }

      const { data: analyticsData, error } = await query;

      if (error) {
        console.error('Error fetching analytics:', error);
        return;
      }

      // Group by CV and calculate totals
      const cvAnalyticsMap = new Map<string, CVAnalytics>();

      analyticsData?.forEach((item: AnalyticsData) => {
        const cvId = item.cv_id;
        const cvName = item.cvs?.name || item.cvs?.title || 'Untitled CV';

        if (!cvAnalyticsMap.has(cvId)) {
          cvAnalyticsMap.set(cvId, {
            cvId,
            cvName,
            totalViews: 0,
            totalDownloads: 0,
            totalShares: 0,
            totalEdits: 0,
            recentActivity: []
          });
        }

        const cvAnalytics = cvAnalyticsMap.get(cvId)!;

        // Count by action type
        switch (item.action_type) {
          case 'view':
            cvAnalytics.totalViews++;
            break;
          case 'download':
            cvAnalytics.totalDownloads++;
            break;
          case 'share':
            cvAnalytics.totalShares++;
            break;
          case 'edit':
            cvAnalytics.totalEdits++;
            break;
        }

        // Add to recent activity (limit to 10 most recent)
        if (cvAnalytics.recentActivity.length < 10) {
          cvAnalytics.recentActivity.push(item);
        }
      });

      setAnalytics(Array.from(cvAnalyticsMap.values()));
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAll = (cvId: string) => {
    setExpandedCVs((prev) => ({ ...prev, [cvId]: true }));
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'view':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'download':
        return <Download className="h-4 w-4 text-green-500" />;
      case 'share':
        return <Share2 className="h-4 w-4 text-purple-500" />;
      case 'edit':
        return <Edit className="h-4 w-4 text-orange-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'view':
        return 'bg-blue-100 text-blue-800';
      case 'download':
        return 'bg-green-100 text-green-800';
      case 'share':
        return 'bg-purple-100 text-purple-800';
      case 'edit':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (analytics.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No analytics data available yet.</p>
            <p className="text-sm">Analytics will appear once your CV gets some activity.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <span className="text-sm font-medium text-gray-700">Time Range:</span>
        <div className="flex gap-1">
          {[
            { label: '7 days', value: '7d' as const },
            { label: '30 days', value: '30d' as const },
            { label: 'All time', value: 'all' as const }
          ].map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.value)}
              className="text-xs"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {analytics.map((cvAnalytics) => (
        <Card key={cvAnalytics.cvId} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span>{cvAnalytics.cvName}</span>
              <Badge variant="outline">{cvAnalytics.cvId}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-blue-600">{cvAnalytics.totalViews}</div>
                <div className="text-xs text-blue-600">Views</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Download className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-green-600">{cvAnalytics.totalDownloads}</div>
                <div className="text-xs text-green-600">Downloads</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Share2 className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-purple-600">{cvAnalytics.totalShares}</div>
                <div className="text-xs text-purple-600">Shares</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Edit className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-orange-600">{cvAnalytics.totalEdits}</div>
                <div className="text-xs text-orange-600">Edits</div>
              </div>
            </div>

            {/* Recent Activity */}
            {cvAnalytics.recentActivity.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Recent Activity</h4>
                <div className="space-y-2">
                  {(expandedCVs[cvAnalytics.cvId] ? cvAnalytics.recentActivity : cvAnalytics.recentActivity.slice(0, 5)).map((activity) => (
                    <div key={activity.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-gray-50 rounded-lg gap-2">
                      <div className="flex items-center gap-3">
                        {getActionIcon(activity.action_type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className={getActionColor(activity.action_type)}>
                              {activity.action_type}
                            </Badge>
                            {activity.user_id && activity.cvs ? (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <User className="h-3 w-3 text-gray-400" />
                                {activity.cvs.profiles?.full_name ?? null}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-gray-400 italic">
                                <User className="h-3 w-3 text-gray-300" />
                                Unregistered User
                              </span>
                            )}
                          </div>
                          {/* Extra info for view/edit actions */}
                          <div className="text-xs text-gray-500 mt-1">
                            {activity.action_type === 'view' && activity.user_agent && (
                              <span>Device: {getUserAgentInfo(activity.user_agent)}</span>
                            )}
                            {activity.action_type === 'edit' && typeof activity.metadata === 'object' && activity.metadata !== null && (() => {
                              const meta = activity.metadata as Record<string, unknown>;
                              return (
                                <>
                                  {meta.action && <span>Action: {String(meta.action)}</span>}
                                  {meta.section && <span>{meta.action ? ' • ' : ''}Section: {String(meta.section)}</span>}
                                </>
                              );
                            })()}
                          </div>
                          {/* Existing metadata info */}
                          {activity.metadata && (
                            <div className="text-xs text-gray-500 mt-1">
                              {(() => {
                                if (typeof activity.metadata === 'object' && activity.metadata !== null) {
                                  const meta = activity.metadata as Record<string, unknown>;
                                  return [
                                    meta.source ? `Source: ${meta.source}` : '',
                                    // meta.template ? ` • Template: ${meta.template}` : '',
                                    meta.fileName ? ` • File: ${meta.fileName}` : ''
                                  ].filter(Boolean).join('');
                                }
                                return null;
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
                {!expandedCVs[cvAnalytics.cvId] && cvAnalytics.recentActivity.length > 5 && (
                  <div className="flex justify-center mt-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
                      onClick={() => handleViewAll(cvAnalytics.cvId)}
                    >
                      View All
                    </button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};