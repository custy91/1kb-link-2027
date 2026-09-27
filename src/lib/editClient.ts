import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * A short-lived client that carries the link's secret edit key as a header so
 * the database can verify the caller owns the link before updating/deleting it.
 */
export function editClient(editKey: string) {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set("apikey", key);
        headers.set("x-edit-key", editKey);
        headers.delete("Authorization");
        return fetch(input, { ...init, headers });
      },
    },
  });
}
