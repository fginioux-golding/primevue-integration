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

  // Get current branch
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString();
  // Run nx format command
  execSync(`npx nx reset`);
  execSync(`nx format:write --projects=themes-preset --base=feature/GAD-00_change-preset --skip-nx-cache`)
  // Push generated file in the repository
  execSync(`git add ${filePath}`);
  execSync(`git commit -am "chore: ci-update preset file generation" --no-verify`);
  execSync(
    `git push origin ${branch}`
  );
}
