import * as Logic from 'logic-solver';

const solver = new Logic.Solver();

solver.require(Logic.atMostOne('Alice', 'Bob'));
solver.require(Logic.or('Bob', 'Charlie'));

const solution1 = solver.solve();
console.log('\n');
console.log(
  'Solution 1  ==> ',
  solution1 ? solution1.getTrueVars() : solution1,
);

const solution2 = solver.solveAssuming('Alice');
console.log(
  'Solution 2  ==> ',
  solution2 ? solution2.getTrueVars() : solution2,
);
console.log(solution2.getMap());

const solution3 = solver.solveAssuming(Logic.and('Alice', '-Charlie'));
console.log(
  'Solution 3  ==> ',
  solution3 ? solution3.getTrueVars() : solution3,
);

// List all possible solutions
const solutions = [];
let currentSolution;
while ((currentSolution = solver.solve())) {
  solutions.push(currentSolution.getTrueVars());
  solver.forbid(currentSolution.getFormula());
}

console.log('\n');
console.log('All solutions ==> ', solutions);
