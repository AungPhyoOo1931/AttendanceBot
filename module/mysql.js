/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // 推荐用 DB_HOST 等命名
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

class DatabaseTransaction {
  constructor() {
    this.connection = null;
    this.transactionActive = false;
  }

  async beginTransaction() {
    this.connection = await pool.getConnection();
    await this.connection.beginTransaction();
    this.transactionActive = true;
    console.log('事务已开始');
  }
 
  async commitTransaction() {
    if (!this.transactionActive || !this.connection) {
      throw new Error('没有活跃的事务');
    }
    await this.connection.commit();
    this.connection.release();
    this.connection = null;
    this.transactionActive = false;
    console.log('事务提交成功');
  }

  async rollbackTransaction() {
    if (!this.transactionActive || !this.connection) {
      console.log('没有活跃的事务，无法回滚');
      return;
    }
    await this.connection.rollback();
    this.connection.release();
    this.connection = null;
    this.transactionActive = false;
    console.log('事务已回滚');
  }

  /**
   * 执行查询
   * @param {string} query SQL 语句
   * @param {Array} params 参数数组
   * @param {boolean} useTransaction 是否在事务内执行
   * @returns {Promise<any>} 查询结果
   */
  async executeQuery(query, params = [], useTransaction = false) {
    try {
      if (useTransaction) {
        if (!this.transactionActive || !this.connection) {
          throw new Error('事务未开启，无法使用事务执行');
        }
        const [results] = await this.connection.query(query, params);
        // console.log('查询成功（事务）:', results);
        return results;
      } else {
        const [results] = await pool.query(query, params);
        // console.log('查询成功（普通）:', results);
        return results;
      }
    } catch (err) {
      console.error('查询失败:', err);
      if (useTransaction && this.transactionActive) {
        await this.rollbackTransaction();
      }
      throw err;
    }
  }
}

module.exports = { pool, DatabaseTransaction };
