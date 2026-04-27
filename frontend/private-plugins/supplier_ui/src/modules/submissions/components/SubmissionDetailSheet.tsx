import { useAtom } from 'jotai';
import { useState } from 'react';
import {
  Badge,
  Button,
  FocusSheet,
  InfoCard,
  ScrollArea,
  Sheet,
  Sidebar,
  Table,
  Tabs,
} from 'erxes-ui';
import { ActivityLogs } from 'ui-modules';
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
    <div className="flex flex-col gap-4 p-4">
      <InfoCard title="General">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row
                label="Product"
                value={
                  <ProductsInline productIds={[submission.productId]} placeholder="Unknown product" />
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
                value={submission.submittedAt ? format(new Date(submission.submittedAt), 'dd.MM.yyyy HH:mm') : null}
              />
              <Row
                label="Decided"
                value={submission.decidedAt ? format(new Date(submission.decidedAt), 'dd.MM.yyyy HH:mm') : null}
              />
              {submission.note && (
                <Row label="Rejection note" value={<span className="text-destructive">{submission.note}</span>} />
              )}
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>

      <InfoCard title="Offering">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row label="Price" value={o?.price != null ? `₮${Number(o.price).toLocaleString()}` : null} />
              <Row label="Stock" value={o?.stock} />
              <Row label="Min buy qty" value={o?.minBuyCount} />
              <Row label="Max buy qty" value={o?.maxBuyCount} />
              <Row label="Group buy min" value={o?.groupBuyMinCount} />
              <Row label="Group discount" value={o?.groupBuyDiscount != null ? `${o.groupBuyDiscount}%` : null} />
              <Row label="Warranty" value={o?.warrantyDuration != null ? `${o.warrantyDuration} mo` : null} />
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>
    </div>
  );
};

const TABS = ['overview', 'activity'] as const;

export const SubmissionDetailSheet = () => {
  const [submission, setSubmission] = useAtom(submissionDetailSheetState);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleClose = () => {
    setSubmission(null);
    setActiveTab('overview');
  };

  return (
    <FocusSheet
      open={Boolean(submission)}
      onOpenChange={(v) => { if (!v) handleClose(); }}
    >
      <FocusSheet.View className="w-[50%] md:w-[50%]">
        <FocusSheet.Header title="Submission detail" />
        <FocusSheet.Content className="flex flex-auto overflow-hidden flex-row min-h-0">
          <FocusSheet.SideBar>
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupContent className="mt-2">
                  <Sidebar.Menu>
                    {TABS.map((t) => (
                      <Sidebar.MenuItem key={t}>
                        <Sidebar.MenuButton
                          isActive={activeTab === t}
                          onClick={() => setActiveTab(t)}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                    ))}
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Sidebar.Group>
            </Sidebar.Content>
          </FocusSheet.SideBar>

          <div className="flex flex-col flex-1 min-h-0 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
              <Tabs.Content value="overview" className="flex-1 min-h-0 data-[state=active]:flex flex-col">
                <ScrollArea className="flex-1 min-h-0">
                  {submission && <SubmissionInfo submission={submission} />}
                </ScrollArea>
              </Tabs.Content>

              <Tabs.Content value="activity" className="flex-1 min-h-0 data-[state=active]:flex flex-col">
                <ScrollArea className="flex-1 min-h-0">
                  <div className="flex flex-col mb-12">
                    {!!submission?._id && (
                      <ActivityLogs
                        targetId={submission._id}
                        showInternalNotes={false}
                      />
                    )}
                  </div>
                </ScrollArea>
              </Tabs.Content>
            </Tabs>

            <Sheet.Footer className="flex-none border-t">
              {submission?.status === 'rejected' ? (
                <>
                  <Button variant="secondary" className="bg-border" onClick={handleClose}>
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
                    onCompleted={handleClose}
                  />
                </>
              ) : (
                <Sheet.Close asChild>
                  <Button variant="secondary" className="bg-border" onClick={handleClose}>
                    Close
                  </Button>
                </Sheet.Close>
              )}
            </Sheet.Footer>
          </div>
        </FocusSheet.Content>
      </FocusSheet.View>
    </FocusSheet>
  );
};
