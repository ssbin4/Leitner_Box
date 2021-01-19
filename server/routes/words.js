// include libraries
var express = require('express');
var router = express.Router();
const mysql=require('mysql');
const bodyParser=require('body-parser');

//mysql database
var db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"poapper_backend"
});

//make express server and use bodyParser
const app=express();
app.use(express.json());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//post method
router.post('/',(req,res)=>{
    const body=req.body;
    //insert into database
    db.query(`INSERT INTO words (words,meaning) VALUES ('${body.words}','${body.meaning}')`,(err,results)=>{
        if(err) throw err;
    });
    res.send({msg: "도착"});
})

//get method
router.get('/',(req,res)=>{
    //get each size of level from mysql database
    db.query(`SELECT level,COUNT(1) as count FROM words GROUP BY level;`,(err,data)=>{
        if(err) throw err;
        var count=[]; //count array : store the number of cards in each level
        for(var i=0;i<5;i++){
            count[i]=0;
        }
        for(var i=0;i<data.length;i++){
            count[data[i].level-1]=data[i].count;
        }
        res.json(count); //throw count array to front-end
    })
})

router.get('/:id',(req,res)=>{
    db.query(`SELECT * FROM words WHERE level='${req.params.id}'`,(err,data)=>{
        if(err) throw err;
        res.json(data);
    })
})

//put method : to change the level of cards
router.put('/update',(req,res)=>{
    const body=req.body;
    //success: increase level by 1
    if(body.success=='success'){
        //if current level is 5, delete this card
        if(body.level==5){
            db.query(`DELETE FROM words WHERE id=${body.id}`,(err,results)=>{
                if(err)throw(err);
            })
        }
        //else, update the level of the card
        else{
            db.query(`UPDATE words SET level=${body.level+1} WHERE id=${body.id}`, (err, data) => {
                if(err) throw err;
              });
        }
    }
    //fail:  move the card to level 1
    else if(body.success=='fail'){
        db.query(`UPDATE words SET level=1 WHERE id=${body.id}`, (err, data) => {
            if(err) throw err;
          });
    }
    res.end();
})

module.exports = router;