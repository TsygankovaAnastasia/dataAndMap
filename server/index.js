
import express from 'express'
import path from 'path'
import userRoutes from './routes/user.js'
import session from 'express-session'

const app = express();

const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'server/ejs'))

app.use(express.static(path.resolve(__dirname, 'client')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(userRoutes);


/*
app.use(function (req, res, next) {
//    req.session.accessToken = req.session.accessToken || 0;
    next()
})
*/

const redirectLogin = (req, res, next) =>{
    if (!req.session.accessToken){
        res.redirect('/')
    }else
        next()
}

const redirectHome = (req, res, next) =>{
    console.log('in redirectHome', req.session.accessToken);
    if (req.session.accessToken){
        res.redirect('/home')
    }else
        next()
}

app.get('/', redirectHome, function (req, res, ){
    res.render('auth', {title: 'Auth Page', active: 'auth'})

})

app.get('/home',  /*redirectLogin,*/ (req, res) => {
    res.render('home', {title: 'Home', active: 'auth', login:req.session.userLogin})
})


app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`));


