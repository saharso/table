import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export default function generateMockEntry() {
  const entryId = uuidv4();
  const options = Array.from({ length: 5 }, () => faker.word.adjective());
  const available = faker.datatype.boolean();

  return {
    id: entryId,
    options: options,
    available: available,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
}
