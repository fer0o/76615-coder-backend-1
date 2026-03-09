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

    //reset Token
    async setResetToken(userId, token, expiresAt){
        return UserModel.findByIdAndUpdate(
            userId,
            {
                $set:{
                    resetPasswordToken:token,
                    resetPasswordExpires:expiresAt
                },
            },
            {new:true}
        ).lean();
    }
    //reset Token
    async findByResetToken (token){
        return UserModel.findOne({
            resetPasswordToken:token,
            resetPasswordExpires:{$gt:new Date()}
        }).lean();
    }

    async updatePasswordAndClearReset(userId, newHashedPassword){
        return UserModel.findByIdAndUpdate(
            userId,
            {
                $set:{ password: newHashedPassword},
                $unset:{
                    resetPasswordToken:"",
                    resetPasswordExpires:""
                },
            },
            {new:true}
        ).lean();
    }


}

module.exports = new UserMongoDAO();