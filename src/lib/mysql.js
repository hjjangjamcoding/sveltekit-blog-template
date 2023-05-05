import mysql from 'mysql2/promise'
export const mysqlconn = await mysql.createConnection({
    host: 'jakelee.kro.kr',
    user: 'admin',
    password: 'SDkfei34530',
    database: 'blog_test'
  })