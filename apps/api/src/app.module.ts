import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { ClaimsModule } from './claims/claims.module';

@Module({
  imports: [SupabaseModule, ClaimsModule],
})
export class AppModule {}
