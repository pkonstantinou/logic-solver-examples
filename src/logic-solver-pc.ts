import * as Logic from 'logic-solver';

// valid combinations
// 4GB with 128GB
// 8GB with 256GB or 512GB

type Map = { [key: string]: number } | { [key: number]: string };

const RamMap: Map = {
  0: '4GB',
  1: '8GB',
  '4GB': 0,
  '8GB': 1
};

const StorageMap: Map = {
  0: '128GB',
  1: '256GB',
  2: '512GB',
  '128GB': 0,
  '256GB': 1,
  '512GB': 2
};

const configure = () => {
  const ram = Logic.variableBits('ram', 2);
  const storage = Logic.variableBits('storage', 2);

  const solver = new Logic.Solver();

  // general constraints
  solver.require(
    Logic.or(
      Logic.equalBits(ram, Logic.constantBits(RamMap['4GB'])),
      Logic.equalBits(ram, Logic.constantBits(RamMap['8GB']))
    )
  );

  solver.require(
    Logic.or(
      Logic.equalBits(storage, Logic.constantBits(StorageMap['128GB'])),
      Logic.equalBits(storage, Logic.constantBits(StorageMap['256GB'])),
      Logic.equalBits(storage, Logic.constantBits(StorageMap['512GB']))
    )
  );

  // 4GB with 128GB
  solver.require(
    Logic.implies(
      Logic.equalBits(ram, Logic.constantBits(RamMap['4GB'])),
      Logic.equalBits(storage, Logic.constantBits(StorageMap['128GB']))
    )
  );

  // 8GB with 256GB or 512GB
  solver.require(
    Logic.implies(
      Logic.equalBits(ram, Logic.constantBits(RamMap['8GB'])),
      Logic.or(
        Logic.equalBits(storage, Logic.constantBits(StorageMap['256GB'])),
        Logic.equalBits(storage, Logic.constantBits(StorageMap['512GB']))
      )
    )
  );

  solver.require(
    Logic.equalBits(storage, Logic.constantBits(StorageMap['512GB']))
  );

  const solution = solver.solve();

  if (solution) {
    const ramOptionName = RamMap[solution.evaluate(ram)];
    const storageOptionName = StorageMap[solution.evaluate(storage)];

    console.log(`Solution: RAM ${ramOptionName}, Storage ${storageOptionName}`);
  } else {
    console.log('No solution found');
  }
};

configure();
