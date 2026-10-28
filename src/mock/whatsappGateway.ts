import { OutboundMessage } from '@/api/contracts';

export interface InboundWebhookPayload {
  messageId: string;
  fromPhone: string;
  timestamp: string;
  type: 'text' | 'quick_reply' | 'sos_trigger';
  text?: string;
  buttonPayload?: string;
  signature?: string;
}

class MockWhatsAppGateway {
  private processedMessageIds = new Set<string>();

  /**
   * Validates inbound webhook signature and deduplicates message ID.
   */
  public handleInboundWebhook(payload: InboundWebhookPayload): { success: boolean; error?: string } {
    if (!payload.messageId) {
      return { success: false, error: 'Missing message ID' };
    }

    if (this.processedMessageIds.has(payload.messageId)) {
      return { success: false, error: 'Duplicate webhook payload (already processed)' };
    }

    // Verify mock HMAC signature if present
    if (payload.signature && !payload.signature.startsWith('sha256=')) {
      return { success: false, error: 'Invalid webhook signature' };
    }

    this.processedMessageIds.add(payload.messageId);
    return { success: true };
  }

  /**
   * Simulates sending an outbound WhatsApp message through gateway state progression.
   */
  public sendOutbound(
    phone: string,
    recipientName: string,
    content: string,
    templateId?: string,
    simulateFailureReason?: string
  ): OutboundMessage {
    const now = new Date();
    const id = `wa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    if (simulateFailureReason) {
      return {
        id,
        channel: 'WhatsApp',
        recipientPhone: phone,
        recipientName,
        templateId,
        content,
        status: 'Failed',
        failureReason: simulateFailureReason,
        sentAt: now.toISOString(),
        retryCount: 0,
      };
    }

    const deliveredAt = new Date(now.getTime() + 450).toISOString();
    const readAt = new Date(now.getTime() + 1200).toISOString();

    return {
      id,
      channel: 'WhatsApp',
      recipientPhone: phone,
      recipientName,
      templateId,
      content,
      status: 'Read',
      sentAt: now.toISOString(),
      deliveredAt,
      readAt,
      retryCount: 0,
    };
  }
}

export const mockWhatsAppGateway = new MockWhatsAppGateway();
