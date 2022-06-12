
const pgClient = require("pg").Client;
const pgConfig = require("../privateData/pgConfig");

const clientConnect = async () => {
    const pg = new pgClient(pgConfig);

    try {
        await pg.connect();
        return pg;
    }
    catch(err) {
        console.log("\nCONNECT ERROR");
        throw err;
    }
}

const disConnect = async (client) => {
    try {
        await client.end();
        console.log("client:", client);
        // client 출력 내용 중 일부
        // _ending: true,
        // _connecting: false,
        // _connected: true,
        // _connectionError: false,
        // _queryable: true,
        // 제대로 연결 되었다가 종료된 듯 하다.
        // 연결 상태에서는 _ending이 false 상태임.
    }
    catch(err) {
        console.log("\nDISCONNECT ERROR");
        throw err;
    }
}

const singleQuery = async (client, sql, values) => {
    let result;
    try {
        result = await client.query(sql, values);
    }
    catch(err) {
        console.log("\nQUERY ERROR");
        throw err;
    }

    return result;
}

module.exports = {
    clientConnect,
    disConnect, 
    singleQuery
}