import bcrypt from "bcryptjs";
// import mongoose, { Document } from "mongoose";
import mongoose from "mongoose";

export type UserType = {
    _id: string;
    email:string;
    password:string;
    firstName:string;
    lastName: string;
};

const userSchema = new mongoose.Schema({
    email:{type: String, required:true, unique:true},
    password:{type:String, required:true},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
})

userSchema.pre("save", async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    
});


// userSchema.pre("save", async function (this: Document & { password: string; isModified(field: string): boolean })
const User = mongoose.model<UserType>("User", userSchema)

export default User;