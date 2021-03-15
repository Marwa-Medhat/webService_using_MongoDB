//Make webservice
const express = require('express');
const app = express();  //to make server and listen to it 
const bodyParser = require("body-parser");   //bodyparser for post
const ObjectId = require('mongodb').ObjectId;  //as Id created from monogodb is object

const bodyParserJson = bodyParser.json();


const mongo = require('mongodb').MongoClient;

//to connect on Mongodb 
mongo.connect('mongodb://localhost:27017/',async function(connectErr, client) {
    
    const db = client.db('test'); //name of database test I want to connect to it
    app.db= db;
})

//welcome Message appear
//http://localhost:8080/
//Method:Get
app.get("/",function(req,res){
    res.send({message:"welcome"})
});


//create (add post to collection (table)
//http://localhost:8080/post/add
//Method:post
/*
{
    "tiltle":"welcome",
    "createdby":"safaa",
    "likes":70

}
*/
//using call back function request and response 
//using insertOne when data insert successfully user added successfully appear
//if there is error error message appear
//we need bodyparser in post only 
app.post("/post/add",bodyParserJson,function(req,res){
    app.db.collection("posts").insertOne(req.body,function(err,result){
        if(err){
            res.send({message:err.message})
        }else{
            res.send({message:"user added successfully"})
        }
    });
    
});

//read (get post by id)
//http://localhost:8080/post/get/604f5c3e0ae9573b942e69e5
//Method:get
//using findOne method , find element by id which i write it in url 
//if user exist will get it if not notfound appear

app.get("/post/get/:id",function(req,res){
    app.db.collection("posts").findOne({_id:new ObjectId(req.params.id)},function(err,user){
        if(err){
            res.send(err);
        }else{
            if(user)
            res.send(user);
            else{
                res.send({message:"not found"})
            }
        }
    })
})

//update (post by id)
//http://localhost:8080/post/update/604f604adef22d802851394e
//Method:post
/*
{
    "title":"welcome"
}
*/
//using updateOne method , find element by id which i write it in url 
//after update user user updated will appear
app.post("/post/update/:id",bodyParserJson,function(req,res){
    app.db.collection("posts").updateOne({_id:new ObjectId(req.params.id)},{$set:req.body},function(err,user){
        if(err){
            res.send(err);
        }else{
            res.send({message:"user updated"})
        }
    })
})

//delete
//http://localhost:8080/post/delete/604f604adef22d802851394e
//Method:get
//using removeOne method , find element by id which i write it in url 
//after remove user ..user deleted will appear
app.get("/post/delete/:id",function(req,res){
    app.db.collection("posts").removeOne({_id:new ObjectId(req.params.id)},function(err,user){
        if(err){
            res.send(err);
        }else{
            
                res.send({message:"user deleted"})
            
        }
    })
})
//get page and start with 1 as 
//Method:post
//http://localhost:8080/post/all/1
app.get("/post/all/:page",function(req,res){

    let page=Number(req.params.page)-1;
    app.db.collection("posts").find({}).skip(10*page).limit(10).toArray(function(err,users){
        res.send(users);
    })
});



app.post("/post/all/:page",bodyParserJson,function(req,res){

    let page=Number(req.params.page)-1;
    app.db.collection("posts").find(req.body).skip(10*page).limit(10).toArray(function(err,users){
        res.send(users);
    })
});

app.listen(8080);


//ADD

//take id then make update