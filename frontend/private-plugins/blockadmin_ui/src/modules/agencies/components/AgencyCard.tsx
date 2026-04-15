import { IconMapPinFilled, IconPhotoCirclePlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { IAgency, IAgencyOperationArea } from '../types';
import { readImage } from 'erxes-ui/utils/core';

const AgencyAddress = ({ address }: { address: IAgencyOperationArea }) => {
  return (
    <div className="flex items-center gap-2 text-accent-foreground">
      <IconMapPinFilled className="size-4" />
      <p className="text-sm">
        {address
          ? `${address?.city}, ${address?.district}, ${
              address?.country || 'Монгол'
            }`
          : 'No address'}
      </p>
    </div>
  );
};

export const AgencyCard = ({
  _id,
  name,
  coverImage,
  operationArea,
}: IAgency) => {
  return (
    <Link
      to={`/blockadmin/agencies/agencies/${_id}`}
      className="border bg-accent p-2 ba:rounded-[1.25rem] flex flex-col gap-3"
    >
      <div className="w-full h-full relative ba:aspect-2/1 rounded-xl overflow-hidden flex items-center justify-center">
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
        <AgencyAddress address={operationArea} />
      </div>
    </Link>
  );
};
