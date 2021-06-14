import spawn from 'cross-spawn';

export const installSave = (packages: string[]): void => {
  let res = spawn.sync('npm', ['i', '--save', ...packages], {
    stdio: 'inherit',
  });
  if (res.status) {
    process.exit(res.status);
  }
};

export const installSaveDev = (packages: string[]): void => {
  let res = spawn.sync('npm', ['i', '--save-dev', ...packages], {
    stdio: 'inherit',
  });
  if (res.status) {
    process.exit(res.status);
  }
};
