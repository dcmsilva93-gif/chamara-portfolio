import {createClient, SupabaseClient} from '@supabase/supabase-js';
export const configured=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export function supabase():SupabaseClient|null {if(!configured)return null;return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);}
