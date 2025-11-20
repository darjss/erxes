import { useState } from 'react';
import { InfoCard, InfoCardContent } from '@/btk/components/card';
import {
  Upload,
  UploadProvider,
  UploadRemoveButton,
} from '@/btk/components/upload';
import { useNewsDetail } from '~/modules/news/hooks/useNewsDetail';
import { useUpdateNewsGeneralInfo } from '~/modules/news/hooks/useUpdateNews';
import { IconPhotoCirclePlus, IconUpload, IconX } from '@tabler/icons-react';
import { Button, Form, readImage, Input, Dialog } from 'erxes-ui';
import {
  RemoveButton,
  UploadButton,
  UploadCard,
} from '@/btk/components/UploadCard';
import { BtkEditorField } from '~/modules/btk/components/BtkEditor';
import { btkNewsSchema } from '~/modules/btk/constants/btkNewsSchema';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const NewsDetailMedia = () => {
  return (
    <div className="p-8 blk:lg:grid-cols-2 grid gap-6">
      <NewsImage field="coverImage" />
      <NewsImage field="logo" />
      <NewsImages field="images" />
      <NewsVideo />
      <NewsTitle field="title" />
      <NewsContent />
    </div>
  );
};
export const NewsImage = ({ field }: { field: 'coverImage' | 'logo' }) => {
  const { news } = useNewsDetail();
  const [imageValue, setImageValue] = useState<string | undefined>(
    news?.[field],
  );
  const { updateNewsGeneralInfo } = useUpdateNewsGeneralInfo();

  const onValueChange = (value?: string) => {
    setImageValue(value || '');
    updateNewsGeneralInfo(news?._id || '', { [field]: value || null });
  };

  return (
    <UploadCard
      title={field === 'coverImage' ? 'News Cover' : 'News Logo'}
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

export const NewsTitle = ({ field }: { field: 'title' }) => {
  const { news } = useNewsDetail();
  const { updateNewsGeneralInfo } = useUpdateNewsGeneralInfo();

  const [title, setTitle] = useState<string>(news?.title || '');

  const saveTitle = () => {
    updateNewsGeneralInfo(news?._id || '', { [field]: title });
  };

  return (
    <InfoCard title="Title">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={saveTitle}
      />
    </InfoCard>
  );
};
export const NewsContent = () => {
  const { news } = useNewsDetail();
  const { updateNewsGeneralInfo } = useUpdateNewsGeneralInfo();

  const form = useForm<z.infer<typeof btkNewsSchema>>({
    defaultValues: {
      content: news?.content || '',
    },
  });

  const saveContent = async () => {
    const currentContent = form.getValues().content;
    await updateNewsGeneralInfo(news?._id || '', { content: currentContent });
  };

  return (
    <InfoCard title="Content">
      <InfoCardContent>
        <Form {...form}>
          <BtkEditorField
            control={form.control}
            setValue={form.setValue}
            name="content"
            label="Content"
            initialContent={news?.content || ''}
          />
          <Button type="button" className="mt-4" onClick={saveContent}>
            Save Content
          </Button>
        </Form>
      </InfoCardContent>
    </InfoCard>
  );
};

export const NewsImages = ({ field }: { field: 'images' }) => {
  const { news } = useNewsDetail();
  const [images, setImages] = useState<string[]>(news?.images || []);

  const { updateNewsGeneralInfo } = useUpdateNewsGeneralInfo();

  const onImagesChange = async (value: string[]) => {
    setImages(value);
    await updateNewsGeneralInfo(news?._id || '', { [field]: value });
  };

  return (
    <InfoCard title="News images">
      <InfoCardContent>
        <UploadProvider
          mode="multiple"
          value={images}
          onValueChange={(value) => onImagesChange(value as string[])}
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
                    alt="news"
                  />
                  <Dialog>
                    <Dialog.Trigger asChild>
                      <div className="absolute inset-0 border border-foreground/10 rounded-lg" />
                    </Dialog.Trigger>
                    <Dialog.Content className="p-0 max-w-screen-xl w-auto border-0 bg-transparent">
                      <img
                        src={readImage(image)}
                        alt="news"
                        className="rounded-lg max-h-[90vh] max-w-[90vw] object-contain mx-auto"
                      />
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

export const NewsVideo = () => {
  const [videoValue, setVideoValue] = useState<string | undefined>(undefined);
  return (
    <div>
      <InfoCard title="News video">
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
                title="News video"
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
