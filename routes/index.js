var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')

var userModel = require('../models/users')


router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var salt = uid2(32)
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: SHA256(req.body.passwordFromFront+salt).toString(encBase64),
      token: uid2(32),
      salt: salt,
      // wishlist: []
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    }) 
  
    
    if(user){
      const passwordEncrypt = SHA256(req.body.passwordFromFront + user.salt).toString(encBase64)

      if(passwordEncrypt == user.password){
        result = true
        token = user.token
        res.json({result, user, error, token})

      } else {
        result = false
        error.push('mot de passe incorrect')
        res.json({result, user, error, token})
      }
      
    } else {
      error.push('email incorrect')
      res.json({result, user, error, token})
    }}
  })
  
  router.post('/wishlist', async function(req, res, next) {

    console.log('routewishlist')
    
    const userFind = await userModel.findOne({

      token: req.body.tokenFromFront

    })

    if(userFind){
      userFind.wishlist.push({

      title:req.body.titleFromFront,
      description:req.body.descriptionFromFront,
      content:req.body.contentFromFront,
      urlToImage:req.body.urlFromFront

      })
     const userFindSave= await userFind.save() 

    }
    
  
    var result = false
    if(userFind){
      result = true
      console.log(userFind.wishlist);
    }
  
    res.json({result,userFind})
  });

  router.post('/wishlistdelete', async function(req, res, next) {

    const userFind = await userModel.findOne({

      token: req.body.tokenFromFront

    })
    let check =false;
    console.log('fonction delete from back')
    console.log(req.body)
   if(userFind){
     for (var i=0; i<userFind.wishlist.length; i++)
     {
         if(userFind.wishlist[i].title==req.body.titleFromFront)
         {userFind.wishlist.splice(i,1); check=true}
     }
   }

   const userFindSave= await userFind.save() 
   console.log(check);
    res.json({check})
  });

module.exports = router;
