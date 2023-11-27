import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export default function generateMockEntry() {
  const entryId = uuidv4();
  const available = faker.datatype.boolean();

  return {
    id: entryId,
    options: "option1",
    available: available,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    number: faker.number.int(),
  };
}
