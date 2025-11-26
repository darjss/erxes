import { IconPhotoCirclePlus } from '@tabler/icons-react';
import { buttonVariants, cn } from 'erxes-ui';
import { forwardRef } from 'react';
import { Button, FileTriggerProps } from 'react-aria-components';

export const Upload = forwardRef<
  HTMLButtonElement,
  Omit<FileTriggerProps, 'acceptedFileTypes'> & {
    children: React.ReactNode;
    className?: string;
    showLoadingCount?: boolean;
  }
>(({ children, className, showLoadingCount = true, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        buttonVariants({
          variant: 'ghost',
          className: 'h-auto relative px-0 py-0 block',
        }),
        className,
      )}
    >
      {children}
    </Button>
  );
});

export const UploadImage = ({
  value,
  className,
  uploaderClassName,
}: {
  value?: string;
  className?: string;
  uploaderClassName?: string;
}) => {
  return (
    <Upload className={uploaderClassName}>
      <div
        className={cn(
          'aspect-square relative flex items-center justify-center',
          className,
        )}
      >
        {value ? (
          <img
            src={value}
            className="w-full h-full object-cover rounded"
            alt="cover"
          />
        ) : (
          <IconPhotoCirclePlus className="size-6 text-scroll" />
        )}
        <div className="absolute inset-0 border border-foreground/10 rounded" />
      </div>
    </Upload>
  );
};
