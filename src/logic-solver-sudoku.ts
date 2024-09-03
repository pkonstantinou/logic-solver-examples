import * as Logic from 'logic-solver';

// Start time
const startTime = performance.now();

function distinctBits(bits: Logic.Bits[]): Logic.Formula[] {
  const formulas: Logic.Formula[] = [];

  for (let i = 0; i < bits.length; i++) {
    for (let j = i + 1; j < bits.length; j++) {
      formulas.push(Logic.not(Logic.equalBits(bits[i], bits[j])));
    }
  }

  return formulas;
}

const grid: Logic.Bits[][] = [];

for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
  const rowValues: Logic.Bits[] = [];
  for (let colIdx = 0; colIdx < 9; colIdx++) {
    rowValues.push(Logic.variableBits(`cell_${rowIdx}_${colIdx}`, 4));
  }
  grid.push(rowValues);
}

const solver = new Logic.Solver();

for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
  for (let colIdx = 0; colIdx < 9; colIdx++) {
    // 81 * 2 = 162 constraints
    solver.require(
      Logic.greaterThanOrEqual(grid[rowIdx][colIdx], Logic.constantBits(1)),
      Logic.lessThanOrEqual(grid[rowIdx][colIdx], Logic.constantBits(9))
    );
  }

  // 36 * 9 = 324 constraints
  solver.require(distinctBits(grid[rowIdx]));
}

for (let colIdx = 0; colIdx < 9; colIdx++) {
  // 36 * 9 = 324 constraints
  solver.require(distinctBits(grid.map((row) => row[colIdx])));
}

for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
  for (let colIdx = 0; colIdx < 3; colIdx++) {
    // 36 * 9 = 324 constraints
    solver.require(
      ...distinctBits([
        grid[rowIdx * 3 + 0][colIdx * 3 + 0],
        grid[rowIdx * 3 + 0][colIdx * 3 + 1],
        grid[rowIdx * 3 + 0][colIdx * 3 + 2],
        grid[rowIdx * 3 + 1][colIdx * 3 + 0],
        grid[rowIdx * 3 + 1][colIdx * 3 + 1],
        grid[rowIdx * 3 + 1][colIdx * 3 + 2],
        grid[rowIdx * 3 + 2][colIdx * 3 + 0],
        grid[rowIdx * 3 + 2][colIdx * 3 + 1],
        grid[rowIdx * 3 + 2][colIdx * 3 + 2]
      ])
    );
  }
}

const puzzle = [
  '1...8....',
  '..49.....',
  '35...7.2.',
  '.63......',
  '.82.6.54.',
  '......97.',
  '.4.2...59',
  '.....64..',
  '....4...1'
];

for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
  for (let colIdx = 0; colIdx < 9; colIdx++) {
    const n = puzzle[rowIdx][colIdx];
    if (n !== '.') {
      // max 81 constraints
      solver.require(
        Logic.equalBits(
          grid[rowIdx][colIdx],
          Logic.constantBits(parseInt(n, 10))
        )
      );
    }
  }
}

// Total constraints = 162 + 324 + 324 + 324 + 81 = 1215

const solution = solver.solve();

// End time
const endTime = performance.now();

// Print the solution
for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
  let row = '';
  for (let colIdx = 0; colIdx < 9; colIdx++) {
    row += solution.evaluate(grid[rowIdx][colIdx]);
    if (colIdx === 2 || colIdx === 5) {
      row += '|';
    }
  }
  console.log(row);
  if (rowIdx === 2 || rowIdx === 5) {
    console.log('---+---+---');
  }
}

console.log('\n');
console.log(
  'Time taken: ',
  parseFloat(`${endTime - startTime}`).toFixed(2),
  'ms'
);
