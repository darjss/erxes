import { InfoCard, InfoCardContent } from '@/block/components/card';
import { Upload, UploadProvider } from '@/block/components/upload';
import { useProjectDetail } from '@/project/hooks/useProjectDetail';
import { useUpdateProjectGeneralInfo } from '@/project/hooks/useUpdateProject';
import { IconPhotoCirclePlus, IconUpload, IconX } from '@tabler/icons-react';
import { Button, readImage, Input, Dialog } from 'erxes-ui';
import { UploadRemoveButton } from '@/block/components/upload';
import { useState } from 'react';
import {
  RemoveButton,
  UploadButton,
  UploadCard,
} from '@/block/components/UploadCard';

export const ProjectDetailMedia = () => {
  return (
    <div className="p-8 lg:grid-cols-2 grid gap-6">
      <ProjectImage field="coverImage" />
      <ProjectImage field="logo" />
      <ProjectImages />
      <ProjectVideo />
    </div>
  );
};

export const ProjectImage = ({ field }: { field: 'coverImage' | 'logo' }) => {
  const { project } = useProjectDetail();
  const [imageValue, setImageValue] = useState<string | undefined>(
    project?.[field],
  );
  const { updateProjectGeneralInfo } = useUpdateProjectGeneralInfo();
  const onValueChange = (value?: string) => {
    setImageValue(value as string);
    updateProjectGeneralInfo(project?._id || '', {
      [field]: (value as string) || null,
    });
  };
  // office-erxes-io/SNc1to8A4Own6pBaeSmzOScreenshot 2025-09-07 at 20.03.28.png
  return (
    <UploadCard
      title={field === 'coverImage' ? 'Project cover' : 'Project logo'}
      value={imageValue}
      onValueChange={onValueChange}
      fit="cover"
    >
      <div className="grid grid-cols-2 gap-2">
        <UploadButton value={imageValue} />
        <RemoveButton value={imageValue} />
      </div>
    </UploadCard>
  );
};

export const ProjectImages = () => {
  const { project } = useProjectDetail();
  const [images, setImages] = useState<string[]>(project?.images || []);
  return (
    <InfoCard title="Project images">
      <InfoCardContent>
        <UploadProvider
          mode="multiple"
          value={images}
          onValueChange={(value) => setImages(value as string[])}
        >
          <div className="grid gap-3 grid-cols-6">
            {images.length > 0 ? (
              images.map((image) => (
                <div
                  key={image}
                  className="relative aspect-square bg-muted rounded-lg flex items-center justify-center group"
                >
                  <img
                    src={readImage(image)}
                    className="size-full absolute inset-0 object-cover rounded-lg"
                    alt="project"
                  />
                  <Dialog>
                    <Dialog.Trigger asChild>
                      <div className="absolute inset-0 border border-foreground/10 rounded-lg" />
                    </Dialog.Trigger>
                    <Dialog.Content className="p-0 max-w-screen-xl w-auto border-0 bg-transparent">
                      <img
                        src={readImage(image)}
                        alt="project"
                        className="rounded-lg max-h-[90vh] max-w-[90vw] object-contain mx-auto"
                      />
                      <div className="absolute inset-0 border border-foreground/10 rounded-lg" />
                    </Dialog.Content>
                  </Dialog>
                  <UploadRemoveButton url={image}>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-6 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IconX />
                    </Button>
                  </UploadRemoveButton>
                </div>
              ))
            ) : (
              <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <IconPhotoCirclePlus className="size-8 text-scroll" />
              </div>
            )}
          </div>

          <Upload>
            <Button asChild className="w-full" variant="secondary">
              <div>
                <IconUpload />
                Add images
              </div>
            </Button>
          </Upload>
        </UploadProvider>
      </InfoCardContent>
    </InfoCard>
  );
};

export const ProjectVideo = () => {
  const [videoValue, setVideoValue] = useState<string | undefined>(undefined);
  return (
    <div>
      <InfoCard title="Project video">
        <InfoCardContent>
          <Input
            type="text"
            placeholder="Video URL"
            value={videoValue}
            onChange={(e) => setVideoValue(e.target.value)}
          />
          <Dialog>
            <Dialog.Trigger asChild>
              <Button variant="secondary" disabled={!videoValue}>
                Preview
              </Button>
            </Dialog.Trigger>
            <Dialog.Content className="p-4 border-0 overflow-hidden">
              <iframe
                src={videoValue}
                title="Project video"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full aspect-video rounded-lg overflow-hidden"
              />
              <div className="w-full">
                <Dialog.Close asChild>
                  <Button variant="secondary" className="w-full">
                    Close preview
                  </Button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog>
        </InfoCardContent>
      </InfoCard>
    </div>
  );
};
