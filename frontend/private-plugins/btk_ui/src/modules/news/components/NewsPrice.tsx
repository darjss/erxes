import { InfoCard, InfoCardContent } from '@/btk/components/card';
import { Button, CurrencyCode, CurrencyField, Label, Select } from 'erxes-ui';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useNewsDetail } from '../hooks/useNewsDetail';
import { useEffect, useState } from 'react';
import { useUpdateNewsGeneralInfo } from '~/modules/news/hooks/useUpdateNews';
import { INewsPrice } from '~/modules/news/types/newsTypes';

export const NewsPrice = () => {
  const { news } = useNewsDetail();
  const { updateNewsGeneralInfo } = useUpdateNewsGeneralInfo();
  const [mainPrice, setMainPrice] = useState(news?.mainPrice);
  const [prices, setPrices] = useState<INewsPrice[]>(
    news?.prices?.map((p) => ({
      currency: p.currency as CurrencyCode,
      price: p.price,
      priceType: p.priceType as INewsPrice['priceType'],
    })) || [],
  );

  useEffect(() => {
    if (news?.mainPrice) {
      setMainPrice(news?.mainPrice);
    }
  }, [news?.mainPrice]);

  useEffect(() => {
    if (news?.prices) {
      setPrices(
        news?.prices?.map((p) => ({
          currency: p.currency as CurrencyCode,
          price: p.price,
          priceType: p.priceType as INewsPrice['priceType'],
        })) || [],
      );
    }
  }, [news?.prices]);

  const handleMainPriceBlur = () => {
    if (mainPrice !== news?.mainPrice) {
      updateNewsGeneralInfo(news?._id || '', { mainPrice });
    }
  };

  const handlePriceChange = (
    index: number,
    data: { price?: number; priceType?: INewsPrice['priceType'] },
  ) => {
    setPrices(prices?.map((p, i) => (i === index ? { ...p, ...data } : p)));
  };

  const handlePriceDelete = (index: number) => {
    const newPrices = prices?.filter((_, i) => i !== index);
    setPrices(newPrices);
    updateNewsGeneralInfo(news?._id || '', { prices: newPrices });
  };

  const handleAddPrice = (
    currency: CurrencyCode,
    price: number,
    priceType: INewsPrice['priceType'],
  ) => {
    const newPrices: INewsPrice[] = [
      ...(prices || []),
      {
        currency,
        price,
        priceType,
      },
    ];
    setPrices(newPrices);
    updateNewsGeneralInfo(news?._id || '', { prices: newPrices });
  };

  return (
    <InfoCard title="Pricing Settings" description="Square meter price">
      <InfoCardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Main Price</Label>
          <CurrencyField.ValueInput
            value={mainPrice}
            onChange={setMainPrice}
            onBlur={handleMainPriceBlur}
          />
        </div>
        <div className="space-y-2">
          <Label asChild>
            <legend>Prices</legend>
          </Label>
          {prices && prices.length > 0 && (
            <div className="space-y-2 pb-2">
              {(prices || []).map((price, index) => (
                <div className="grid grid-cols-4 gap-2">
                  <CurrencyField.SelectCurrency
                    value={price.currency as CurrencyCode}
                    display="code"
                  />
                  <CurrencyField.ValueInput
                    value={price.price}
                    onChange={(value) =>
                      handlePriceChange(index, { price: value })
                    }
                    className="col-span-2"
                  />
                  <div className="flex gap-2">
                    <Select
                      value={price.priceType}
                      onValueChange={(value) =>
                        handlePriceChange(index, {
                          priceType: value as INewsPrice['priceType'],
                        })
                      }
                    >
                      <Select.Trigger className="min-w-1 h-8">
                        <Select.Value placeholder="per" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="priceBySize">per m²</Select.Item>
                        <Select.Item value="priceByQuantity">
                          per unit
                        </Select.Item>
                      </Select.Content>
                    </Select>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-8 text-destructive bg-destructive/10 hover:bg-destructive/20"
                      onClick={() => handlePriceDelete(index)}
                    >
                      <IconTrash />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <NewsPriceAddPrice onAddPrice={handleAddPrice} />
        </div>
      </InfoCardContent>
    </InfoCard>
  );
};

export const NewsPriceAddPrice = ({
  onAddPrice,
}: {
  onAddPrice: (
    currency: CurrencyCode,
    price: number,
    priceType: INewsPrice['priceType'],
  ) => void;
}) => {
  const [currency, setCurrency] = useState<CurrencyCode | ''>('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [priceType, setPriceType] = useState<INewsPrice['priceType']>(
    'priceBySize' as INewsPrice['priceType'],
  );
  return (
    <>
      <div className="space-y-2">
        <Label>Add Price</Label>
        <div className="grid grid-cols-4 gap-2">
          <CurrencyField.SelectCurrency
            value={currency as CurrencyCode}
            display="code"
            onChange={setCurrency}
          />
          <CurrencyField.ValueInput
            className="col-span-2"
            value={price}
            onChange={setPrice}
          />
          <Select
            value={priceType}
            onValueChange={(value) =>
              setPriceType(value as INewsPrice['priceType'])
            }
          >
            <Select.Trigger className="min-w-1 h-8">
              <Select.Value placeholder="per" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="priceBySize">per m²</Select.Item>
              <Select.Item value="priceByQuantity">per unit</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>
      <Button
        variant="secondary"
        className="w-full mt-4"
        disabled={!currency || !price}
        onClick={() => {
          onAddPrice(currency as CurrencyCode, price || 0, priceType);
          setCurrency('');
          setPrice(undefined);
        }}
      >
        <IconPlus />
        Add Price
      </Button>
    </>
  );
};
