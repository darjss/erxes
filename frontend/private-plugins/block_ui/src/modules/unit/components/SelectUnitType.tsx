import { useUnitTypes } from '@/unit/hooks/useUnitTypes';
import { Form, Select, useQueryState } from 'erxes-ui';
import React from 'react';
import { useParams } from 'react-router-dom';

export const SelectUnitType = ({
  value,
  onValueChange,
  inForm = false,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  inForm?: boolean;
}) => {
  const { id } = useParams();
  const [projectId] = useQueryState<string>('projectId');

  const { unitTypes } = useUnitTypes({ project: id || (projectId as string) });
  const Control = inForm ? Form.Control : React.Fragment;

  const handleValueChange = (val: string) => {
    onValueChange?.(val);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <Control>
        <Select.Trigger className="h-8 bg-background">
          <Select.Value placeholder="Select unit type" />
        </Select.Trigger>
      </Control>
      <Select.Content>
        {unitTypes?.map((type) => (
          <Select.Item key={type._id} value={type._id}>
            {type.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
