import {
  AutomationNodeMetaInfoRow,
  AutomationTriggerConfigProps,
} from 'ui-modules';
import { TStageProbalityTriggerConfigForm } from '../../states/stageProbalityTriggerConfigFormDefinitions';
import { useTranslation } from 'react-i18next';

export const StageProbalityTriggerNodeContent = ({
  config,
}: AutomationTriggerConfigProps<TStageProbalityTriggerConfigForm>) => {
  const { t } = useTranslation('sales');
  const { probability } = config || {};
  return (
    <div>
      <AutomationNodeMetaInfoRow
        fieldName={t('when-sales-card-moved-to-stage-with-probability')}
        content={probability}
      />
    </div>
  );
};
