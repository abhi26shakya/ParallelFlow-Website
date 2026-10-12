import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only client. The service-role key bypasses row-level security, so it
// must never reach client code; this module can only be imported on the server.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    const missing = [
      !url && "SUPABASE_URL",
      !key && "SUPABASE_SERVICE_ROLE_KEY",
    ].filter(Boolean);
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
