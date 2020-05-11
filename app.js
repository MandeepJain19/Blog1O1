var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");//help to use put and delete
//App config
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
//Mongoose config
mongoose.connect("mongodb://localhost/BlogDB",{useNewUrlParser: true, useUnifiedTopology: true });
var blogSchema = new mongoose.Schema({
	title:String,
	url : String,
	body : String,
	date : {type: Date,default: Date.now}
})
var blog = mongoose.model("blog",blogSchema);

// blog.create(
	// {
		// title : "Beach",
		// url:"https://image.shutterstock.com/image-photo/chairs-umbrella-palm-beach-tropical-260nw-559599520.jpg" ,
		// body : "Beautifull Beach in Somewhere" 
	// }
// )


//Restfull Routes
app.get("/",function(req,res)
{
	res.redirect("/blogs");
})
// Index Route
app.get("/blogs",function(req,res)
{
	blog.find({},function(err,blogs){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("index",{blogs : blogs});
		}
	
	})
})
//New Route
app.get("/blogs/new",function(req,res){
	res.render("new");
});
// Create blog 
app.post("/blogs",function(req,res){
	
 blog.create(req.body.blog,function(err,newblog){
	if(err)
	{
		res.redirect("/blogs/new");
	}
	else{
		res.redirect("/blogs");
	}
 })
});

//Show Route
app.get("/blogs/:id",function(req,res){
	
	blog.findById(req.params.id,function(err,showBlog){
		if(err)
		{
				res.redirect("/blogs");
		}
		else{
				res.render("show",{blogs: showBlog});
		}
	});
})
// Edit Route
app.get("/blogs/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,editBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blogs: editBlog});
		}
	})
});
	
//Update Route
app.put("/blogs/:id",function(req,res){
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
		
	})
});
//Delete Route
app.delete("/blogs/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err,){
		if(err)
		{
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
});




app.listen("4000",function(){
	console.log("server : 4000");
});