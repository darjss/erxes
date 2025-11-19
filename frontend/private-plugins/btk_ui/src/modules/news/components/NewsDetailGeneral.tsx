import {
  Combobox,
  Label,
  Popover,
  Textarea,
  Command,
  Badge,
  Button,
} from 'erxes-ui';
import { useNewsDetail } from '../hooks/useNewsDetail';
import { InfoCard, InfoCardContent } from '@/btk/components/card';
import { useEffect, useState } from 'react';

import { NEWS_TYPES } from '../constants/news';
import { NewsAddress } from '~/modules/news/components/NewsAddress';
import { useCompanyInfo } from '@/btk/hooks/useCompanyInfo';
import { Link } from 'react-router';
import { IconArrowUpRight } from '@tabler/icons-react';

export const NewsDetailGeneral = () => {
  const { loading } = useNewsDetail();

  if (loading) return null;

  return (
    <div className="grid lg:grid-cols-3 flex-auto">
      <div className="col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <InfoCard title="News Information" description="News information">
          <InfoCardContent>
            <NewsCompany />
            <NewsTypes />
            <NewsDescription />
          </InfoCardContent>
        </InfoCard>
        <NewsAddress />
      </div>
      <div className="border-l min-h-full bg-background"></div>
    </div>
  );
};

export const NewsCompany = () => {
  const { companyInfo } = useCompanyInfo();

  return (
    <div className="space-y-2">
      <Label>Company</Label>
      <Button
        variant="outline"
        className="flex w-full justify-start h-8 shadow-xs"
        asChild
      >
        <Link to="/settings/btk">
          {companyInfo?.name}
          <IconArrowUpRight className="ml-auto" />
        </Link>
      </Button>
    </div>
  );
};

export const NewsDescription = () => {
  const { news } = useNewsDetail();
  const [descriptionValue, setDescriptionValue] = useState(news?.description);

  useEffect(() => {
    if (news?.description) {
      setDescriptionValue(news?.description);
    }
  }, [news?.description]);

  const onBlur = () => {
    if (descriptionValue !== news?.description) {
      // updateNewsGeneralInfo(id, { description: descriptionValue });
    }
  };

  return (
    <div className="space-y-2">
      <Label>Description</Label>
      <Textarea
        value={descriptionValue}
        onChange={(e) => setDescriptionValue(e.target.value)}
        onBlur={onBlur}
      />
    </div>
  );
};

export const NewsTypes = () => {
  const [projectTypes, setNewsTypes] = useState<string[]>([]);
  return (
    <div className="space-y-2">
      <Label>Types</Label>
      <Popover>
        <Combobox.TriggerBase className="justify-start h-auto min-h-8 flex-wrap">
          {projectTypes.map((type) => (
            <Badge key={type} variant="secondary">
              {type}
            </Badge>
          ))}
        </Combobox.TriggerBase>
        <Combobox.Content>
          <Command>
            <Command.Input />
            <Command.List>
              {NEWS_TYPES.map((type) => (
                <Command.Item
                  value={type}
                  key={type}
                  onSelect={() =>
                    setNewsTypes(
                      projectTypes.includes(type)
                        ? projectTypes.filter((t) => t !== type)
                        : [...projectTypes, type],
                    )
                  }
                >
                  {type}
                  <Combobox.Check checked={projectTypes.includes(type)} />
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Combobox.Content>
      </Popover>
    </div>
  );
};
