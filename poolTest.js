const pool = require("./modules/postgres_pool");

(async () => {
    const client = await pool.createClient();
    const result = await pool.singleQuery(client, "SELECT * FROM sample.first;", []);
    console.log(result.rows);
    await pool.disConnect(client);
})();