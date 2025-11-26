import { UNIT_MARKET_TYPE } from '@/unit/constants/unit';
import { Form, Select } from 'erxes-ui';
import React from 'react';

export const SelectTenureType = ({
  value,
  inForm = false,
}: {
  value?: string;
  inForm?: boolean;
}) => {
  const Control = inForm ? Form.Control : React.Fragment;
  return (
    <Select value={value}>
      <Control>
        <Select.Trigger className="h-8 bg-background">
          <Select.Value />
        </Select.Trigger>
      </Control>
      <Select.Content>
        {Object.entries(UNIT_MARKET_TYPE).map(([key, type]) => (
          <Select.Item key={key} value={key}>
            {type.mn}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
