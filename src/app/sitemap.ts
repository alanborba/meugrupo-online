import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.meugrupo.online';

  // Obter grupos do banco para gerar as URLs dinâmicas
  const { data: groups } = await supabase
    .from('groups')
    .select('id, updated_at')
    .order('updated_at', { ascending: false });

  const groupUrls = (groups || []).map((group) => ({
    url: `${baseUrl}/grupo/${group.id}`,
    lastModified: new Date(group.updated_at).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/explorar`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/adicionar`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...groupUrls,
  ];
}
