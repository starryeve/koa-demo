

import mysql from 'mysql';
const config = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'koa',
  port: 3306,
  multipleStatements: true//允许多条sql同时执行
};
const pool = mysql.createPool(config);

const query = (sql: any, values: any | null) => {
  return new Promise((resolve: any, reject: any) => {
    pool.getConnection((err: any, connection: any) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err: any, rows: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

export default {
  query
}