import {
  Button,
  cn,
  Collapsible,
  InfoCard,
  Spinner,
} from 'erxes-ui';
import {
  FieldsInGroup,
  MultipleFieldsInGroup,
  useFieldGroups,
} from 'ui-modules';

type MutateHook = () => {
  mutate: (variables: { _id: string } & Record<string, unknown>) => void;
  loading: boolean;
};

const CarFieldGroupContent = ({
  group,
  contentType,
  propertiesData,
  mutateHook,
  id,
}: {
  group: any;
  id: string;
  contentType: string;
  propertiesData: Record<string, any>;
  mutateHook: MutateHook;
}) => {
  if (group?.configs?.isMultiple) {
    return (
      <MultipleFieldsInGroup
        group={group}
        id={id}
        contentType={contentType}
        propertiesData={propertiesData}
        mutateHook={mutateHook}
      />
    );
  }

  return (
    <Collapsible key={group._id} className="group" defaultOpen>
      <Collapsible.Trigger asChild>
        <Button variant="secondary" className="w-full justify-start">
          <Collapsible.TriggerIcon />
          {group.name}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content className="pt-4">
        <FieldsInGroup
          group={group}
          id={id}
          contentType={contentType}
          propertiesData={propertiesData}
          mutateHook={mutateHook}
        />
      </Collapsible.Content>
    </Collapsible>
  );
};

export const CarPropertiesInDetail = ({
  title,
  fieldContentType,
  propertiesData,
  mutateHook,
  id,
  className,
}: {
  title: string;
  fieldContentType: string;
  propertiesData: Record<string, any>;
  mutateHook: MutateHook;
  id: string;
  className?: string;
}) => {
  const { fieldGroups, loading: fieldGroupsLoading } = useFieldGroups({
    contentType: fieldContentType,
  });

  if (fieldGroupsLoading) {
    return <Spinner containerClassName="py-6" />;
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <InfoCard title={title}>
        <InfoCard.Content>
          {fieldGroups.map((group: any) => (
            <CarFieldGroupContent
              key={group._id}
              group={group}
              id={id}
              contentType={fieldContentType}
              propertiesData={propertiesData}
              mutateHook={mutateHook}
            />
          ))}
        </InfoCard.Content>
      </InfoCard>
    </div>
  );
};
