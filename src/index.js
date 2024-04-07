export class ManagedDate {
  constructor(date) {
    this.date = new Date(date);
  }

  isBefore(otherDate) {
    return this.date < otherDate;
  }

  isAfter(otherDate) {
    return this.date > otherDate;
  }
}

export function calculateCharge(aDate, plan, quantity) {
  let charge;

  function summer() {
    return !aDate.isBefore(plan.summerStart) && !aDate.isAfter(plan.summerEnd);
  }

  function summerCharge() {
    return quantity * plan.summerRate;
  }

  function regularCharge() {
    return quantity * plan.regularRate + plan.regularServiceCharge;
  }

  if (summer()) {
    charge = summerCharge();
  } else {
    charge = regularCharge();
  }

  return charge;
}
