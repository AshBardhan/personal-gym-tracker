import { execFileSync } from "node:child_process";
import { validReleaseTypes } from "./constants.js";

const validComponents = ["client", "server"];
const [component, positionalReleaseType] = process.argv.slice(2);
const flagReleaseType = validReleaseTypes.find((releaseType) => process.env[`npm_config_${releaseType}`] === "true");
const releaseType = positionalReleaseType ?? flagReleaseType ?? "patch";

if (!validComponents.includes(component) || !validReleaseTypes.includes(releaseType)) {
  console.error("Usage: npm run version:<client|server> [--patch|--minor|--major]");
  process.exit(1);
}

execFileSync("npm", ["version", "--prefix", component, "--no-git-tag-version", releaseType], { stdio: "inherit" });
