import {
  IconMapPinFilled,
  IconPhotoCirclePlus,
  IconEye,
  IconStar,
} from '@tabler/icons-react';
import { Badge, CurrencyDisplay, formatAmount } from 'erxes-ui';
import { readImage } from 'erxes-ui/utils/core';
import { Link } from 'react-router-dom';
import { IAdminListing } from '../types';
import { AdminListingCardActions } from './AdminListingCardActions';

const STATUS_VARIANT: Record<
  string,
  'success' | 'warning' | 'info' | 'secondary'
> = {
  active: 'success',
  inactive: 'warning',
  sold: 'info',
  draft: 'secondary',
};

const TYPE_LABELS: Record<string, string> = {
  sale: 'Sale',
  rent: 'Rent',
  lease: 'Lease',
};

export const AdminListingCard = ({
  _id,
  title,
  featuredImg,
  status,
  type,
  pricing,
  location,
  viewCount,
  isFeatured,
}: IAdminListing) => {
  return (
    <Link
      to={`/blockadmin/agencies/listing/${_id}`}
      className="border bg-accent p-2 ba:rounded-[1.25rem] flex flex-col gap-3"
    >
      <div className="w-full relative ba:aspect-2/1 rounded-xl overflow-hidden flex items-center justify-center bg-muted">
        {featuredImg ? (
          <img
            src={readImage(featuredImg)}
            alt={title}
            className="object-cover absolute inset-0 w-full h-full object-center"
          />
        ) : (
          <IconPhotoCirclePlus className="size-8 text-muted-foreground" />
        )}
        <div className="absolute inset-0 border border-foreground/10 rounded-xl" />
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge variant={STATUS_VARIANT[status] ?? 'secondary'}>
            {status}
          </Badge>
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {TYPE_LABELS[type] ?? type}
          </Badge>
          {isFeatured && (
            <Badge variant="warning" className="bg-amber-500/90 text-white border-0 backdrop-blur-sm">
              <IconStar className="size-3 mr-0.5" />
              Featured
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <AdminListingCardActions _id={_id} status={status} isFeatured={isFeatured} />
        </div>
        {viewCount !== undefined && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-white bg-black/50 rounded-md px-2 py-0.5 backdrop-blur-sm">
            <IconEye className="size-3" />
            {viewCount}
          </div>
        )}
      </div>

      <div className="px-2 pb-1 space-y-1.5">
        <p className="font-medium leading-snug line-clamp-1">{title}</p>

        {location?.city && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconMapPinFilled className="size-3 shrink-0" />
            <span className="truncate">
              {[location.city, location.district].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {pricing?.amount && (
          <div className="flex items-center gap-1 text-sm font-semibold">
            <CurrencyDisplay variant="code" code={pricing.currency} />
            <span>{formatAmount(pricing.amount, 'finance')}</span>
          </div>
        )}
      </div>
    </Link>
  );
};
