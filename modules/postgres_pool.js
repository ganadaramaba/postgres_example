
const pgPool = require("pg").Pool;
const pgConfig = require("../privateData/pgConfig");
const pool = new pgPool(pgConfig);

// client가 너무 많아지면 서버에 이상이 생길 수 있기 때문에 pool을 사용
const createClient = async () => {

    try {
        const client = await pool.connect();
        return client;
    }
    catch(err) {
        throw err;
    }
}

const disConnect = async (client) => {

    try {
        // client.release();

        // await client.release();

        await client.release(err => {
            console.log("err:", err);
            console.log("i'm in release callback");
        });
        // await을 붙여도, 안 붙여도, 콜백 함수를 넣어도 실행은 됨.
        // client 출력해보니 제대로 release된 것 같기는 함
        
        await pool.end(); // 이게 없으면 바로 끝나지 않고 잠깐 멈췄다가 끝남.
    }
    catch(err) {
        throw err;
    }
}

const singleQuery = async (client, sql, values) => {

    try {
        const result = await client.query(sql, values);
        return result;
    }
    catch(err) {
        throw err;
    }
}

module.exports = {
    createClient,
    disConnect,
    singleQuery
}