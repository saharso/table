import generateMockEntry from "../utils/createMocks";

function* generateNames() {
  const firstNames = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eva",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
    "Katherine",
    "Leo",
    "Mia",
    "Nathan",
    "Olivia",
    "Peter",
    "Quinn",
    "Rachel",
    "Samuel",
    "Tina",
    "Ulysses",
    "Vera",
    "Walter",
    "Xena",
    "Yasmine",
    "Zane",
  ];
  let index = 0;

  while (true) {
    yield firstNames[index];

    index++;
    if (index >= firstNames.length) {
      index = 0; // Restart when the end of the list is reached
    }
  }
}

const names = generateNames();
// generate mock data
const mockDataArray = Array.from({ length: 3000 }, () => {
  return {
    ...generateMockEntry(),
    firstName: names.next().value,
  };
});

export default mockDataArray;
