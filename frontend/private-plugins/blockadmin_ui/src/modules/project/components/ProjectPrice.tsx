import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, CurrencyCode, CurrencyField, Label, Select } from 'erxes-ui';
import { InfoCard, InfoCardContent } from '@/block/components/card';
import { useUpdateProjectGeneralInfo } from '@/project/hooks/useUpdateProject';
import { IProjectPrice } from '@/project/types/projectTypes';
import { useEffect, useState } from 'react';
import { useProjectDetail } from '../hooks/useProjectDetail';

export const ProjectPrice = () => {
  const { project } = useProjectDetail();
  const { updateProjectGeneralInfo } = useUpdateProjectGeneralInfo();
  const [mainPrice, setMainPrice] = useState(project?.mainPrice);
  const [prices, setPrices] = useState<IProjectPrice[]>(
    project?.prices?.map((p) => ({
      currency: p.currency as CurrencyCode,
      price: p.price,
      priceType: p.priceType as IProjectPrice['priceType'],
    })) || [],
  );

  useEffect(() => {
    if (project?.mainPrice) {
      setMainPrice(project?.mainPrice);
    }
  }, [project?.mainPrice]);

  useEffect(() => {
    if (project?.prices) {
      setPrices(
        project?.prices?.map((p) => ({
          currency: p.currency as CurrencyCode,
          price: p.price,
          priceType: p.priceType as IProjectPrice['priceType'],
        })) || [],
      );
    }
  }, [project?.prices]);

  const handleMainPriceBlur = () => {
    if (mainPrice !== project?.mainPrice) {
      updateProjectGeneralInfo(project?._id || '', { mainPrice });
    }
  };

  const handlePriceChange = (
    index: number,
    data: { price?: number; priceType?: IProjectPrice['priceType'] },
  ) => {
    setPrices(prices?.map((p, i) => (i === index ? { ...p, ...data } : p)));
  };

  const handlePriceDelete = (index: number) => {
    const newPrices = prices?.filter((_, i) => i !== index);
    setPrices(newPrices);
    updateProjectGeneralInfo(project?._id || '', { prices: newPrices });
  };

  const handleAddPrice = (
    currency: CurrencyCode,
    price: number,
    priceType: IProjectPrice['priceType'],
  ) => {
    const newPrices: IProjectPrice[] = [
      ...(prices || []),
      {
        currency,
        price,
        priceType,
      },
    ];
    setPrices(newPrices);
    updateProjectGeneralInfo(project?._id || '', { prices: newPrices });
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
                          priceType: value as IProjectPrice['priceType'],
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
          <ProjectPriceAddPrice onAddPrice={handleAddPrice} />
        </div>
      </InfoCardContent>
    </InfoCard>
  );
};

export const ProjectPriceAddPrice = ({
  onAddPrice,
}: {
  onAddPrice: (
    currency: CurrencyCode,
    price: number,
    priceType: IProjectPrice['priceType'],
  ) => void;
}) => {
  const [currency, setCurrency] = useState<CurrencyCode | ''>('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [priceType, setPriceType] = useState<IProjectPrice['priceType']>(
    'priceBySize' as IProjectPrice['priceType'],
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
              setPriceType(value as IProjectPrice['priceType'])
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
