// 13c9f3e80e51404ea7cbb9944d38ffac

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const https = require("https");
const { title } = require("process");

const homeStartingContent =
  "A blog (a shortened version of “weblog”) is an online journal or informational website displaying information in reverse chronological order, with the latest posts appearing first, at the top. It is a platform where a writer or a group of writers share their views on an individual subject.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/testblogDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

app.get("/news", function (req, res) {
  const url =
    "https://newsapi.org/v2/everything?domains=wsj.com&apiKey=13c9f3e80e51404ea7cbb9944d38ffac";

  https.get(url, function (response) {
    console.log(response.statusCode);
    let result = "";

    response.on("data", function (data) {
      result += data;
    });

    response.on("end", () => {
      const newsdata = JSON.parse(result);
      const news = newsdata.articles;

      res.render("news", { news: news });
    });
  });

  // res.render("news");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
