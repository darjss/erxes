import { Badge, Combobox, Command, Form, Popover, Select } from 'erxes-ui';
import { UNIT_USAGE_TYPE } from '@/unit/constants/unit';
import React from 'react';

export const SelectUsageType = ({
  value,
  onValueChange,
  inForm = false,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  inForm?: boolean;
}) => {
  const Control = inForm ? Form.Control : React.Fragment;

  return (
    <Select>
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

export const SelectUsageTypes = ({
  value,
  onValueChange,
  inForm = false,
  readOnly = false,
}: {
  value?: string[];
  onValueChange?: (value: string[]) => void;
  inForm?: boolean;
  readOnly?: boolean;
}) => {
  const Control = inForm ? Form.Control : React.Fragment;

  return (
    <Popover>
      <Control>
        <Combobox.TriggerBase
          className="flex-wrap justify-start h-auto min-h-8 text-accent-foreground"
          disabled={readOnly}
        >
          {value?.length ? (
            value.map((type: string) => (
              <Badge key={type} variant="secondary">
                {UNIT_USAGE_TYPE[type]?.mn}
              </Badge>
            ))
          ) : (
            <span>Төрөл сонгоно уу</span>
          )}
        </Combobox.TriggerBase>
      </Control>

      <Combobox.Content>
        <Command>
          <Command.Input />
          <Command.List>
            {Object.entries(UNIT_USAGE_TYPE).map(([key, label]) => (
              <Command.Item
                value={key}
                key={key}
              >
                {label.mn}
                <Combobox.Check checked={value?.includes(key)} />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};
