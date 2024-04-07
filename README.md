[![Continuous Integration](https://github.com/kaiosilveira/decompose-conditional-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/decompose-conditional-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Decompose Conditional

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
let charge;

if (!aDate.isBefore(plan.summerStart) && !aDate.isAfter(plan.summerEnd)) {
  charge = quantity * plan.summerRate;
} else {
  charge = quantity * plan.regularRate + plan.regularServiceCharge;
}
```

</td>

<td>

```javascript
if (summer()) charge = summerCharge();
else charge = regularCharge();
```

</td>
</tr>
</tbody>
</table>

Conditionals can get tricky fast, be it because of the length of each conditional leg, because of the rules applied to each branch, or because of the intrinsic nature of the conditions. This refactoring helps bring clarity to all these cases.

## Working example

Our working example, extracted from the book, is a program that calculates the charge for a plan, applying special rules if it is summertime. The code looks like this:

```javascript
export function calculateCharge(aDate, plan, quantity) {
  let charge;

  if (!aDate.isBefore(plan.summerStart) && !aDate.isAfter(plan.summerEnd)) {
    charge = quantity * plan.summerRate;
  } else {
    charge = quantity * plan.regularRate + plan.regularServiceCharge;
  }

  return charge;
}
```

### Test suite

The test suite covers the regular case and the special case:

```javascript
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
```

And with these tests in place, we're safe to move forward.

### Steps

We start by **[extracting](https://github.com/kaiosilveira/extract-function-refactoring)** the conditions that define whether or not it's summertime into its own function:

```diff
+++ b/src/index.js
@@ -15,7 +15,11 @@export class ManagedDate {
 export function calculateCharge(aDate, plan, quantity) {
   let charge;
-  if (!aDate.isBefore(plan.summerStart) && !aDate.isAfter(plan.summerEnd)) {
+  function summer() {
+    return !aDate.isBefore(plan.summerStart) && !aDate.isAfter(plan.summerEnd);
+  }
+
+  if (summer()) {
     charge = quantity * plan.summerRate;
   } else {
     charge = quantity * plan.regularRate + plan.regularServiceCharge;
```

Then, we start extracting each branch of the conditional. We start with the `then` case, i.e., the charge calculation applied to summertime:

```diff
+++ b/src/index.js
@@ -19,8 +19,12 @@ export function calculateCharge(aDate, plan, quantity) {
     return !aDate.isBefore(plan.summerStart) && !aDate.isAfter(plan.summerEnd);
   }
+  function summerCharge() {
+    return quantity * plan.summerRate;
+  }
+
   if (summer()) {
-    charge = quantity * plan.summerRate;
+    charge = summerCharge();
   } else {
     charge = quantity * plan.regularRate + plan.regularServiceCharge;
   }
```

And then we do the same for the `else` clause:

```diff
+++ b/src/index.js
@@ -23,10 +23,14 @@ export function calculateCharge(aDate, plan, quantity) {
     return quantity * plan.summerRate;
   }
+  function regularCharge() {
+    return quantity * plan.regularRate + plan.regularServiceCharge;
+  }
+
   if (summer()) {
     charge = summerCharge();
   } else {
-    charge = quantity * plan.regularRate + plan.regularServiceCharge;
+    charge = regularCharge();
   }
   return charge;
```

As a final touch, we can simplify the code by replacing the `if` statement with a ternary operator:

```diff
+++ b/src/index.js
@@ -13,8 +13,6 @@ export class ManagedDate {
 }
 export function calculateCharge(aDate, plan, quantity) {
-  let charge;
-
   function summer() {
     return !aDate.isBefore(plan.summerStart) && !aDate.isAfter(plan.summerEnd);
   }
@@ -27,11 +25,6 @@ export function calculateCharge(aDate, plan, quantity) {
     return quantity * plan.regularRate + plan.regularServiceCharge;
   }
-  if (summer()) {
-    charge = summerCharge();
-  } else {
-    charge = regularCharge();
-  }
-
+  const charge = summer() ? summerCharge() : regularCharge();
   return charge;
 }
```

And that's it!

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                   | Message                                                |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [3faf4bb](https://github.com/kaiosilveira/decompose-conditional-refactoring/commit/3faf4bb12961939d793ddec23bde9b4d30639f0b) | extract summer conditions to its own function          |
| [5542a9d](https://github.com/kaiosilveira/decompose-conditional-refactoring/commit/5542a9dcc3c98be44ace3ced765f7af32ebe2a86) | extract summer charge calculation to its own function  |
| [4859092](https://github.com/kaiosilveira/decompose-conditional-refactoring/commit/4859092dae9659a97142d16cf24669aeba0f8b64) | extract regular charge calculation to its own function |
| [9e8fd5e](https://github.com/kaiosilveira/decompose-conditional-refactoring/commit/9e8fd5e0566bf8018e2ebf267cb2ffbe1a8fd7c6) | replace if statement with ternary operator             |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/decompose-conditional-refactoring/commits/main).
