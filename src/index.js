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

  if (summer()) {
    charge = quantity * plan.summerRate;
  } else {
    charge = quantity * plan.regularRate + plan.regularServiceCharge;
  }

  return charge;
}
