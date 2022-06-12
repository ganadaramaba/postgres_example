
const express = require("express");
const router = express.Router();
const pgClient = require("pg").Client;
const pgConfig = require("../privateData/pgConfig.js");
const pg = require("../modules/postgres_module");

const request2 = async (sql, values=[]) => {
    const client = new pgClient(pgConfig);
    let result = null;

    try {
        await client.connect();
        result = await client.query(sql, values);
        await client.end();
        return result;
    }
    catch(err) {
        await client.end();
        throw err;
    }
}

const request = async (sql, values=[]) => {
    const client = await pg.clientConnect();

    let result = await pg.singleQuery(client, sql, values);

    await pg.disConnect(client);
    return result
}

// 모두 가져오기
router.get("", async (req, res) => {
    const result = {
        success: false,
        data: null
    }

    const sql = "SELECT * FROM sample.first;";

    try {
        result.data = (await request(sql)).rows;
        result.success = true;
    }
    catch(err) {
        console.log(err);
    }
    
    res.send(result);
});

// second 테이블에서 모두 가져오기
router.get("/second", async (req, res) => {
    const result = {
        success: false,
        data: null,
        rowCount: 0
    }

    const sql = "SELECT * FROM sample.second;";

    try {
        result.data = (await request(sql)).rows;
        result.success = true;
        result.rowCount = result.data.length;
    }
    catch(err) {
        console.log(err);
    }
    
    res.send(result);
});

// column1과 column2가 모두 일치하는 값 가져오기
router.get("/all/:value1/:value2", async (req, res) => {
    const recieve = {
        column1: req.params.value1,
        column2: req.params.value2
    }
    const result = {
        success: false,
        data: null
    }

    const sql = "SELECT * FROM sample.first WHERR column1=$1 and column2=$2;";
    const values = [recieve.column1, recieve.column2];

    try {
        result.data = await request(sql, values);
        result.success = true;
    }
    catch(err) {
        console.log(err);
    }
    
    res.send(result);
});

// column1이 value값과 같은 행 가져오기
router.get("/column1/:value", async (req, res) => {
    const receive = {
        column1: req.params.value
    }
    const result = {
        success: false,
        data: null
    }

    const sql = "SELECT * FROM sample.first WHERE column1=$1;";
    const values = [receive.column1];

    try {
        result.data = await request(sql);
        result.success = true;
    }
    catch(err) {
        console.log(err);
    }

    res.send(result);
});

router.get("/column2/:value", async (req, res) => {
    const receive = {
        column2: req.params.value
    }
    const result = {
        success: false,
        data: null
    }

    const sql = "SELECT * FROM sample.first WHERE column2=$1;";
    const values = [receive.column2];

    try {
        result.data = await request(sql, values);
        result.success = true;
    }
    catch(err) {
        console.log(err);
    }

    res.send(result);
});

// value값과 같은 행의 수
router.get("/count/all/:column1/:column2", async (req, res) => {
    const receive = {
        column1: req.params.column1,
        column2: req.params.column2
    }
    const result = {
        success: false,
        data: null
    }

    const sql = "SELECT * FROM sample.first WHERE column1=$1 and column2=$2;";
    const values = [receive.column1, receive.column2];

    try {
        const temp = await request(sql, values);
        result.data = temp.length;
        result.success = true;
    }
    catch(err) {
        console.log(err);
    }

    res.send(result);
});

router.get("/count/column1/:column1", async (req, res) => {
    const receive = {
        column1: req.params.column1
    }
    const result = {
        success: false,
        data: null
    }

    const sql = "SELECT * FROM sample.first WHERE column1=$1;";
    const values = [receive.column1];

    try {
        const temp = await request(sql, values);
        result.data = temp.length;
        result.success = true;
    }
    catch(err) {
        console.log(err);
    }

    res.send(result);
});

router.get("/count/column2/:column2", async (req, res) => {
    const receive = {
        column2: req.params.column2
    }
    const result = {
        success: false,
        data: null
    }

    const sql = "SELECT * FROM sample.first WHERE column2=$1";
    const values = [receive.column2];

    try {
        const temp = await request(sql, values);
        result.data = temp.length;
        result.success = true;
    }
    catch(err) {
        console.log(err);
    }

    res.send(result);
});

router.post("", async (req, res) => {
    const receive = {
        column1: req.body.column1,
        column2: req.body.column2
    }
    const result = {
        success: false,
        data: null
    }

    const sql = "INSERT INTO sample.first VALUES ($1, $2);";
    const values = [receive.column1, receive.column2];

    try {
        const temp = await request(sql, values);
        result.data = temp.rowCount; // 삽입된 행의 수.
        result.success = true;
    }
    catch(err) {
        console.log(err);
    }

    res.send(result);
});

router.put("", async (req, res) => {
    const receive = {
        column1: req.body.column1,
        column2: req.body.column2,
        newCol1: req.body.newCol1,
        newCol2: req.body.newCol2
    }
    const result = {
        success: false,
        data: null
    }
    
    const values = [];
    let newValue = "";

    // if (!receive.newCol1 && !receive.newCol2) {
    //     // error
    // }
    // else {
    //     for (let index = 0; index < 2; index++) {

    //     }
    // }

    if (!receive.newCol1 && !receive.newCol2) {
        // error
    }
    else if (receive.newCol1 && receive.newCol2) {
        values.push(receive.newCol1);
        newValue += "column1=$1, column2=$2";
    }
    else if (receive.newCol1) {
        values.push(receive.newCol1);
        newValue += "column1=$1";
    }
    else if (receive.newCol2) {
        values.push(receive.newCol2);
        newValue += "column2=$1";
    }
    else {
        // error
    }

    let condition = "";
    if (!receive.column1 && !receive.column2) {
        // error
    }
    else if (receive.column1 && receive.column2) {
        values.push(receive.column1);
        newValue += "column1=$" + values.length;
        values.push(receive.column2);
        newValue += " and column2=$" + values.length;
    }
    else if (receive.column1) {
        values.push(receive.column1);
        condition += "column1=$" + values.length;
    }
    else if (receive.column2) {
        values.push(receive.column2);
        condition += "column2=$" + values.length;
    }
    else {
        // error
    }

    const sql = "UPDATE sample.first SET " + newValue + " WHERE " + condition + ";";

    try {
        result.data = await request(sql, values);
        result.success = true;
    }
    catch(err) {
        console.log(err);
    }

    res.send(result);
});

router.delete("", async (req, res) => {
    const receive = {
        column1: req.body.column1,
        column2: req.body.column2
    }
    const result = {
        success: false,
        data: null
    }

    const values = [];
    let sql = "DELETE FROM sample.first";

    if (!receive.column1 && !receive.column2) {
        sql += ";";
    }
    else if (receive.column1 && receive.column2) {
        values.push(receive.column1, receive.column2);
        sql += " WHERE column1=$1 and column2=$2;";
    }
    else if (receive.column1) {
        values.push(receive.column1);
        sql += " WHERE column1=$1;";
    }
    else if (receive.column2) {
        values.push(receive.column2);
        sql += " WHERE column2=$1;";
    }
    else {
        // error
    }

    try {
        result.data = await request(sql, values);
        result.success = true;
    }
    catch(err) {
        console.log(err);
    }

    res.send(result);
});

module.exports = router;
