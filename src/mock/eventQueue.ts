/**
 * In-Browser Event Queue with Real-Time Multi-Tab Cross-Talk via BroadcastChannel.
 * Simulates a Redis-like background queue with depth metrics and high-precision latency measurement.
 */

export interface QueueEvent<T = any> {
  id: string;
  type:
    | 'SOS_TRIGGER'
    | 'SOS_ACK'
    | 'SOS_RESOLVE'
    | 'REMINDER_DISPATCH'
    | 'VITALS_LOG'
    | 'SMS_FALLBACK'
    | 'BROADCAST_SYNC'
    | 'SOS_TRIGGERED'
    | 'FALLBACK_SMS_TRIGGERED'
    | string;
  payload: T;
  enqueuedAt: number; // performance.now() or Date.now()
  timestamp: string | number; // ISO string or timestamp
}

type EventListener = (event: QueueEvent) => void;

class InBrowserEventQueue {
  private queue: QueueEvent[] = [];
  private listeners: EventListener[] = [];
  private channel: BroadcastChannel | null = null;
  private channelSupported = typeof BroadcastChannel !== 'undefined';

  constructor() {
    if (this.channelSupported) {
      try {
        this.channel = new BroadcastChannel('vayoshrestha_cross_tab_v2');
        this.channel.onmessage = (msgEvent) => {
          if (msgEvent.data && msgEvent.data.type) {
            this.notifyListeners(msgEvent.data);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization failed, using storage event fallback', err);
      }
    }

    // Storage event fallback for older or sandboxed contexts
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'vayoshrestha_storage_event_sync' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifyListeners(parsed);
          } catch {
            // Ignore parse errors
          }
        }
      });
    }
  }

  /**
   * Enqueues an event, notifies local listeners, and broadcasts to other browser tabs.
   */
  public enqueue<T = any>(typeOrEvent: any, payload?: T): QueueEvent<T> {
    let finalType: string;
    let finalPayload: any;

    if (typeof typeOrEvent === 'object' && typeOrEvent !== null) {
      finalType = typeOrEvent.type || 'BROADCAST_SYNC';
      finalPayload = typeOrEvent.payload !== undefined ? typeOrEvent.payload : typeOrEvent;
    } else {
      finalType = typeOrEvent;
      finalPayload = payload;
    }

    const event: QueueEvent<T> = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: finalType,
      payload: finalPayload,
      enqueuedAt: performance.now(),
      timestamp: new Date().toISOString(),
    };

    this.queue.push(event as QueueEvent);

    // Keep queue length bounded to 500 in memory
    if (this.queue.length > 500) {
      this.queue.shift();
    }

    // Notify local listeners
    this.notifyListeners(event as QueueEvent);

    // Broadcast cross-tab
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch {
        // Fallback
      }
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vayoshrestha_storage_event_sync', JSON.stringify(event));
      } catch {
        // Quota or unavailable
      }
    }

    return event;
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(event: QueueEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (e) {
        console.error('Error in queue listener:', e);
      }
    });
  }

  public getDepth(): number {
    return this.queue.length;
  }

  public getRecentEvents(): QueueEvent[] {
    return [...this.queue].slice(-50);
  }
}

export const eventQueue = new InBrowserEventQueue();
