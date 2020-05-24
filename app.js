const bodyParser = require("body-parser"),
	  expressSanitizer = require('express-sanitizer')
	  methodOverride = require("method-override"),
	  mongoose   = require("mongoose"),
	  express    = require("express"),
	  app        = express();

const port = process.env.PORT || 3000;

// APP CONFIG
//mongoose.connect(process.env.DataBaseURL);
mongoose.connect("mongodb://127.0.0.1:27017/Blogs",{useNewUrlParser: true,useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// SCHEMA SETUP
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	create: {type:Date , default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"Dog",
// 	image:"https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
// 	body:"The dog is curious"
// },function(err,blogs){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("New blog added!!");
// 		console.log(blogs);
// 	}
// });

// HOME ROUTE
app.get("/",function(req, res){
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs",function(req, res){
	//find all blogs
	Blog.find({},function(err, blogs){
		if(err){
			console.log(err);
		}else{
			//show them
		res.render("index",{blogs: blogs});
		}
	});
});


// NEW ROUTE
app.get("/blogs/new",function(req, res){
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs",function(req, res){
// 	create blogs
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}else{
// 			redirect to index
			res.redirect("/blogs")
		}
	});
});

// SHOW ROUTE
app.get("/blogs/:id",function(req, res){
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req, res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog: foundBlog});
		}
	});
});
// UPDATE ROUTE
app.put("/blogs/:id",function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

// DELETE ROUTE
app.delete("/blogs/:id",function(req, res){
	// destroty blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			// redirect to index
			res.redirect("/blogs");
		}
	});
});

app.listen(port,function(){
	console.log("Blog server is started!!");
});