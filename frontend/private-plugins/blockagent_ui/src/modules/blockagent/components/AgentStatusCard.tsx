import { IconCircleFilled } from '@tabler/icons-react';
import { Card } from 'erxes-ui';

export function AgentStatusCard() {
  return (
    <Card className="shadow-xs w-full bg-sidebar">
      <Card.Content className='pt-6'>
        <ul className="text-xs space-y-3">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Агентын төрөл:</span>
            <span>Агентлаг</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Баталгаажуулсан огноо:
            </span>
            <span>2025.01.13</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Нийтийн профайл:</span>
            <span className="flex items-center gap-2">
              <IconCircleFilled size={8} className="text-success" /> Идэвхтэй,
              олон нийтэд харагдаж байна
            </span>
          </li>
        </ul>
      </Card.Content>
    </Card>
  );
}
