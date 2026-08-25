import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

function run(command, args, options = {}) {
  return execFileSync(command, args, { stdio: "inherit", ...options });
}

function output(command, args) {
  return execFileSync(command, args, { encoding: "utf8" }).trim();
}

function packageVersion(path) {
  return JSON.parse(readFileSync(path, "utf8")).version;
}

function assertTagAtHead(tag) {
  const tagCommit = output("git", ["rev-list", "-n", "1", tag]);
  const headCommit = output("git", ["rev-parse", "HEAD"]);

  if (tagCommit !== headCommit) {
    throw new Error(`Tag ${tag} does not point to the release commit.`);
  }
}

const changedFiles = new Set(output("git", ["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"]).split("\n"));
const appTag = `app-v${packageVersion("package.json")}`;
const releaseTags = [appTag];

assertTagAtHead(appTag);

for (const component of ["client", "server"]) {
  if (!changedFiles.has(`${component}/package.json`)) continue;

  const tag = `${component}-v${packageVersion(`${component}/package.json`)}`;
  run("git", [
    "tag",
    "-a",
    tag,
    "-m",
    `${component[0].toUpperCase()}${component.slice(1)} ${packageVersion(`${component}/package.json`)}`,
  ]);
  releaseTags.push(tag);
}

run("git", ["push", "--atomic", "origin", "HEAD", ...releaseTags]);
