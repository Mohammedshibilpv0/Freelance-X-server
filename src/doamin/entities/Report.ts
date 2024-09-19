export interface ReportRequestBody {
    reportedUserId: string;
    reporterUserId: string;
    reason: 'Spam' | 'Inappropriate Content' | 'Harassment' | 'Other';
    customReason?: string;
  }