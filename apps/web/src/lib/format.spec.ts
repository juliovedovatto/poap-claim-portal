import { test, expect, describe } from 'bun:test';
import { formatClaimStatus, formatEventDate } from './format';

describe('formatClaimStatus', () => {
  const statuses = ['idle', 'preparing', 'pending', 'success', 'error'] as const;

  for (const status of statuses) {
    test(`maps ${status} to a non-empty label`, () => {
      const label = formatClaimStatus(status);
      expect(label.length).toBeGreaterThan(0);
    });
  }

  test('returns distinct labels for distinct statuses', () => {
    const labels = statuses.map((s) => formatClaimStatus(s));
    expect(new Set(labels).size).toBe(statuses.length);
  });
});

describe('formatEventDate', () => {
  test('formats a known ISO date to a readable string', () => {
    const formatted = formatEventDate('2024-06-15T18:00:00.000Z');
    expect(formatted).toContain('2024');
    expect(formatted).toContain('June');
    expect(formatted).toContain('15');
  });

  test('returns a fallback for an invalid date', () => {
    expect(formatEventDate('not-a-date')).toBe('Date unavailable');
  });
});
