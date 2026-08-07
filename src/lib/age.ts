export function calculateAge(birthDate: Date, eventDate: Date) {
  const birth = new Date(birthDate);
  const event = new Date(eventDate);
  let age = event.getFullYear() - birth.getFullYear();
  const monthDiff = event.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && event.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export function isAgeInRange(age: number, min: number, max: number) {
  return age >= min && age <= max;
}
