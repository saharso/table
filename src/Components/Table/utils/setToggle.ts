export default function setToggle(prev: Set<string>, member: string) {
  const clone = new Set(prev);
  if (clone.has(member)) {
    clone.delete(member);
  } else {
    clone.add(member);
  }
  return clone;
}
