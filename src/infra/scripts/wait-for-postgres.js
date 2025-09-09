const { exec } = require("node:child_process");

console.log("\n🔴 Waiting for Postgres to accept connections");

const checkPostgres = () => {
  const handleReturn = (error, stdout) => {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }
    console.log("\n🟢 Postgres is accepting connections \n");
  };

  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
};

checkPostgres();
