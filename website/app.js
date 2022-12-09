/* Global Variables */
const button= document.getElementById('generate');
const date =document.getElementById('date');
const temperature=document.getElementById('temp');
const content=document.getElementById('content');
const entryHolder=document.getElementById('entryHolder');
const img=document.querySelector('img');

const zip=document.getElementById('zip');
const feelings=document.getElementById('feelings');

const baseURL= 'https://api.openweathermap.org/data/2.5/weather?zip=' //url ur going to add to any fetch u make
const apiKey = '&appid=d6fc266f16cfefc30289c92ad2314d94&units=imperial';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear(); //increment month by 1  as it is zero indexed
async function getData(madeURL){
    //FETCH TO GET
    const result= await fetch(madeURL); 
    /*fetch is a promise ,wait for it to get resolved, the response is another promise therefore wait for another promise */
    if(result.status!=200)
    return result;
    try{
        const resultData=await result.json();//parse data into an object
        //the following if condition is used to catch errors from resultdata promise
        return resultData;//must return else the promise would be pending
    }
    catch(error){//catches error of fetch url only
        console.log(error); 
    }
};

async function filterData(data){
    //new object (info) to extract only some data from the api 
    try{
        /*the returned data is either actual data or empty string , therefore if the message doesnt have an empty string , filter the actual data*/
        if(data.cod!=200){ 
            return data.message;
        }
        else{
            const info={
                date: newDate,
                feelings:feelings.value,
                temperature:data.main.temp
            }
        return info;
        }
    }
catch(error){
    console.log(error);
    }
}
//post from client side and recieve that post in server side file
async function postData(url='',data={}){ //given default parameters in case nothing is entered
    //FETCH TO POST
    //wait for the result coming from the fetch
    const response = await fetch(url,{
        method:'POST',
        credentials:"same-origin",//posting data coming from the same origin not from external origin
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data), //used to change the data u want to post/send to json object 
    })
try{
    const result = await response.json();
    return result;
}
catch(error){
    console.log(error);
}
};

async function retrieveData(url=''){
    const data=await fetch(url);
    try{
        const response=await data.json();
        return response;
    }
    catch(error){
        console.log(error);
    }
}

async function updateUI(data){
    //no need to do const response =await data.json() 
    //no need to parse it into json because the data is coming FROM the server NOT going INTO the server
    //going ->therefore parse , coming->therefor no need to parse
    const response= await data;
    //if(response.date){
        entryHolder.style.display='block'
        //error.style.display='none';
        date.innerHTML=`Date :${response.date}`;
        temp.innerHTML=`Temperature in C°: ${response.temperature}`;
        if(response.feelings)
        content.innerHTML=response.feelings;
        else
        content.innerHTML='what do you feel?';
    //    }
    /*else{
        entryHolder.style.display='none'
        error.style.display='block';
        error.innerHTML='Please check the entered zip code.';
    }*/
}

button.addEventListener('click',(event)=>{
    event.preventDefault(); 
    if (!zip.value) {
        alert('Please enter a zip code.')
    }
    else{
    const madeURL= baseURL+zip.value+apiKey;
    getData(madeURL)/*since its an async function, therefore its a promise, u can chain it with another promise using .then*/
    .then((data)=>{
        if(data.status==404)
        alert('Zip code not found , please enter a valid zip code')
        else{
        filterData(data) //get 1 piece of info (the info u want), returns a promise
        .then((info)=>{
                postData('/add',info)//update the endpoint (projectData object in server.js), put the info in the object in a place where the user doesnt see
                //takes the last resolved promise
                    .then((data)=>{
                        retrieveData('/all')/*GET FUNCTION ,after posting data to server, get it again from the server,retrieve it from localhost:5500/add and update the ui using it,(retrieve the info from the hidden place and redirect the user to another place to show the info in another form) (retrieve data from another server)*/
                        .then((data)=>{
                            updateUI(data);
                        }); 
                    })
            })
    }});
}
});
