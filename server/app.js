const express = require('express');

const app=express();
app.use(express.json());

var cors = require('cors');
app.use(cors());

// words cards url : /words
var wordsRouter=require('./routes/words');
app.use('/words',wordsRouter);

// image cards url : /image
var imageRouter=require('./routes/image');
app.use('/image',imageRouter);

// get image from this url
app.use('/uploadedImage', express.static('uploads'));

const port = 8080;

app.listen(port, () => console.log(`listening on port ${port}!`));