import { useAgentDetails } from '../hooks/useAgentDetails';
import { useUpdateAgentFile } from '../hooks/useUpdateAgentFile';
import { Button, Spinner, Textarea, ToggleGroup } from 'erxes-ui';
import { useEffect, useState } from 'react';

export const AgentContent = ({ selectedId }: { selectedId: string | null }) => {
  const { files, loading } = useAgentDetails(selectedId);
  const { updateFile, loading: saving } = useUpdateAgentFile(
    selectedId ?? undefined,
  );
  const [selectedFile, setSelectedFile] = useState<string>(
    files[0]?.fileName ?? '',
  );
  const [content, setContent] = useState<string>(files[0]?.content ?? '');

  useEffect(() => {
    const file = files.find((f) => f.fileName === selectedFile);
    setContent(file?.content ?? '');
    if (!selectedFile) {
      setSelectedFile(files[0]?.fileName ?? '');
      setContent(files[0]?.content ?? '');
    }
  }, [selectedFile, files]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            size="lg"
            defaultValue={files[0].fileName}
            value={selectedFile}
            onValueChange={(value) => {
              if (!value) {
                return;
              }
              setSelectedFile(value);
            }}
          >
            {files.map((file) => (
              <ToggleGroup.Item value={file.fileName}>
                {file.fileName}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <div className="flex flex-col flex-1 min-h-0">
        <Textarea
          className="flex-1 h-full resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button
          disabled={saving}
          onClick={() => updateFile(selectedFile, content)}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};
