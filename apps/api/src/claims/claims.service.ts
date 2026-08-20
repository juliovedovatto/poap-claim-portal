import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface ClaimEvent {
  id: number;
  name: string;
  date: string;
  description: string;
  claimable: boolean;
}

export interface ClaimReceipt {
  eventId: number;
  attendee: string;
  claimedAt: string;
  txHash: string | null;
}

@Injectable()
export class ClaimsService {
  // Real implementation would query this.supabase.client (RLS-protected). For
  // this demo the service serves mock data and keeps claims in memory.
  constructor(private readonly supabase: SupabaseService) {}

  private readonly events: ClaimEvent[] = [
    {
      id: 1,
      name: 'Base Camp Hackathon',
      date: '2024-06-15T18:00:00.000Z',
      description: 'Attendees of the Base Camp hackathon kickoff.',
      claimable: true,
    },
    {
      id: 2,
      name: 'Onchain Summer',
      date: '2024-08-01T12:00:00.000Z',
      description: 'Early builders who shipped during Onchain Summer.',
      claimable: true,
    },
    {
      id: 3,
      name: 'Devcon SEA',
      date: '2024-11-12T09:00:00.000Z',
      description: 'Community members who joined the Devcon SEA side event.',
      claimable: false,
    },
  ];

  private readonly receipts = new Map<string, ClaimReceipt>();

  getEvents(): ClaimEvent[] {
    return this.events;
  }

  getEventById(id: number): ClaimEvent {
    const event = this.events.find((e) => e.id === id);
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }

  createClaim(eventId: number, attendee: string): ClaimReceipt {
    // Reject claims for unknown events (404 path).
    this.getEventById(eventId);
    const key = `${eventId}:${attendee}`;
    const existing = this.receipts.get(key);
    if (existing) {
      return existing;
    }
    const receipt: ClaimReceipt = {
      eventId,
      attendee,
      claimedAt: new Date().toISOString(),
      txHash: null,
    };
    this.receipts.set(key, receipt);
    return receipt;
  }
}
