import { IUnit } from 'frontend/private-plugins/blockadmin_ui/src/modules/unit/types/unitType';
import { createContext, useContext } from 'react';

export const UnitContext = createContext<{
  unit: IUnit;
} | null>(null);

export const useUnitContext = () => {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error('useUnitContext must be used within a UnitContext');
  }

  return context;
};
