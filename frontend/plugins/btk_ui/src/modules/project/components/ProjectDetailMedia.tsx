import { useState } from 'react';
import { InfoCard, InfoCardContent } from '@/btk/components/card';
import {
  Upload,
  UploadProvider,
  UploadRemoveButton,
} from '@/btk/components/upload';
import { useProjectDetail } from '@/project/hooks/useProjectDetail';
import { useUpdateProjectGeneralInfo } from '@/project/hooks/useUpdateProject';
import { IconPhotoCirclePlus, IconUpload, IconX } from '@tabler/icons-react';
import { Button, readImage, Input, Dialog, Form } from 'erxes-ui';
import {
  RemoveButton,
  UploadButton,
  UploadCard,
} from '@/btk/components/UploadCard';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { btkProjectSchema } from '~/modules/btk/constants/btkProjectSchema';
import { BtkEditorField } from '~/modules/btk/components/BtkEditor';

export const ProjectDetailMedia = () => {
  const { project } = useProjectDetail();
  const { updateProjectGeneralInfo } = useUpdateProjectGeneralInfo();
  const [titleValue, setTitleValue] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof btkProjectSchema>>({
    defaultValues: {
      content: project?.content || '',
      title: project?.title || titleValue,
    },
  });

  const onSubmit = async (data: z.infer<typeof btkProjectSchema>) => {
    try {
      await updateProjectGeneralInfo(project?._id || '', {
        content: data.content,
        title: data.title,
        description: data.description,
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 blk:lg:grid-cols-2 grid gap-6">
      <ProjectImage field="coverImage" />
      <ProjectImage field="logo" />
      <ProjectImages />
      <ProjectVideo />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="col-span-2 space-y-6"
        >
          <InfoCard title="Title">
            <Input {...form.register('title')} placeholder="Title" />
          </InfoCard>

          <InfoCard title="Content">
            <InfoCardContent>
              <BtkEditorField
                control={form.control}
                setValue={form.setValue}
                name="content"
                label="Content"
                initialContent={project?.content || ''}
              />

              <Button type="submit" className="mt-4">
                Save Content
              </Button>
            </InfoCardContent>
          </InfoCard>
        </form>
      </Form>
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
    setImageValue(value || '');
    updateProjectGeneralInfo(project?._id || '', { [field]: value || null });
  };

  return (
    <UploadCard
      title={field === 'coverImage' ? 'Project Cover' : 'Project Logo'}
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
    <InfoCard title="Project Images" className="col-span-2">
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
                    className="absolute inset-0 object-cover rounded-lg"
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
                    </Dialog.Content>
                  </Dialog>
                  <UploadRemoveButton url={image}>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IconX />
                    </Button>
                  </UploadRemoveButton>
                </div>
              ))
            ) : (
              <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center">
                <IconPhotoCirclePlus className="size-8 text-scroll" />
              </div>
            )}
          </div>

          <Upload>
            <Button asChild className="w-full" variant="secondary">
              <div>
                <IconUpload /> Add images
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
    <InfoCard title="Project Video" className="col-span-2">
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
              title="Project Video"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full aspect-video rounded-lg"
            />
            <div className="w-full mt-2">
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
  );
};
