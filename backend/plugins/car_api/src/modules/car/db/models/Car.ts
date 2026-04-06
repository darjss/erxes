import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { carSchema } from '@/car/db/definitions/car';
import { ICar, ICarDocument } from '@/car/@types/car';

export interface ICarModel extends Model<ICarDocument> {
  getCar(_id: string): Promise<ICarDocument>;
  getCars(): Promise<ICarDocument[]>;
  createCar(doc: ICar): Promise<ICarDocument>;
  updateCar(_id: string, doc: ICar): Promise<ICarDocument>;
  removeCar(CarId: string): Promise<{  ok: number }>;
}

export const loadCarClass = (models: IModels) => {
  class Car {
    /**
     * Retrieves car
     */
    public static async getCar(_id: string) {
      const Car = await models.Car.findOne({ _id }).lean();

      if (!Car) {
        throw new Error('Car not found');
      }

      return Car;
    }

    /**
     * Retrieves all cars
     */
    public static async getCars(): Promise<ICarDocument[]> {
      return models.Car.find().lean();
    }

    /**
     * Create a car
     */
    public static async createCar(doc: ICar): Promise<ICarDocument> {
      return models.Car.create(doc);
    }

    /*
     * Update car
     */
    public static async updateCar(_id: string, doc: ICar) {
      return await models.Car.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove car
     */
    public static async removeCar(CarId: string[]) {
      return models.Car.deleteOne({ _id: { $in: CarId } });
    }
  }

  carSchema.loadClass(Car);

  return carSchema;
};
