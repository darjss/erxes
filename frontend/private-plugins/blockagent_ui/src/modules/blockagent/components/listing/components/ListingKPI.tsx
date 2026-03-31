import { Card } from 'erxes-ui';
import { CountUp } from './CountUp';

const KPITitles = {
  ALL: 'Нийт зар',
  PUBLISHED: 'Идэвхтэй',
  DRAFT: 'Ноорог',
  VIEWS: 'Нийт үзэлт',
};

enum KPI {
  'ALL',
  'PUBLISHED',
  'DRAFT',
  'VIEWS',
}

const KPIValues = {
  ALL: 24,
  PUBLISHED: 18,
  DRAFT: 3,
  VIEWS: 2847,
};

export const ListingKPI = () => {
  return (
    <div className="grid grid-cols-4 gap-3 p-3 bg-sidebar">
      {Object.entries(KPITitles).map(([key, value], idx) => (
        <Card key={key} className="shrink flex flex-col justify-between">
          <Card.Header>
            <Card.Title className="font-medium text-sm text-accent-foreground uppercase font-mono">
              {value}
            </Card.Title>
          </Card.Header>
          <Card.Content className="text-2xl font-semibold text-foreground self-end">
            <CountUp
              to={KPIValues[key as keyof typeof KPIValues]}
              delay={0.1 * idx}
            />
          </Card.Content>
        </Card>
      ))}
    </div>
  );
};
