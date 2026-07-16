import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getMetadataByUrl, type UrlMetadata } from '@/config/urlMetadata';

interface PageMetaData {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_image_url?: string;
}

export const usePageMeta = (pathOrPageId: string) => {
  const [metaData, setMetaData] = useState<PageMetaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageMeta = async () => {
      try {
        // First, check local URL metadata configuration file
        const localMetadata = getMetadataByUrl(pathOrPageId);
        
        if (localMetadata) {
          // Use local configuration (this takes priority for easy editing)
          setMetaData({
            meta_title: localMetadata.title,
            meta_description: localMetadata.description,
            meta_keywords: localMetadata.keywords.join(', '),
            canonical_url: `https://middasbuy.com${localMetadata.url}`,
            og_image_url: undefined, // Can be added to UrlMetadata interface if needed
          });
          setIsLoading(false);
          return;
        }

        // Fallback to database if not found in local config
        const { data, error } = await supabase
          .from('page_meta' as any)
          .select('*')
          .or(`path.eq.${pathOrPageId},page_id.eq.${pathOrPageId}`)
          .maybeSingle();

        if (error) {
          console.error('Error fetching page meta:', error);
          return;
        }

        if (data) {
          setMetaData({
            meta_title: (data as any).meta_title,
            meta_description: (data as any).meta_description,
            meta_keywords: (data as any).meta_keywords,
            canonical_url: (data as any).canonical_url,
            og_image_url: (data as any).og_image_url,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pathOrPageId) {
      fetchPageMeta();
    } else {
      setIsLoading(false);
    }
  }, [pathOrPageId]);

  return { metaData, isLoading };
};
