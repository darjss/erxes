import { IconCommand, IconCornerDownLeft } from '@tabler/icons-react';
import {
  BlockEditor,
  Button,
  getMentionedUserIds,
  Kbd,
  useBlockEditor,
} from 'erxes-ui';
import { AssignMemberInEditor } from 'ui-modules';
import { useBlockCreateNote } from '../hooks/useCreateNote';
import { Block } from '@blocknote/core';
import { useHotkeys } from 'react-hotkeys-hook';
import { useState } from 'react';

const isEmptyParagraph = (block: Block) =>
  block.type === 'paragraph' &&
  (!block.content || block.content.length === 0) &&
  (!block.children || block.children.length === 0);

const trimEmptyParagraphs = (blocks: Block[]) => {
  let startIndex = 0;
  while (startIndex < blocks.length && isEmptyParagraph(blocks[startIndex])) {
    startIndex++;
  }

  let endIndex = blocks.length - 1;
  while (endIndex >= startIndex && isEmptyParagraph(blocks[endIndex])) {
    endIndex--;
  }

  return blocks.slice(startIndex, endIndex + 1);
};

export const NoteInput = ({
  contentId,
  contentType,
}: {
  contentId: string;
  contentType: 'oppty';
}) => {
  const editor = useBlockEditor({ placeholder: 'Leave a note...' });
  const { blockCreateNote, loading } = useBlockCreateNote();
  const [focused, setFocused] = useState(false);

  const onSend = () => {
    if (loading) return;
    if (!editor) return;

    const content = (editor.document || []) as Block[];
    const trimmedContent = trimEmptyParagraphs(content);

    if (trimmedContent.length === 0) return;

    blockCreateNote({
      variables: {
        content: JSON.stringify(trimmedContent),
        contentId,
        mentions: getMentionedUserIds(trimmedContent),
        contentType,
      },
      onCompleted: () => {
        editor.replaceBlocks(editor.document, []);
      },
    });
  };

  useHotkeys('mod+enter', onSend, {
    enabled: focused,
    enableOnContentEditable: true,
  });

  return (
    <div className="flex flex-col border rounded-lg min-h-14 px-4 py-3">
      <BlockEditor
        editor={editor}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="read-only"
        disabled={loading}
      >
        <AssignMemberInEditor editor={editor} />
      </BlockEditor>
      <div className="flex justify-end">
        <Button
          size="lg"
          className="ml-auto"
          disabled={loading}
          onClick={onSend}
        >
          Send
          <Kbd className="ml-1">
            <IconCommand size={12} />
            <IconCornerDownLeft size={12} />
          </Kbd>
        </Button>
      </div>
    </div>
  );
};
