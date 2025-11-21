const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

class URLModel {
  static async initTable() {
    // Create the table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_code VARCHAR(20) UNIQUE NOT NULL,
        click_count INTEGER DEFAULT 0,
        last_clicked TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);

    // Add last_clicked column if it doesn't exist (for existing tables)
    const addColumnQuery = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'urls' AND column_name = 'last_clicked'
        ) THEN
          ALTER TABLE urls ADD COLUMN last_clicked TIMESTAMP;
        END IF;
      END $$;
    `;
    await pool.query(addColumnQuery);
  }

  static async create(originalUrl, shortCode) {
    const query = `
      INSERT INTO urls (original_url, short_code)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(query, [originalUrl, shortCode]);
    return result.rows[0];
  }

  static async findByShortCode(shortCode) {
    const query = 'SELECT * FROM urls WHERE short_code = $1';
    const result = await pool.query(query, [shortCode]);
    return result.rows[0];
  }

  static async findAll(search = '') {
    let query = 'SELECT * FROM urls ORDER BY created_at DESC';
    let params = [];
    
    if (search) {
      query = 'SELECT * FROM urls WHERE original_url ILIKE $1 OR short_code ILIKE $1 ORDER BY created_at DESC';
      params = [`%${search}%`];
    }
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async exists(shortCode) {
    const query = 'SELECT 1 FROM urls WHERE short_code = $1';
    const result = await pool.query(query, [shortCode]);
    return result.rows.length > 0;
  }

  static async incrementClicks(shortCode) {
    const query = 'UPDATE urls SET click_count = click_count + 1, last_clicked = CURRENT_TIMESTAMP WHERE short_code = $1';
    await pool.query(query, [shortCode]);
  }

  static async deleteByShortCode(shortCode) {
    const query = 'DELETE FROM urls WHERE short_code = $1 RETURNING *';
    const result = await pool.query(query, [shortCode]);
    return result.rows.length > 0;
  }
}

module.exports = URLModel;