import mongoose, {Schema} from "mongoose"
import bcrypt from 'bcryptjs'
const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true
        
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
        
    },
    phone:{
        type:String,
        required:true,
        
        
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },

},{timestamps:true})

userSchema.pre("save",async function (next){
    if(!this.isModified('password')) return next()
    const salt =10
    this.password = await bcrypt.hash(this.password,salt);
})
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword,this.password)
}


const User = mongoose.model("User",userSchema)

export default User