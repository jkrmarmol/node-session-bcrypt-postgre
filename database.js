const Pool = require('pg').Pool;
const { passwordHash } = require('./auth/bcrypt');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgre_node',
  password: 'postgres',
  port: 5432
});

const findUsername = async (username) => {
  try {
    const response = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    return response.rows.length === 0 ? 'user not found' : response.rows[0].username;
  } catch (err) {
    console.log(err)
  }
}

const findPasswordByUsername = async (username) => {
  try {
    const response = await pool.query('SELECT password FROM users WHERE username = $1', [username])
    return response.rows[0].password;
  } catch (err) {
    console.log(err)
  }
}

const getIDByUsernamePassword = async (username, password) => {
  try {
    const response = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    return response.rows[0].id;
  } catch (err) {
    console.log(err)
  }
}

const getInfoByID = async (id) => {
  try {
    const response = await pool.query(`
      SELECT user_infos.name AS user_name, user_infos.age AS user_age 
      FROM users INNER JOIN user_infos 
        ON users.id = user_infos.id 
      WHERE users.id = $1;`, [id]
    );
    return response.rows;
  } catch (err) {
    console.log(err);
  }
}

const registerUser = async (id, username, password) => {
  try {
    const response = await pool.query('INSERT INTO users VALUES ($1, $2, $3)', [id, username, await passwordHash(password)])
    if (response) {
      return 'Registered Successfully'
    }
  } catch (err) {
    console.log(err)
  }
}

const updatePasswordById = async (password, id) => {
  try {
    const response = await pool.query('UPDATE users SET password = $1 WHERE id = $2', [await passwordHash(password), id])
    return {message: 'updated successfully'}
  } catch (err) {
    console.log(err)
  }
}

const deleteUserByID = async (id) => {
  try {
    const response = await pool.query('DELETE FROM user_infos WHERE id = $1', [id])
    return 'Deleted Successfully'
  } catch (err) {
    console.log(err)
  }
}


module.exports = {
  findUsername,
  findPasswordByUsername,
  getIDByUsernamePassword,
  getInfoByID,
  getInfoByID,
  registerUser,
  updatePasswordById,
  deleteUserByID
}