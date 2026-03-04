import { useState, useEffect } from 'react';
import { PaymentSelection } from '@/config/components/PaymentSelection';
import { useInstanceIdConfig } from '@/config/hooks/useInstanceIdConfig';
import { useOneFitInstanceId } from '@/config/hooks/useOneFitInstanceId';
import { Button, Input } from 'erxes-ui';

const OneFitSettings = () => {
  const {
    instanceId: savedInstanceId,
    loading: configLoading,
    error: configError,
    updateInstanceId,
    updateLoading,
  } = useInstanceIdConfig();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(savedInstanceId);
  }, [savedInstanceId]);

  const handleSave = () => {
    updateInstanceId(inputValue);
  };

  const hasChange = inputValue !== savedInstanceId;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">OneFit Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure OneFit system settings
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Instance ID</h2>
          <p className="text-sm text-gray-600 mb-4">
            This value identifies the current OneFit instance. Save it here to
            use it as the instance ID for this deployment (e.g. in slave mode).
          </p>

          {configLoading ? (
            <div className="text-sm text-gray-500">Loading instance ID...</div>
          ) : configError ? (
            <div className="text-sm text-red-500">
              Failed to load instance ID
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter instance ID"
                className="w-full"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={updateLoading || !hasChange}
                  variant="default"
                >
                  {updateLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <PaymentSelection />
        </div>
      </div>
    </div>
  );
};

export default OneFitSettings;
