import { IconMicrophone } from '@tabler/icons-react';
import { Button, Tooltip } from 'erxes-ui';

// The composer's entry point into hands-free voice mode. A low-key ghost mic
// button next to the reasoning control — mirrors that precedent (per-agent,
// persisted) and only renders when the backend reports voice is configured.

export const VoiceModeToggle = ({
  active,
  onToggle,
  disabled,
}: {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <Tooltip.Provider>
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Voice mode"
          aria-pressed={active}
          disabled={disabled}
          onClick={onToggle}
          className={`size-9 shrink-0 transition-colors hover:text-foreground ${
            active ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <IconMicrophone className="size-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {active ? 'Exit voice mode' : 'Start voice mode'}
      </Tooltip.Content>
    </Tooltip>
  </Tooltip.Provider>
);
