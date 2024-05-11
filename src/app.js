const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const authentication = require('./middleware');
require('dotenv').config()
require('./mongo')
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const secret="209513c1e17a8318c25987557f00f149d133ae0ad6a607db953400c861fc4907";
const LogInCollection = require("./mongo")
const suggestion = require("./suggestion")
const cookieParser=require('cookie-parser');
const path = require("path")
const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')


const app = express()
app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
app.use(express.static(publicPath))

app.get('/', (req, res) => {
    res.render('login')
});
app.get('/signup', (req, res) => {
    res.render('signup')
});

app.get('/home', authentication, (req, res) => {
    const token = req.cookies.token;
    const decode = jwt.verify(token, secret);
    const name = decode.name;
    res.render('home', { naming: name });
});



app.post('/signup', async (req, res) => {

    try {

            const data = {
                name: req.body.name,
                password: req.body.password
            }

            const checking = await LogInCollection.findOne({ name: req.body.name })

            if (checking) 
            {
                res.send(`
                <script>
                    alert("Given Username already exist.Please enter a different username.");
                    setTimeout(function() {
                        window.location.href = "/signup";
                    }, );
                </script>
            `);
            }
            else{
            const encpswd = await bcrypt.hash(req.body.password, 10);

            const user = await LogInCollection.create({
                name: req.body.name,
                password:encpswd
            })

            const token = jwt.sign({id:user._id,name: req.body.name},secret);
            user.token=token;
            user.password=undefined;

            res.status(201).send(`
                    <script>
                        alert("Successfully Signed up !!! Now please Log In");
                        setTimeout(function() {
                            window.location.href = "/"; 
                        }, );
                    </script>
                `);
        }

        }

     catch (error) 
     {
       return res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name })
        if(check&&(await bcrypt.compare(req.body.password,check.password)))
        {
            const name=req.body.name
            
            const t= jwt.sign({id:check._id,name: req.body.name},secret);
            check.token=t;
            check.password=undefined;
            const options= {
                expires: new Date(Date.now()+24*60*60*1000),
                httpOnly:true
            };
            res.status(200).cookie("token",t,name,options).send(`
            <script>
                alert("Successfully loged in!!");
                setTimeout(function() {
                    window.location.href = "/home"; 
                }, );
            </script>
        `);
        }
        else
        {
            res.send(`
            <script>
                alert("Provided Username or Password is incorrect !! ");
                setTimeout(function() {
                    window.location.href = "/";
                }, );
            </script>
        `);
        }
        
    } catch (error) {
        console.log(error);
        res.send(`
            <script>
                alert("Provided Username doesnot exist !! ");
                setTimeout(function() {
                    window.location.href = "/";
                }, );
            </script>
        `);
    }
})

app.post('/logout', (req, res) => {

    res.clearCookie('token');
    res.send(`
            <script>
                alert("Log out successfull !! ");
                setTimeout(function() {
                    window.location.href = "/";
                }, );
            </script>
        `);
});

app.post('/form',async (req,res) => {
    
    const data = {
        email:             req.body.email,
        city:              req.body.city,
        place:             req.body.place,
        placedescription:  req.body.placedescription,
        placeurl:          req.body.placeurl,
        fest:              req.body.fest,
        festdescription:   req.body.festdescription,
        festurl:           req.body.festurl
    }

    const place = await suggestion.findOne({ city: req.body.city , place: req.body.place })
    const fest = await suggestion.findOne({ city: req.body.city , fest: req.body.fest })

    if(place)
    {
        res.send(`
                <script>
                    alert("Given Place already exist.Please enter a different Place.");
                    setTimeout(function() {
                        window.location.href = "form.html";
                    }, );
                </script>
            `);
    }
    else
    if(fest)
    {
        res.send(`
                <script>
                    alert("Given Festival already exist.Please enter a different Festival.");
                    setTimeout(function() {
                        window.location.href = "form.html";
                    }, );
                </script>
            `);
    }
    else{
        const token = req.cookies.token;
        const decode = jwt.verify(token, secret);
        const naming = decode.name;

        const data = await suggestion.create({
        username:          decode.name,
        email:             req.body.email,
        city:              req.body.city,
        place:             req.body.place,
        placedescription:  req.body.placedescription,
        placeurl:          req.body.placeurl,
        fest:              req.body.fest,
        festdescription:   req.body.festdescription,
        festurl:           req.body.festurl
        })

        res.status(201).send(`
                <script>
                    alert("Your Suggestions are send to admin. We will add your suggestions in few days ");
                    setTimeout(function() {
                        window.location.href = "/home"; 
                    }, );
                </script>
        `);
    }


})

module.exports = app