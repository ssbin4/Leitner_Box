/*server for routing image cards, 
similar to words.js
*/


var express = require('express');
var router = express.Router();
const mysql=require('mysql');
const bodyParser=require('body-parser');
const multer=require('multer'); //include multer 

var db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"poapper_backend"
});

const app=express();
app.use(express.json());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//use multer to get image from front-end
const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"uploads/");
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname);
    }
});
const uploader=multer({storage:storage});

//post method
router.post('/',uploader.single('image'),(req,res,next)=>{
    var path=req.file.path.slice(7); //discard the front 7 characters('uploads')
    //store only the path of the file and the meaning to the database
    db.query(`INSERT INTO image (path,meaning) VALUES ('${path}','${req.body.meaning}')`,(err,results)=>{
        if(err) throw err;
    });
    res.send({msg: "도착"});
})

//get method : same as words.js
router.get('/',(req,res)=>{
    db.query(`SELECT level,COUNT(1) as count FROM image GROUP BY level;`,(err,data)=>{
        if(err) throw err;
        var count=[];
        for(var i=0;i<5;i++){
            count[i]=0;
        }
        for(var i=0;i<data.length;i++){
            count[data[i].level-1]=data[i].count;
        }
        res.json(count);
    })
})

router.get('/:id',(req,res)=>{
    db.query(`SELECT * FROM image WHERE level='${req.params.id}'`,(err,data)=>{
        if(err) throw err;
        res.json(data);
    })
})

//put method: same as words.js
router.put('/update',(req,res)=>{
    const body=req.body;
    if(body.success=='success'){
        if(body.level==5){
            db.query(`DELETE FROM image WHERE id=${body.id}`,(err,results)=>{
                if(err)throw(err);
            })
        }
        else{
            db.query(`UPDATE image SET level=${body.level+1} WHERE id=${body.id}`, (err, data) => {
                if(err) throw err;
              });
        }
    }
    else if(body.success=='fail'){
        db.query(`UPDATE image SET level=1 WHERE id=${body.id}`, (err, data) => {
            if(err) throw err;
          });
    }
    res.end();
})

module.exports = router;