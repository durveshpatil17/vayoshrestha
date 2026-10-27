import { mockStore } from './store';
import { canSendMessage } from '@/domain/consent';

/**
 * In-browser background job simulator
 * - Advances queued messages through delivery lifecycle
 * - Enforces consent blocking
 * - Simulates realistic WhatsApp delivery metrics
 */
class BackgroundJobWorker {
  private timer: number | null = null;

  public start() {
    if (this.timer) return;
    // Tick every 8 seconds
    this.timer = window.setInterval(() => {
      this.processOutboundQueue();
    }, 8000);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public processOutboundQueue() {
    mockStore.updateData((data) => {
      const seniorsMap = new Map(data.seniorCitizens.map((s) => [s.id, s]));

      for (const msg of data.outboundMessages) {
        if (msg.status === 'Queued') {
          const recipient = seniorsMap.get(msg.recipientMemberId);
          if (recipient) {
            const check = canSendMessage(recipient, msg.category);
            if (!check.allowed) {
              msg.status = 'Failed';
              msg.failureReason = check.reason || 'Blocked: No consent recorded';
              continue;
            }
          }

          msg.status = 'Sent';
          msg.sentAt = new Date().toISOString();
        } else if (msg.status === 'Sent') {
          // 95% deliver, 5% fail
          if (Math.random() < 0.05) {
            msg.status = 'Failed';
            msg.failureReason = 'Delivery failed: Recipient number not reachable';
          } else {
            msg.status = 'Delivered';
            msg.deliveredAt = new Date().toISOString();
          }
        } else if (msg.status === 'Delivered') {
          // 80% read
          if (Math.random() < 0.8) {
            msg.status = 'Read';
            msg.readAt = new Date().toISOString();
          }
        }
      }
    });
  }
}

export const backgroundJobs = new BackgroundJobWorker();
