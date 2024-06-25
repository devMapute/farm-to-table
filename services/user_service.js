import User from "../models/user";

const addUser = async (userData) => {
    return await User.create(userData);
};

const getUser = async (userId) => {
    return await User.findById(userId);
};

const getAllUser = async () => {
    return await User.find();
};

const editUser = async (req) => {
    return await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
};

const removeUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

module.exports = {
    addUser,
    getUser,
    getAllUser,
    editUser,
    removeUser,
}