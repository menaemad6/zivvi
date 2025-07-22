import { supabase } from "@/integrations/supabase/client";

export type AnalyticsAction = 'view' | 'download' | 'share' | 'print' | 'edit' | 'duplicate';

interface AnalyticsEvent {
  cvId: string;
  action: AnalyticsAction;
  metadata?: Record<string, any>;
}

export const useAnalytics = () => {
  const trackEvent = async ({ cvId, action, metadata = {} }: AnalyticsEvent) => {
    try {
      // Get user agent and other browser info
      const userAgent = navigator.userAgent;
      const timestamp = new Date().toISOString();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('cv_analytics')
        .insert({
          cv_id: cvId,
          user_id: user?.id || null,
          action_type: action,
          metadata: {
            ...metadata,
            timestamp,
            url: window.location.href,
            referrer: document.referrer
          },
          user_agent: userAgent
        });

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  };

  const trackCVView = (cvId: string, metadata?: Record<string, any>) => {
    trackEvent({ cvId, action: 'view', metadata });
  };

  const trackCVDownload = (cvId: string, format: string = 'pdf', metadata?: Record<string, any>) => {
    trackEvent({ cvId, action: 'download', metadata: { format, ...metadata } });
  };

  const trackCVShare = (cvId: string, method: string, metadata?: Record<string, any>) => {
    trackEvent({ cvId, action: 'share', metadata: { method, ...metadata } });
  };

  const trackCVPrint = (cvId: string, metadata?: Record<string, any>) => {
    trackEvent({ cvId, action: 'print', metadata });
  };

  const trackCVEdit = (cvId: string, section?: string, metadata?: Record<string, any>) => {
    trackEvent({ cvId, action: 'edit', metadata: { section, ...metadata } });
  };

  const trackCVDuplicate = (cvId: string, metadata?: Record<string, any>) => {
    trackEvent({ cvId, action: 'duplicate', metadata });
  };

  return {
    trackEvent,
    trackCVView,
    trackCVDownload,
    trackCVShare,
    trackCVPrint,
    trackCVEdit,
    trackCVDuplicate
  };
};