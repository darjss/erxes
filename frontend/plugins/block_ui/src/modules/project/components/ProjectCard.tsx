import { IconMapPinFilled, IconPhotoCirclePlus } from '@tabler/icons-react';
import { readImage, Slider } from 'erxes-ui';
import { Badge } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { IProject } from '../types/projectTypes';

export const ProjectCard = ({ name, _id, coverImage, location }: IProject) => {
  return (
    <Link
      to={`/block/projects/${_id}`}
      className="border bg-accent p-2 rounded-[1.25rem] flex flex-col gap-3"
    >
      <div className="w-full h-full relative aspect-[2/1] rounded-xl overflow-hidden flex items-center justify-center">
        {coverImage ? (
          <img
            src={readImage(coverImage)}
            alt={name}
            className="object-cover absolute inset-0 object-center"
          />
        ) : (
          <IconPhotoCirclePlus className="size-8 text-scroll" />
        )}
        <div className="absolute inset-0 border border-foreground/10 rounded-xl" />
      </div>
      <div className="p-3 pt-0 space-y-2">
        <h3 className="font-medium text-lg leading-6">{name}</h3>
        <div className="flex items-center gap-2 text-accent-foreground">
          <IconMapPinFilled className=" size-4" />
          <p className="text-sm">
            {location
              ? `${location?.address}, ${location?.district}, ${location?.city}`
              : 'No address'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Slider value={[80]} max={100} hideThumb />
          <p className="text-sm ml-1 text-accent-foreground font-medium">85%</p>
          <Badge variant="secondary" className="bg-foreground/5">
            In progress
          </Badge>
        </div>
      </div>
    </Link>
  );
};
