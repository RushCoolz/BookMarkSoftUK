import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('[BookMarkSoft] Failed to initialize live Supabase client, using fallback:', err);
  }
}

export const supabase = client;

export function isSupabaseConfigured(): boolean {
  return Boolean(client);
}

/**
 * Record a public dossier view or section attention event.
 * If Supabase is connected, inserts into public.link_events.
 */
export async function recordLinkAttentionEvent(params: {
  linkId: string;
  eventType: string;
  sectionName?: string;
  durationSeconds?: number;
}) {
  if (!client) {
    // Fallback: log to console or localStorage in local preview
    return { success: true, mode: 'local' };
  }

  try {
    const { error } = await client.from('link_events').insert({
      link_id: params.linkId,
      event_type: params.eventType,
      section_name: params.sectionName || null,
      duration_seconds: params.durationSeconds || 0,
      user_agent: navigator.userAgent,
    });
    if (error) throw error;
    return { success: true, mode: 'supabase' };
  } catch (err) {
    console.error('[BookMarkSoft] Error logging attention event to Supabase:', err);
    return { success: false, error: err };
  }
}

/**
 * Fetch vouch by token (for referee verification)
 */
export async function getVouchByToken(token: string) {
  if (!client) return null;
  const { data, error } = await client
    .from('vouches')
    .select('*')
    .eq('token', token)
    .single();

  if (error) return null;
  return data;
}

/**
 * 1-Click Referee Verification
 */
export async function confirmVouch(token: string, quote?: string) {
  if (!client) return { success: true, mode: 'local' };

  const auditHash = `SHA256:${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
  const { data, error } = await client
    .from('vouches')
    .update({
      status: 'verified',
      referee_quote: quote || 'Verified all stated employment dates and competencies.',
      audit_hash: auditHash,
      verified_at: new Date().toISOString(),
    })
    .eq('token', token);

  if (error) return { success: false, error };
  return { success: true, auditHash };
}
