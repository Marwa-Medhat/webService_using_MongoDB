const mongo = require('mongodb').MongoClient;


mongo.connect('mongodb://localhost:27017/',async function(connectErr, client) {
    
    const db = client.db('test1');

    /*
    db.collection("posts").find().toArray((err,data)=>{
        
        for(let i =0;i<data.length;i++){
            
            data[i].id=i;
            delete data[i].comments;
            db.collection("posts").updateOne({_id:data[i]._id},{$set:data[i]});
            
        }
    })
    */

    
    db.collection("posts").aggregate([
        {
            '$group': {
                '_id': '$createdBy', 
                'likesCount': {
                    '$avg': '$likes'
                }
            }
        }, {
            '$sort': {
                'likesCount': -1
            }
        }, {
            '$limit': 2
        }
    ]).toArray(function(err,data){
          console.log(data)
      })

    
    client.close();
});