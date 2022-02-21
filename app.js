const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Create Your Blog ! Save Your Blog ! TAP on the POST to GET STARTED ! Go Onnn...";
const aboutContent = "This Blog App make your Life Easier. You can 'Save' any Data or Daily Task for your Remainder";
const contactContent = "bipinkish.in © Bipin Kish.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let PORT = process.env.PORT;
if (PORT == "" || PORT == null) {
  PORT = 3000;
}

mongoose.connect("mongodb+srv://admin-bipin:admin@cluster0.wn1bi.mongodb.net/blogDB");

const blogSchema = new mongoose.Schema({
  title: String,
  post: String
})

const Blog = new mongoose.model("Blog", blogSchema);

app.get("/", function (req, res) {
  Blog.find({}, function (err, foundBlogs) {
    if (!err) {
      res.render("home", { home: homeStartingContent, posts: foundBlogs });
    }
  })

})

app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
})

app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
})

app.get("/compose", function (req, res) {
  res.render("compose");
})

app.get("/posts/:id", function (req, res) {
  const reqId = req.params.id;
  Blog.findById(reqId, function (err, foundBlog) {
    res.render("post", { title: foundBlog.title, content: foundBlog.post });
  })

})

app.post("/compose", function (req, res) {
  const blog = new Blog({
    title: req.body.title,
    post: req.body.post
  })
  blog.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });

})

app.post("/delete", function (req, res) {
  const blogId = req.body.blogId;
  Blog.findByIdAndRemove(blogId, function (err) {
    if (!err) {
      console.log("Deleted...");
    }
  })
  res.redirect("/");
})


app.listen(PORT, function () {
  console.log("Server started on port 3000");
});
