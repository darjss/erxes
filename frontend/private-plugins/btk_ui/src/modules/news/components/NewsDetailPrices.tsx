import { NewsBankPartners } from '~/modules/news/components/NewsBankPartners';
import { NewsPrice } from '~/modules/news/components/NewsPrice';

export const NewsDetailPrices = () => {
  return (
    <div className="p-8 grid-cols-2 grid gap-6">
      <NewsPrice />
      <NewsBankPartners />
    </div>
  );
};
