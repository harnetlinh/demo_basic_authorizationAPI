const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/demodb';

const options = {
    useNewUrlParser: true,
    useFindAndModify: false
}

mongoose.connect(mongoURI,options)
    .then(
        ()=> {console.log("Database connection is established")},
        err => {console.log("Database connection has error")}
    )

const userModel = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('users',userModel);