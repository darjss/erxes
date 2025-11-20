import { BTK_GET_NEWS_LIST } from '~/modules/news/graphql/newsQueries';
import { useRemoveNews } from '~/modules/news/hooks/useRemoveNews';
import { IconArrowUp, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { Button, DropdownMenu, toast, useConfirm } from 'erxes-ui';
import { useNavigate, useParams } from 'react-router-dom';
import { usePublishNews } from '~/modules/news/hooks/usePublishNews';

export const NewsDetailActions = () => {
  const { id: projectId } = useParams();
  const { confirm } = useConfirm();
  const { removeNews } = useRemoveNews();
  const { publishNews } = usePublishNews();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">
          <IconDotsVertical />
          Actions
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-48" align="end">
        <DropdownMenu.Item
          onClick={() =>
            publishNews({
              variables: { id: projectId },
              refetchQueries: [{ query: BTK_GET_NEWS_LIST }],
              onCompleted: () => {
                navigate('/btk/news');
                toast({
                  title: 'Success',
                  description: 'News published successfully',
                });
              },
              onError: (error) => {
                toast({
                  title: 'Error',
                  description: error.message,
                  variant: 'destructive',
                });
              },
            })
          }
        >
          <IconArrowUp />
          Publish News
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="text-destructive"
          onClick={() =>
            confirm({
              message: 'Are you sure you want to delete this news?',
              options: {
                okLabel: 'Delete',
              },
            }).then(() => {
              removeNews({
                variables: { id: projectId },
                refetchQueries: [{ query: BTK_GET_NEWS_LIST }],
                onCompleted: () => {
                  navigate('/btk/news');
                  toast({
                    title: 'Success',
                    description: 'News deleted successfully',
                  });
                },
                onError: (error) => {
                  toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                  });
                },
              });
            })
          }
        >
          <IconTrash />
          Delete News
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
