import { useAtom } from 'jotai';
import {
  Badge,
  Button,
  FocusSheet,
  InfoCard,
  ScrollArea,
  Sheet,
  Table,
} from 'erxes-ui';
import { IconRefresh } from '@tabler/icons-react';
import { format } from 'date-fns';
import { ISubmission } from '../types';
import { ProductsInline } from 'ui-modules';
import { statusVariant } from './submissionColumns';
import { SubmitProductSheet } from './SubmitProductSheet';
import { submissionDetailSheetState } from '../states/submissionDetailSheetState';

const Row = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | React.ReactNode;
}) => (
  <Table.Row>
    <Table.Cell className="bg-sidebar p-2 w-44 h-auto min-h-10 text-muted-foreground">
      {label}
    </Table.Cell>
    <Table.Cell className="p-2 h-auto min-h-10 whitespace-normal">
      {value ?? '—'}
    </Table.Cell>
  </Table.Row>
);

const SubmissionInfo = ({ submission }: { submission: ISubmission }) => {
  const o = submission.offering;
  return (
    <div className="flex flex-col gap-4">
      <InfoCard title="General">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row
                label="Product"
                value={
                  <ProductsInline
                    productIds={[submission.productId]}
                    placeholder="Unknown product"
                  />
                }
              />
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 w-44 h-auto min-h-10 text-muted-foreground">
                  Status
                </Table.Cell>
                <Table.Cell className="p-2 h-auto min-h-10">
                  <Badge variant={statusVariant(submission.status)}>
                    {submission.status}
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Row
                label="Submitted"
                value={
                  submission.submittedAt
                    ? format(
                        new Date(submission.submittedAt),
                        'dd.MM.yyyy HH:mm',
                      )
                    : null
                }
              />
              <Row
                label="Decided"
                value={
                  submission.decidedAt
                    ? format(new Date(submission.decidedAt), 'dd.MM.yyyy HH:mm')
                    : null
                }
              />
              {submission.note && (
                <Row
                  label="Rejection note"
                  value={
                    <span className="text-destructive">{submission.note}</span>
                  }
                />
              )}
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>

      <InfoCard title="Offering">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row
                label="Price"
                value={
                  o?.price != null
                    ? `₮${Number(o.price).toLocaleString()}`
                    : null
                }
              />
              <Row label="Stock" value={o?.stock} />
              <Row label="Min buy qty" value={o?.minBuyCount} />
              <Row label="Max buy qty" value={o?.maxBuyCount} />
              <Row label="Group buy min" value={o?.groupBuyMinCount} />
              <Row
                label="Group discount"
                value={
                  o?.groupBuyDiscount != null ? `${o.groupBuyDiscount}%` : null
                }
              />
              <Row
                label="Warranty"
                value={
                  o?.warrantyDuration != null
                    ? `${o.warrantyDuration} mo`
                    : null
                }
              />
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>
    </div>
  );
};

export const SubmissionDetailSheet = () => {
  const [submission, setSubmission] = useAtom(submissionDetailSheetState);

  const handleClose = () => setSubmission(null);

  return (
    <FocusSheet
      open={Boolean(submission)}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <FocusSheet.View className="sm:max-w-lg">
        <FocusSheet.Header title="Submission detail" />
        <FocusSheet.Content className="flex flex-auto overflow-hidden">
          <ScrollArea className="flex-auto h-full">
            <div className="p-4">
              {submission && <SubmissionInfo submission={submission} />}
            </div>
          </ScrollArea>
        </FocusSheet.Content>
        <Sheet.Footer className="flex-none">
          {submission?.status === 'rejected' ? (
            <>
              <Button
                variant="secondary"
                className="bg-border"
                onClick={handleClose}
              >
                Close
              </Button>
              <SubmitProductSheet
                defaultProductId={submission.productId}
                trigger={
                  <Button>
                    <IconRefresh size={14} className="mr-1" />
                    Resubmit
                  </Button>
                }
                onCompleted={() => {
                  handleClose();
                }}
              />
            </>
          ) : (
            <Sheet.Close asChild>
              <Button
                variant="secondary"
                className="bg-border"
                onClick={handleClose}
              >
                Close
              </Button>
            </Sheet.Close>
          )}
        </Sheet.Footer>
      </FocusSheet.View>
    </FocusSheet>
  );
};
