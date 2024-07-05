import path from 'path';
import { exec, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync, writeFileSync } from 'fs';

// Get the list of the dockerized apps
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const __targetDir = path.join(rootDir, 'packages', 'libs', 'themes-preset');

if (existsSync(__targetDir)) {
  let template = readFileSync(
    path.join(__targetDir, 'src', 'template.txt'),
    'utf-8'
  );
  template = `${template.replace(
    '%{replacement}%',
    JSON.stringify(
      {
        date: new Date().toISOString(),
      },
      null,
      2
    )
  )}`;

  const filePath = path.join(__targetDir, 'src', 'lib', 'themes-preset.ts');
  writeFileSync(filePath, template, {
    encoding: 'utf-8',
  });

  // execSync(`npx nx reset`);
  // execSync(`npx nx format:write --skip-nx-cache`);
  // nx format:write --projects=themes-preset --base=${branch} --skip-nx-cache
  // nx format:write --projects=themes-preset --base=feature/GAD-00_change-preset --skip-nx-cache
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString();
  console.log(branch, '@branch');
  execSync(`npx nx reset`);
  console.log('nx command reset...');
  execSync(`git add ${filePath}`);
  execSync(`git commit -am "chore: ci-update preset file generation" --no-verify`);
  execSync(
    `git push origin ${branch}`
  );
}
