import { Badge, Button, Form, ScrollArea, Sheet, Spinner } from 'erxes-ui';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { StatusTitle } from '../types/verification';

type Props = {
  children: React.ReactNode;
  title: string;
  form: UseFormReturn<z.infer<any>>;
  onSubmit?: (values: z.infer<any>) => Promise<void> | void;
  isLoading?: boolean;
  verificationStatus?: 'verified' | 'unverified' | 'pending';
};

export const ProfileMutateLayout = ({
  children,
  title,
  form,
  onSubmit,
  isLoading,
  verificationStatus,
}: Props) => {
  const isPending = verificationStatus === 'pending' || false;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit?.(values);
        })}
        className="flex-auto flex flex-col h-full overflow-hidden bg-sidebar my-3 shadow-xs rounded-md max-w-2xl w-full mx-auto"
      >
        <Sheet.Content className="grow overflow-hidden flex flex-col">
          <div className="p-5 flex flex-col gap-1 flex-none">
            <div className="flex items-center justify-between">
              <h2 className="text-primary font-semibold text-base">{title}</h2>
              {verificationStatus && (
                <Badge
                  variant={
                    verificationStatus === 'unverified'
                      ? 'destructive'
                      : verificationStatus === 'verified'
                      ? 'success'
                      : verificationStatus === 'pending'
                      ? 'warning'
                      : 'info'
                  }
                >
                  {StatusTitle[verificationStatus as keyof typeof StatusTitle]}
                </Badge>
              )}
            </div>
            <div className="text-xs text-accent-foreground">
              {!verificationStatus
                ? 'Fill in the form to create your agency profile'
                : verificationStatus === 'pending'
                ? 'Your profile is under review. Editing is disabled until verification is complete.'
                : 'Update your agency profile'}
            </div>
          </div>
          <ScrollArea className="h-full">
            <div className="px-5 space-y-3 py-3">{children}</div>
          </ScrollArea>
        </Sheet.Content>
        <Sheet.Footer>
          <Button type="submit" disabled={isLoading || isPending}>
            {isLoading ? <Spinner /> : 'Save'}
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};
