/**
 * Vayoshrestha Ambient Operations Simulator
 * Generates realistic background telemetry pulses for demonstration sessions.
 */
import { mockStore } from '@/mock/store';
import { backgroundJobs } from '@/mock/backgroundJobs';
import { scenarioEngine } from './scenarioEngine';

export interface AmbientTelemetryPulse {
  id: string;
  timestamp: string;
  type: 'VITAL_READING' | 'MESSAGE_DELIVERED' | 'ATTENDANCE_CHECKIN' | 'OFFLINE_SYNC';
  title: string;
  details: string;
  chapter: string;
}

type PulseListener = (pulse: AmbientTelemetryPulse) => void;

class AmbientOperationsSimulator {
  private timer: number | null = null;
  private listeners: Set<PulseListener> = new Set();
  private pulseCount = 0;
  private lastPulse: AmbientTelemetryPulse | null = null;

  public start() {
    if (this.timer) return;

    // Tick interval based on simulation speed
    const tickInterval = 6000;
    this.timer = window.setInterval(() => {
      this.tick();
    }, tickInterval);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public subscribe(fn: PulseListener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public getLastPulse(): AmbientTelemetryPulse | null {
    return this.lastPulse;
  }

  public getPulseCount(): number {
    return this.pulseCount;
  }

  private tick() {
    const speed = scenarioEngine.getSpeed();
    if (speed === 'paused') return;

    // Advance background message queue
    backgroundJobs.processOutboundQueue();

    this.pulseCount++;
    const now = new Date();

    const sampleChapters = ['HUB-BLR', 'HUB-PUN', 'HUB-NSK'];
    const randomChapter = sampleChapters[Math.floor(Math.random() * sampleChapters.length)];

    const pulseTypes: AmbientTelemetryPulse['type'][] = [
      'VITAL_READING',
      'MESSAGE_DELIVERED',
      'ATTENDANCE_CHECKIN',
      'OFFLINE_SYNC',
    ];
    const chosenType = pulseTypes[Math.floor(Math.random() * pulseTypes.length)];

    let title = 'Telemetry update';
    let details = 'Background operation reconciled.';

    switch (chosenType) {
      case 'VITAL_READING':
        const sys = 120 + Math.floor(Math.random() * 25);
        const dia = 75 + Math.floor(Math.random() * 15);
        title = `WhatsApp Vital: ${sys}/${dia} mmHg`;
        details = `Elder check-in processed by NLP parser. Status: ${sys > 140 ? 'High-risk flag' : 'Normal'}.`;
        break;
      case 'MESSAGE_DELIVERED':
        title = 'WhatsApp Gateway Read Receipt';
        details = 'Morning health advisory marked Read by senior.';
        break;
      case 'ATTENDANCE_CHECKIN':
        title = 'Session Attendance Check-in';
        details = 'Volunteer recorded elder walk-in for morning fitness circle.';
        break;
      case 'OFFLINE_SYNC':
        title = 'Field Associate Sync Ticker';
        details = 'Offline tablet synced 2 encrypted records over 2G cellular network.';
        break;
    }

    const pulse: AmbientTelemetryPulse = {
      id: `PULSE-${Date.now()}-${this.pulseCount}`,
      timestamp: now.toISOString(),
      type: chosenType,
      title,
      details,
      chapter: randomChapter,
    };

    this.lastPulse = pulse;
    this.listeners.forEach((listener) => listener(pulse));
  }
}

export const ambientSimulator = new AmbientOperationsSimulator();
