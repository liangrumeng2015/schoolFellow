/**

 * http://mongodb.github.io/node-mongodb-native

 * http://mongodb.github.io/node-mongodb-native/3.0/api/
 */

//DB¿â
var MongoDB=require('mongodb');
var MongoClient =MongoDB.MongoClient;
const ObjectID = MongoDB.ObjectID;

var Config=require('./config.js');

class Db{

    static getInstance(){   /*1¡¢µ¥Àý  ¶à´ÎÊµÀý»¯ÊµÀý²»¹²ÏíµÄÎÊÌâ*/

        if(!Db.instance){
            Db.instance=new Db();
        }
        return  Db.instance;
    }

    constructor(){

        this.dbClient=''; /*ÊôÐÔ ·Ådb¶ÔÏó*/
        this.connect();   /*ÊµÀý»¯µÄÊ±ºò¾ÍÁ¬½ÓÊý¾Ý¿â*/

    }

    connect(){  /*mongoDB数据库的连接*/
      let _that=this;
      return new Promise((resolve,reject)=>{
          if(!_that.dbClient){
              MongoClient.connect(Config.dbUrl,(err,client)=>{

                  if(err){
                      reject(err)

                  }else{

                      _that.dbClient=client.db(Config.dbName);
                      resolve(_that.dbClient)
                  }
              })

          }else{
              resolve(_that.dbClient);

          }


      })

    }

    find(collectionName,json1,json2,json3,json4){
          //js中实参、形参个数可以不一样
        if(arguments.length == 2){
            var attr = {};
            var slipNum = 0;
            var pageSize = 0;
        } else if(arguments.length == 3){
            var attr = json2;
            var slipNum = 0;
            var pageSize = 0;

        } else if(arguments.length == 4){
            var attr = json2;
            var page = json3.page || 1;
            var pageSize = json3.pageSize || 20;
            var slipNum = (page-1)*pageSize;
            
        } else{
            console.log('传入参数错误');
        }

       return new Promise((resolve,reject)=>{

            this.connect().then((db)=>{

                var result=db.collection(collectionName).find(json1,{fields:attr,}).skip(slipNum).limit(pageSize);

                result.toArray(function(err,docs){

                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })

            })
        })
    }
    update(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{

                this.connect().then((db)=>{

                    //db.user.update({},{$set:{}})
                    db.collection(collectionName).updateOne(json1,{
                        $set:json2
                    },(err,result)=>{
                        if(err){
                            reject(err);
                        }else{
                            resolve(result);
                        }
                    })

                })

        })

    }
    insert(collectionName,json){
        return new  Promise((resolve,reject)=>{
            this.connect().then((db)=>{

                db.collection(collectionName).insertOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{

                        resolve(result);
                    }
                })


            })
        })
    }

    remove(collectionName,json){

        return new  Promise((resolve,reject)=>{
            this.connect().then((db)=>{

                db.collection(collectionName).removeOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{

                        resolve(result);
                    }
                })


            })
        })
    }
    getObjectId(id){    /*mongoDB 获取id值*/

        return new ObjectID(id);
    }
    count(collectionName,json){      // 统计总数量
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                var result = db.collection(collectionName).count(json);
                result.then(function(count){
                    resolve(count);
                })
            })
        })
    }
}


module.exports=Db.getInstance();
