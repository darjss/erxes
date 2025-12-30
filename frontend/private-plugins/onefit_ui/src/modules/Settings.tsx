import { PaymentSelection } from '@/config/components/PaymentSelection';

const OneFitSettings = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">OneFit Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure OneFit system settings
        </p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <PaymentSelection />
      </div>
    </div>
  );
};

export default OneFitSettings;

