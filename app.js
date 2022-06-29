//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
//require mongoose
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
//create a schema for items
const itemsSchema = {
  name:   String
};
//model for the schema, singular version of schema
const Item = mongoose.model("Item", itemsSchema);


//using the above to create new models to be the default items
const item1 = new Item({
  name: "Welcome to a todolist powered by MongoDB"
});
const item2 = new Item({
  name: "Click the + button at add a new item"
});
const item3 = new Item({
  name: "<-Click this to delete the item"
});
const item4 = new Item({
  name: "Made by Nidhi Sunil Kumar"
});

const defaultItems = [item1,item2,item3,item4];




app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0){
      //insert default items into db if collection is empty
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        } else {
          console.log("Default items added to to do list");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
});

app.post("/delete", function(req,res){
  //delete item on being checked
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("Item deleted");
      res.redirect("/");
    }
  })
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save(); //saves this item into database
  res.redirect("/");
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
