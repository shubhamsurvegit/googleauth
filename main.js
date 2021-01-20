const express=require('express')
const passport=require('passport')
const cookieSession=require('cookie-session');
require('./passport-setup')
require('dotenv').config();

const app=express();
app.set('view engine','ejs');

app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

app.use(passport.initialize())
app.use(passport.session())

const islogin=(req,res,next)=>{
    if(req.user){
        next();
    }
    else{
        res.send('Error')
    }
}
app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/google',passport.authenticate('google',{scope:['profile','email'] }));

app.get('/google/callback',passport.authenticate('google',{failureRedirect:'/failure'}),
    function(req,res){
        res.redirect('/success')
    }
)

app.get('/success',islogin,(req,res)=>{
    res.render('profile',{user:req.user})
})

app.get('failure',(req,res)=>{
    res.send('error')
})

app.get('/logout',(req,res)=>{
    req.session=null;
    req.logout();
    res.redirect('/')
})
 
app.listen(5000,()=>console.log("Server Running"))