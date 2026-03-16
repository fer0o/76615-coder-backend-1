class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(userData, options = {}) {
    return this.dao.create(userData, options);
  }

  getAll(filter = {}, options = {}) {
    return this.dao.getAll(filter, options);
  }

  getOne(filterOrId, options = {}) {
    return this.dao.getOne(filterOrId, options);
  }

  update(filterOrId, updateFields, options = {}) {
    return this.dao.update(filterOrId, updateFields, options);
  }

  delete(filterOrId, options = {}) {
    return this.dao.delete(filterOrId, options);
  }

  findById(id, options = {}) {
    return this.dao.getOne(id, options);
  }

  findByEmail(email, options = {}) {
    return this.dao.getOne({ email }, options);
  }

  findByIdWithoutPassword(id, options = {}) {
    return this.dao.getOne(id, { ...options, select: "-password" });
  }

  setResetToken(userId, token, expiresAt, options = {}) {
    return this.dao.update(
      userId,
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: expiresAt,
        },
      },
      options,
    );
  }

  findByResetToken(token, options = {}) {
    return this.dao.getOne(
      {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      },
      options,
    );
  }

  updatePasswordAndClearReset(userId, newHashedPassword, options = {}) {
    return this.dao.update(
      userId,
      {
        $set: { password: newHashedPassword },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: "",
        },
      },
      options,
    );
  }
}

module.exports = UserRepository;
