const { execSync } = require("child_process");

function run(cmd) {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

run("npm run server:build");
run("npm run expo:static:build");

console.log("All builds complete.");
