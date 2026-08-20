import { Injectable } from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// In production this service queries Supabase (RLS-protected). For this demo it
// is wired but the ClaimsService uses mock data.
@Injectable()
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL ?? 'https://demo.supabase.co';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'demo-service-role-key';

    this.client = createClient(url, key);
  }
}
