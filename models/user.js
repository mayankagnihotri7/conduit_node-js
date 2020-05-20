let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');

let userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String, 
        unique: true, 
        required:true
    },
    password: {
        type: String,
        required: true
    },
    bio: String,
    image: String,
    following: [String]
}, {timestamps: true});

// Hashing the password.
userSchema.pre('save', async function (next) {
    try {
     if (this.password && this.isModified("password")) {
       this.password = await bcrypt.hash(this.password, 10);
       return next();
     }
     else {
         next()
    };   
    } catch (error) {
        next(error);
    }
});

// Verifying the password.
userSchema.methods.verify = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Creating user model.
module.exports = mongoose.model('User', userSchema);
