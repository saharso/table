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
    "Abigail",
    "Benjamin",
    "Chloe",
    "Daniel",
    "Emily",
    "Fiona",
    "George",
    "Hannah",
    "Isaac",
    "Jessica",
    "Kevin",
    "Lily",
    "Matthew",
    "Natalie",
    "Oscar",
    "Penelope",
    "Quincy",
    "Rebecca",
    "Simon",
    "Tiffany",
    "Uma",
    "Vincent",
    "Wendy",
    "Xander",
    "Yvonne",
    "Zara",
    "Alexander",
    "Bella",
    "Caleb",
    "Daisy",
    "Ethan",
    "Felicity",
    "Gabriel",
    "Hazel",
    "Isla",
    "Jacob",
    "Kylie",
    "Liam",
    "Madison",
    "Nora",
    "Oliver",
    "Piper",
    "Quinn",
    "Ruby",
    "Sophia",
    "Tristan",
    "Ursula",
    "Victor",
    "Willow",
    "Xavier",
    "Yolanda",
    "Zachary",
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
