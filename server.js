let projectData={}; //let not const because u are going to add data to it
//connect express as middleware
const express=require('express'); 
//initiate an app
const app= express();  
/*body parsing middleware,responsible for parsing the incoming request bodies in a middleware before you handle it.
parse json files coming from client side */
const bodyParser= require('body-parser');
//app.use() means use middlewares u required to work between request and response
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:false}))/* used especially when making a form, return info in form of objects we can use ,with no complicated data thats why extended:false ,only return json data , not objects within objects*/
app.use(express.static('website'))//express.static tells nodejs which files u want to run ur app (website u want), the one that has the html , css etc..
//cors= cross-origin allowance
const cors= require('cors')
/*usage of cors: suppose u have an image in html source is within the file he will request it from the local server (within the app), but if u put the source of the img a link it will get it from an external source(cross-origin request) therefore u need allowance and credentials for that*/
//if u work within local host cors is embedded in html tags but if u work on a server u need cors
app.use(cors());
//recieve the data posted from the client side
app.post('/add',(req,res)=>{ //takes route and asyc function 
    //async function because u  have to wait for the fetch to happen
    const body=req.body; //wait for the request ,return request as promise, access promise body
    projectData=body;
    res.status(200).send(projectData); //send back the data to fulfill the post request 
    //status=200 means data is correct/success, if its 400 or sth then theres an error
})

app.get("/all",(req, res) => { //asking route when u have http request ,send these info
    if(projectData){
        res.send(projectData);
    }
});
/*listening for the server through the express.listen and which gives us confirmation that the server is working properly*/
const port = 5500;
app.listen(port, ()=> console.log(`listening on port ${port}`));