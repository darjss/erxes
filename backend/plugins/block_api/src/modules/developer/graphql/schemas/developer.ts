export const types = `
  type Developer {
    _id: String
    name: String
    description: String
    logo: String
    website: String
    address: JSON
    dateFounded: Date
    email: String
    phone: String
  }

  input DeveloperInput {
    name: String
    description: String
    logo: String
    website: String
    address: JSON
    dateFounded: Date
    email: String
    phone: String
  }
`;

export const queries = `
  getDeveloperInfo: Developer
`;

export const mutations = `
  updateDeveloperInfo(input: DeveloperInput): Developer
`;
