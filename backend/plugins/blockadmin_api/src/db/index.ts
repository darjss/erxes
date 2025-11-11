import { connect } from 'erxes-api-shared/utils';
import mongoose from 'mongoose';

const initializeModels = async <IModels>(
  connection: mongoose.Connection,
  loadClasses: (db: mongoose.Connection) => IModels | Promise<IModels>,
) => {
  const models = await loadClasses(connection);

  return models;
};

export const createGenerateModels = <IModels>(
  loadClasses: (db: mongoose.Connection) => IModels | Promise<IModels>,
): (() => Promise<IModels>) => {
  connect();

  const models: IModels | null = null;

  return async function genereteModels(): Promise<IModels> {
    if (models) {
      return models;
    }

    return initializeModels(mongoose.connection, loadClasses);
  };
};
