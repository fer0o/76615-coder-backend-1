const UserModel = require("../../models/User.model");

class UserMongoDAO {

    async findByEmail(email){
        return UserModel.findOne({ email }).lean();
    }

    async findById(id){
        return UserModel.findById(id).lean();
    }

    async create(userData){
        const user = await UserModel.create(userData);
        return user.toObject();
    }
    async findByIdWithoutPassword(id){
        return UserModel.findById(id).select("-password").lean();
    }

}

module.exports = new UserMongoDAO();