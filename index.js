const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const User = require('./user');
const { secretOrKey } = require('./key');

const app = require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.post('/register',(req, res)=>{
    const newUser = new User({
        username: req.body.username.toString(),
        password: req.body.password.toString()
    });

    newUser.save()
        .then(success => res.status(200).send("Successful"))
        .catch(error => res.status(400).send("Failed to create new user"));
})
// app.get('/getuser',(req, res)=>{
//     User.findOne({username:'linh'})
//         .then(success =>{
//             res.send("YES")
//         })
//         .catch(error => {
//             res.send("NO")
//         });
// });
app.post('/login',(req, res)=>{
    User.findOne({username: req.body.username, password: req.body.password})
        .then(user => {
            if(!user){
                return res.status(404).send("Not found user")
            }

            const token = jwt.sign({userId: user.id}, secretOrKey);
            res.status(200).json({
                userId: user.id,
                token: token
            })
        })
        .catch(err => res.status(400).send("Login fail"))
}) 

//middleware
const checkToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        
        jwt.verify(token, secretOrKey, (err, payload) => {
            if(payload){
                req.user = payload;
                next();
            }else{
                res.status(401).send('Unauthorized checkToken')
            }
        })
    }catch(err){
        res.status(401).send('No token provided');
    }
}

const protectedRoute = (req, res, next) => {
    if(req.user){
        return next();
    }
    res.status(401).send('Unauthorized protectedRoute');
}

app.get(
    '/protectedRoute'
    , checkToken
    , protectedRoute
    , (req,res) => {
        res.status(200).send(req.user);
    }
)

app.listen(3000, ()=>{console.log("Server is running")});