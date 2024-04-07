import { calculateCharge, ManagedDate } from './index';

describe('calculateCharge', () => {
  it('should calculate the charge for the summer', () => {
    const quantity = 10;
    const aDate = new ManagedDate('2021-07-01');
    const plan = {
      summerStart: new Date('2021-06-01'),
      summerEnd: new Date('2021-09-01'),
      summerRate: 1,
      regularRate: 2,
      regularServiceCharge: 3,
    };

    expect(calculateCharge(aDate, plan, quantity)).toEqual(10);
  });

  it('should calculate the charge for the other seasons', () => {
    const quantity = 10;
    const aDate = new ManagedDate(new Date('2021-01-01'));
    const plan = {
      summerStart: new Date('2021-06-01'),
      summerEnd: new Date('2021-09-01'),
      summerRate: 1,
      regularRate: 2,
      regularServiceCharge: 3,
    };

    expect(calculateCharge(aDate, plan, quantity)).toEqual(23);
  });
});
