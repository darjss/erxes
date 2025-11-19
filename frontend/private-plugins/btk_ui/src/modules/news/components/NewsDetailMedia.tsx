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
import { Button, readImage, Input, Dialog, Form } from 'erxes-ui';
import {
  RemoveButton,
  UploadButton,
  UploadCard,
} from '@/btk/components/UploadCard';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { btkNewsSchema } from '~/modules/btk/constants/btkNewsSchema';
import { BtkEditorField } from '~/modules/btk/components/BtkEditor';

export const NewsDetailMedia = () => {
  const { news } = useNewsDetail();
  const { updateNewsGeneralInfo } = useUpdateNewsGeneralInfo();
  const [titleValue, setTitleValue] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof btkNewsSchema>>({
    defaultValues: {
      content: news?.content || '',
      title: news?.title || titleValue,
    },
  });

  const onSubmit = async (data: z.infer<typeof btkNewsSchema>) => {
    try {
      await updateNewsGeneralInfo(news?._id || '', {
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
      <NewsImage field="coverImage" />
      <NewsImage field="logo" />
      <NewsImages />
      <NewsVideo />
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
                initialContent={news?.content || ''}
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

export const NewsImages = () => {
  const { news } = useNewsDetail();
  const [images, setImages] = useState<string[]>(news?.images || []);

  return (
    <InfoCard title="News Images" className="col-span-2">
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

export const NewsVideo = () => {
  const [videoValue, setVideoValue] = useState<string | undefined>(undefined);

  return (
    <InfoCard title="News Video" className="col-span-2">
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
              title="News Video"
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
