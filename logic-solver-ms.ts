import * as Logic from 'logic-solver';
import { each, map } from 'lodash';

const A = Logic.variableBits('A', 4);
const B = Logic.variableBits('B', 4);
const C = Logic.variableBits('C', 4);
const D = Logic.variableBits('D', 4);
const E = Logic.variableBits('E', 4);
const F = Logic.variableBits('F', 4);
const G = Logic.variableBits('G', 4);
const H = Logic.variableBits('H', 4);
const I = Logic.variableBits('I', 4);

const locations = [A, B, C, D, E, F, G, H, I];
const targetSum = Logic.constantBits(15); // Target sum for each term

// Define terms (rows, columns, and diagonals) that should sum to targetSum
const terms = [
  [A, B, C], // Row 1
  [D, E, F], // Row 2
  [G, H, I], // Row 3
  [A, D, G], // Column 1
  [B, E, H], // Column 2
  [C, F, I], // Column 3
  [A, E, I], // Diagonal 1
  [C, E, G], // Diagonal 2
];

const solver = new Logic.Solver();

//////////////////////////////////////////////////////////////
each(terms, (term) =>
  solver.require(Logic.equalBits(Logic.sum(term), targetSum)),
);

const solution1 = solver.solve();

// Check if a solution exists
if (solution1) {
  // Evaluate and print each variable's value
  const output = map(locations, (location) => solution1.evaluate(location));
  console.log('Solution 1:', output);
} else {
  console.log('No solution found');
}
//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
each(locations, (location) => {
  solver.require(Logic.greaterThanOrEqual(location, Logic.constantBits(1)));
  solver.require(Logic.lessThanOrEqual(location, Logic.constantBits(9)));
});

const solution2 = solver.solve();

// Check if a solution exists
if (solution2) {
  // Evaluate and print each variable's value
  const output = map(locations, (location) => solution2.evaluate(location));
  console.log('Solution 2:', output);
} else {
  console.log('No solution found');
}
//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
each(locations, (loc1, i) => {
  each(locations, (loc2, j) => {
    if (i !== j) {
      solver.forbid(Logic.equalBits(loc1, loc2));
    }
  });
});

const solution3 = solver.solve();

// Check if a solution exists
if (solution3) {
  // Evaluate and print each variable's value
  const output = map(locations, (location) => solution3.evaluate(location));
  console.log('Solution 3:', output);
} else {
  console.log('No solution found');
}
//////////////////////////////////////////////////////////////
// 4, 9, 2
// 3, 5, 7
// 8, 1, 6
