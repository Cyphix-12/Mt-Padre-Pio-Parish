import { supabase } from './supabase';

export async function getZonesAndCommunities() {
  try {
    const { data, error } = await supabase
      .from('community')
      .select('zone, community')
      .not('zone', 'is', null)
      .not('community', 'is', null)
      .order('zone', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching zones and communities:', error);
    throw error;
  }
}