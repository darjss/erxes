import { ActivityLogInput } from 'erxes-api-shared/core-modules';

const formatStatus = (value?: string) =>
  (value || 'unknown')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatPlatform = (platform?: string) => {
  if (!platform) return 'platform';

  if (platform.toLowerCase() === 'mushop') {
    return 'Mushop';
  }

  return platform.charAt(0).toUpperCase() + platform.slice(1);
};

const getSubmissionLabel = (submission: any) => {
  if (submission?.productId) {
    return `Product (${submission.productId})`;
  }

  return 'Product';
};

export const buildSubmissionTarget = (submission: any) => ({
  _id: submission._id,
  productId: submission.productId,
});

export const buildSubmissionSubmittedLog = (submission: any): ActivityLogInput => ({
  activityType: 'submission.submitted',
  target: buildSubmissionTarget(submission),
  action: {
    type: 'submitted',
    description: `${getSubmissionLabel(submission)} was submitted to ${formatPlatform(
      submission?.platform,
    )} and is awaiting review`,
  },
  changes: { status: 'submitted' },
  metadata: { offering: submission.offering },
});

export const buildSubmissionResubmittedLog = (submission: any): ActivityLogInput => ({
  activityType: 'submission.resubmitted',
  target: buildSubmissionTarget(submission),
  action: {
    type: 'resubmitted',
    description: `${getSubmissionLabel(
      submission,
    )} was resubmitted to ${formatPlatform(
      submission?.platform,
    )} and moved back to Pending review`,
  },
  changes: { status: 'pending' },
  metadata: { offering: submission.offering },
});

export const buildSubmissionDecisionLog = (
  submission: any,
  status: string,
  note?: string,
): ActivityLogInput => ({
  activityType: 'submission.decision',
  target: buildSubmissionTarget(submission),
  action: {
    type: status,
    description: `${getSubmissionLabel(submission)} submission on ${formatPlatform(
      submission?.platform,
    )} changed to ${formatStatus(status)}${note ? `. Note: ${note}` : ''}`,
  },
  changes: { status },
  metadata: { note },
});
