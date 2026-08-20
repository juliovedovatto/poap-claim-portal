import { test, expect, describe } from 'bun:test';
import { ClaimsService } from './claims.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('ClaimsService', () => {
  const service = new ClaimsService(new SupabaseService());

  test('getEvents returns 3 events', () => {
    expect(service.getEvents()).toHaveLength(3);
  });

  test('getEventById(1).name is Base Camp Hackathon', () => {
    expect(service.getEventById(1).name).toBe('Base Camp Hackathon');
  });

  test('getEventById(999) throws', () => {
    expect(() => service.getEventById(999)).toThrow();
  });

  test('createClaim is idempotent on eventId+attendee', () => {
    const a = service.createClaim(1, '0xabc');
    const b = service.createClaim(1, '0xabc');
    expect(a).toEqual(b);
  });

  test('createClaim distinguishes attendees', () => {
    const a = service.createClaim(1, '0x1');
    const b = service.createClaim(1, '0x2');
    expect(a.attendee).not.toBe(b.attendee);
  });
});
