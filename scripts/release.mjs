import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { validReleaseTypes, validReleaseMap } from "./constants.js";

const cliArguments = process.argv.slice(2);
const flagReleaseType = validReleaseTypes.find((releaseType) => process.env[`npm_config_${releaseType}`] === "true");
const hasPositionalReleaseType = cliArguments[0] && !["-m", "--message"].includes(cliArguments[0]);
const positionalReleaseType = hasPositionalReleaseType ? cliArguments.shift() : undefined;
const releaseType = positionalReleaseType ?? flagReleaseType ?? "patch";
const messageFlagIndex = cliArguments.findIndex((argument) => argument === "-m" || argument === "--message");
const argumentMessage =
  messageFlagIndex >= 0 ? cliArguments[messageFlagIndex + 1]?.trim() : cliArguments.join(" ").trim();
const releaseMessage = process.env.npm_config_message?.trim() || argumentMessage;

function run(command, args, options = {}) {
  return execFileSync(command, args, { stdio: "inherit", ...options });
}

function output(command, args) {
  return execFileSync(command, args, { encoding: "utf8" }).trim();
}

if (!validReleaseTypes.includes(releaseType)) {
  console.error('Usage: npm run release [-m "release summary"] [--patch|--minor|--major]');
  process.exit(1);
}

if (!releaseMessage) {
  console.error("A one-sentence release summary is required.");
  process.exit(1);
}

if (output("git", ["rev-parse", "--show-toplevel"]) !== process.cwd()) {
  console.error("Run the release command from the repository root.");
  process.exit(1);
}

const versionFiles = [
  "package.json",
  "package-lock.json",
  "client/package.json",
  "client/package-lock.json",
  "server/package.json",
  "server/package-lock.json",
].filter(existsSync);
const allowedUnstagedFiles = new Set(
  versionFiles.filter((path) => path !== "package.json" && path !== "package-lock.json"),
);
const unstagedFiles = output("git", ["diff", "--name-only"]).split("\n").filter(Boolean);

if (unstagedFiles.some((path) => !allowedUnstagedFiles.has(path))) {
  console.error("Stage all intended tracked changes before releasing. Component version files may remain unstaged.");
  process.exit(1);
}

run("npm", ["run", "check:release"]);
run("npm", ["version", releaseType, "--no-git-tag-version", "--ignore-scripts"]);

run("git", ["add", ...versionFiles]);

const appVersion = JSON.parse(readFileSync("package.json", "utf8")).version;
const appTag = `app-v${appVersion}`;

run("git", ["commit", "-m", `[${validReleaseMap[releaseType]} Release: ${appVersion}] - ${releaseMessage}`]);
run("git", ["tag", "-a", appTag, "-m", `Application ${appVersion}`]);
run("npm", ["run", "postversion"]);
