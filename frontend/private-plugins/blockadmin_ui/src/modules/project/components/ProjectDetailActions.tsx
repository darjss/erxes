import { IconArrowUp, IconDotsVertical } from '@tabler/icons-react';
import { Button, DropdownMenu } from 'erxes-ui';

export const ProjectDetailActions = () => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">
          <IconDotsVertical />
          Actions
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-48" align="end">
        <DropdownMenu.Item>
          <IconArrowUp />
          Publish Project
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
