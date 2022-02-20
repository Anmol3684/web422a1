const express = require("express");
const cors = require("cors");
const app = express();
const HTTP_PORT = process.env.PORT || 8080

//require the restaurant.js file 
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB();

// Add support for incoming JSON entities
app.use(express.json());
// Add support for CORS
app.use(cors());


db.initialize("mongodb+srv://ninakomavn22:Qwerty123123@cluster0.l4v9v.mongodb.net/sample_restaurants?retryWrites=true&w=majority").then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
   }).catch((err)=>{
    console.log(err);
   });
   

app.get("/", (req,res) =>{
    //console.log("API lestenting")
    res.json({message: "API Listening"})
})


//----------------Create a new restaurant
app.post("/api/restaurants",(req,res) =>{
    console.log("create new resatrant");
    db.addNewRestaurant(req.body).then(value => res.status(201).json({message:`restaurant created`}))
    
})


//----------------Get all restaurant by identifier
app.get("/api/restaurants",(req,res) => {
   

    let p = req.query.page;
    console.log(p);
    let pP = req.query.perPage;
    console.log(pP)
    let b = req.query.borough;
    console.log(b)

     if (typeof p !== 'undefined' && typeof p !== 'undefined'){
      db.getAllRestaurants(p,pP,b).then(value => {
        res.status(201).json({message:`get all Restaurants ${value}`});
      } )
     }
     else{
         res.status(404).json({ message: "Resource not found" });
    }
})

//---------Get restaurant by id
app.get("/api/restaurants/:id", (req, res) => {
    if (db.getRestaurantById(req.params.id)) {
      db.getRestaurantById(req.params.id).then(value => res.status(201).json({message : `getting id ${value}`}))
      
    }
    else {
      res.status(404).json({ message:"Not found"});
}
});


//---------Update restaurant by id
app.put("/api/restaurants/:id", (req, res) => {    
   
  if( db.updateRestaurantById(req.body,req.params.id))
  {
    db.updateRestaurantById(req.body,req.params.id).then(value =>
      res.status(201).json({message: `updated item with identifier`, value}));
  } 
  else 
  {
    res.status(404).json({ message:`not found` });
  }    
  });
app.delete("/api/restaurants/:id", (req, res) => {
    
    db.deleteRestaurantById(req.params.id)
    res.status(204).end();
  });
