export const types = `
  type Car {
    _id: String
    name: String
    description: String
  }
`;

export const queries = `
  getCar(_id: String!): Car
  getCars: [Car]
`;

export const mutations = `
  createCar(name: String!): Car
  updateCar(_id: String!, name: String!): Car
  removeCar(_id: String!): Car
`;
