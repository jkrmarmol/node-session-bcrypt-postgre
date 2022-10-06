const bcrypt = require('bcrypt');

const passwordHash = async (password, saltRounds) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.log(err)
  }
  
}

const compareHash = async (password, hash) => {
  try {
    const hashMatched = await bcrypt.compare(password, hash);
    return hashMatched;
  } catch (err) {
    console.log(err)
  }
  
}

module.exports = {
  passwordHash,
  compareHash
}