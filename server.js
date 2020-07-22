
const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;

const cors = require('cors');

// Import express-form-data (for files)
const expressFormData = require('express-form-data');

// Import Cloudinary for NodeJS
const cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

const secret = "s3cr3t100";

const UsersModel = require('./models/UsersModel');

const passportJwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

const passportJwt = (passport) => {
    passport.use(
        new JwtStrategy(
            passportJwtOptions, 
            (jwtPayload, done) => {
                    // console.log("jwtPayload", jwtPayload);
                // Extract and find the user by their id (contained jwt)
                UsersModel.findOne({ _id: jwtPayload.id })
                .then(
                    // If the document was found
                     (document) => { 
                        return done(null, document);
                    }
                )
                .catch(
                    // If something went wrong with database search
                    (err) => {
                        return done(null, null);
                    }
                )
            }
        )
    )
};

// Import routes 
const UsersRoutes = require('./routes/Users');
const EventsRoutes = require('./routes/Events');
const ProductsRoutes = require('./routes/Products');

const server = express();

passportJwt(passport);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
// server.use(express.session({ secret: "s3cr3t100" }));
server.use(passport.initialize());
// server.use(passport.session());

server.use(cors());
server.use(expressFormData.parse());

// Invoke passportJwt and pass the passport npm package as argument


const dbURL = "mongodb+srv://Kamanda:Kamanda123@cluster0-awbix.mongodb.net/Kamanda?retryWrites=true&w=majority";

mongoose.connect(
    dbURL,
    {
        'useNewUrlParser': true,
        'useUnifiedTopology': true
    }
).then(
    ()=>{
        console.log('You are connected MongoDB');
    }
).catch(
    (e)=>{
        console.log('catch', e);
    }
);

server.use(
    '/users',
     passport.authenticate('jwt', {session:false}),
    UsersRoutes
);

server.use(
    '/events',
    EventsRoutes
);

server.use(
    '/GearBoutique',
    ProductsRoutes
);

server.get('*', (req, res)=> {
    res.send('404! Page not found :(')
});


server.listen( 
    8080, ()=>{
        console.log('You are connected http://127.0.0.1:8080!');
    }
);

