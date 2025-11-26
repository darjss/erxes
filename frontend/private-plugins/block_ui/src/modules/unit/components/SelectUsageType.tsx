import { Form, Select } from 'erxes-ui';
import { UNIT_USAGE_TYPE } from '@/unit/constants/unit';
import React from 'react';

export const SelectUsageType = ({
  value,
  onValueChange,
  inForm = false,
  readOnly = false,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  inForm?: boolean;
  readOnly?: boolean;
}) => {
  const Control = inForm ? Form.Control : React.Fragment;

  return (
    <Select value={value} onValueChange={onValueChange} disabled={readOnly}>
      <Control>
        <Select.Trigger className="h-8 bg-background">
          <Select.Value />
        </Select.Trigger>
      </Control>
      <Select.Content>
        {Object.entries(UNIT_USAGE_TYPE).map(([key, type]) => (
          <Select.Item key={key} value={key}>
            {type.mn}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};

