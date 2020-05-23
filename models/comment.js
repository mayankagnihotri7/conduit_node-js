let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema ({
    title: {
        type: String
    },
    body: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);