/**
 * Pure Functional Reminder Scheduler and Compliance Engine
 */

export interface ReminderJob {
  scheduleId: string;
  seniorId: string;
  seniorName: string;
  phone: string;
  scheduledTime: string; // 'HH:mm'
  frequency: 'Daily' | 'Weekly';
  days?: string[];
  hasConsent: boolean;
  isOptedOut: boolean;
}

export function isWithinQuietHours(
  timeStr: string, // 'HH:mm'
  quietStart: string = '21:00',
  quietEnd: string = '07:00'
): boolean {
  if (!timeStr) return false;
  // If quietStart > quietEnd (e.g. 21:00 to 07:00 spanning midnight)
  if (quietStart > quietEnd) {
    return timeStr >= quietStart || timeStr < quietEnd;
  }
  return timeStr >= quietStart && timeStr < quietEnd;
}

/**
 * Evaluates whether a reminder can be dispatched right now.
 */
export function canDispatchReminder(
  job: ReminderJob,
  currentTimeStr: string = '08:00',
  currentDay: string = 'Mon',
  quietStart: string = '21:00',
  quietEnd: string = '07:00'
): { canSend: boolean; reason: string } {
  if (!job.hasConsent) {
    return { canSend: false, reason: 'Senior citizen has not consented to general WhatsApp communications.' };
  }

  if (job.isOptedOut) {
    return { canSend: false, reason: 'Senior citizen has opted out of WhatsApp reminders.' };
  }

  if (isWithinQuietHours(currentTimeStr, quietStart, quietEnd)) {
    return { canSend: false, reason: 'Current time falls within configured quiet hours.' };
  }

  if (job.frequency === 'Weekly') {
    if (!job.days || !job.days.includes(currentDay)) {
      return { canSend: false, reason: `Weekly reminder is not scheduled for today (${currentDay}).` };
    }
  }

  return { canSend: true, reason: 'Eligible for dispatch.' };
}

/**
 * Calculates medication confirmation rate: Taken / Reminders Delivered
 */
export function calculateMedicationConfirmationRate(
  takenCount: number,
  deliveredCount: number
): number {
  if (deliveredCount <= 0) return 0;
  const rate = (takenCount / deliveredCount) * 100;
  return Math.min(100, Math.round(rate * 10) / 10);
}

/**
 * Calculates vitals logging rate: Readings Logged / Readings Expected
 */
export function calculateVitalsLoggingRate(
  loggedCount: number,
  expectedCount: number
): number {
  if (expectedCount <= 0) return 0;
  const rate = (loggedCount / expectedCount) * 100;
  return Math.min(100, Math.round(rate * 10) / 10);
}
