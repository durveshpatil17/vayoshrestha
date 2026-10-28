import { SmsFallbackRecord } from '@/api/contracts';

class MockSmsGateway {
  public dispatchSms(
    sosId: string,
    seniorId: string,
    recipientName: string,
    recipientPhone: string,
    relationship: string,
    messageText: string,
    templateId: string = 'DLT-TE-11071689234',
    simulateFailureReason?: string
  ): SmsFallbackRecord {
    const id = `sms-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date();

    if (simulateFailureReason) {
      return {
        id,
        sosId,
        seniorId,
        recipientName,
        recipientPhone,
        relationship,
        templateId,
        messageText,
        status: 'Failed',
        failureReason: simulateFailureReason,
        sentAt: now.toISOString(),
        retryCount: 0,
      };
    }

    const deliveredAt = new Date(now.getTime() + 600).toISOString();

    return {
      id,
      sosId,
      seniorId,
      recipientName,
      recipientPhone,
      relationship,
      templateId,
      messageText,
      status: 'Delivered',
      sentAt: now.toISOString(),
      deliveredAt,
      retryCount: 0,
    };
  }

  public retrySms(record: SmsFallbackRecord): SmsFallbackRecord {
    const now = new Date();
    return {
      ...record,
      status: 'Delivered',
      failureReason: undefined,
      sentAt: now.toISOString(),
      deliveredAt: new Date(now.getTime() + 500).toISOString(),
      retryCount: (record.retryCount || 0) + 1,
    };
  }
}

export const mockSmsGateway = new MockSmsGateway();
