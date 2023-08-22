import { faker } from "@faker-js/faker";

export const generateProducts = (count) => {
  let mockProducts = [];

  for (let i = 1; i <= count; i++) {
    mockProducts.push({
      _id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.string.alphanumeric(10),
      price: Number(faker.commerce.price()),
      status: faker.helpers.arrayElement(["disponible", "no disponible"]),
      stock: faker.number.int({ min: 1, max: 100 }),
      category: faker.commerce.department(),
      quantity: faker.number.int(),
    });
  }

  return mockProducts;
};
