class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  findByEmail(email) {
    return this.dao.findByEmail(email);
  }

  findById(id) {
    return this.dao.findById(id);
  }

  create(userData) {
    return this.dao.create(userData);
  }

  findByIdWithoutPassword(id) {
    return this.dao.findByIdWithoutPassword(id);
  }

  setResetToken(userId, token, expiresAt) {
    return this.dao.setResetToken(userId, token, expiresAt);
  }

  findByResetToken(token) {
    return this.dao.findByResetToken(token);
  }

  updatePasswordAndClearReset(userId, newHashedPassword) {
    return this.dao.updatePasswordAndClearReset(userId, newHashedPassword);
  }
}

module.exports = UserRepository;
