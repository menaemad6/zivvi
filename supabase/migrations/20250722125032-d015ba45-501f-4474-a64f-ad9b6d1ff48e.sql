-- Create analytics table for tracking CV interactions
CREATE TABLE public.cv_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  cv_id UUID REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.cv_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
CREATE POLICY "Users can view analytics for their own CVs" 
ON public.cv_analytics 
FOR SELECT 
USING (
  cv_id IN (
    SELECT id FROM public.cvs WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can insert analytics" 
ON public.cv_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_cv_analytics_cv_id ON public.cv_analytics(cv_id);
CREATE INDEX idx_cv_analytics_action_type ON public.cv_analytics(action_type);
CREATE INDEX idx_cv_analytics_timestamp ON public.cv_analytics(timestamp DESC);