const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const postModel = require('../models/post');
const slugify = require("slugify"); 
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');
require('dotenv').config();
router.post("/register",async (req,res)=>{
  let {username,email,password,bio} = req.body;
  try {
    let withemail = await userModel.findOne({email});
    if(withemail) return res.send("User already exists");
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt,async function(err, hash) {
        if(hash){
          let registeredUser = await userModel.create({
            username,
            email,
            password:hash,
            bio
          })
          res.status(201).send("User registered successfully");
        }
        else{
          res.send("Something went wrong")
        }    
      });
  });
  } catch (error) {
    res.send(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const withemail = await userModel.findOne({ email });
    if (!withemail) return res.status(400).send("Invalid credentials");

    bcrypt.compare(password, withemail.password, function (err, result) {
      if (!result) {
        return res.status(400).send("Invalid credentials");
      } else {
        const token = jwt.sign(
          {
            _id: withemail._id,
            username: withemail.username,
            email: withemail.email,
            bio: withemail.bio
          },
          process.env.JWT_SECRET
        );

        // ✅ Set cookie properly
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,      // Use HTTPS (Vercel uses HTTPS)
          sameSite: "None",  // Allow cross-site cookies
          maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).send("You can Login");
      }
    });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
});
router.get("/hello",(req,res)=>{
  res.send("Hello from server");
})



router.get("/home", verifyToken, (req, res) => {
  try {
    const decode = req.user;

    res.json({
      _id: decode._id, // ✅ include user ID
      username: decode.username,
      email: decode.email,
      bio: decode.bio
    });
  } catch (error) {
    console.error("Error in /home route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,        // optional, if you used this while setting cookie
    secure: false,         // set to false for localhost; true for production HTTPS
    sameSite: "Lax",       // use "None" only if frontend/backend are on different domains
    path: "/",             // ensures it clears if set with path
  });
  res.status(200).json({ message: "Logged Out Successfully" });
});

router.post("/create", verifyToken, async (req, res) => {
  try {
    let { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    tags = tags.split(",").map(tag => tag.trim());
    const slug = slugify(title, { lower: true });

    console.log("Decoded user:", req.user);
    if (!req.user || !req.user.username) {
      return res.status(401).json({ error: "Unauthorized: invalid token" });
    }

    let createdBlog = await postModel.create({
      title,
      content,
      tags,
      slug,
      isPublished: true,
      author: req.user.username,
      authorId: req.user._id,
      publishedAt: new Date()
    });

    res.json({ message: "Blog Created Successfully", blog: createdBlog });
  } catch (error) {
    console.error("Failed to create blog:", error);
    res.status(500).json({ error: "Failed to create blog." });
  }
});

router.get("/myblogs", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const blogs = await postModel.find({ authorId: userId }).sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Failed to fetch user blogs:", error);
    res.status(500).json({ error: "Failed to fetch your blogs" });
  }
});


router.post('/like/:postId', verifyToken, async (req, res) => {
  const decoded = req.user;
  const postId = req.params.postId;

  try {
    let post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "No Post Found" });

    const userId = decoded._id;

    if (post.likes.includes(userId)) {
      post.likes.pull(userId); // Remove like
    } else {
      post.likes.push(userId); // Add like
      post.dislikes.pull(userId); // Remove dislike if present
    }

    await post.save();
    res.status(200).json({ message: "Like updated", post });
  } catch (error) {
    console.error("Error Liking!", error);
    res.status(500).json({ error: "Failed to like" });
  }
});


router.post("/dislike/:postId", verifyToken, async (req, res) => {
  const postId = req.params.postId;
  const decoded = req.user;

  try {
    let post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "No Post Found" });

    const userId = decoded._id;

    if (post.dislikes.includes(userId)) {
      post.dislikes.pull(userId); // Remove dislike
    } else {
      post.dislikes.push(userId); // Add dislike
      post.likes.pull(userId);    // Remove like if present
    }

    await post.save();
    res.status(200).json({ message: "Dislike updated", post });
  } catch (error) {
    console.error("Error disliking!", error);
    res.status(500).json({ error: "Failed to dislike" });
  }
});
router.get("/allblogs", async (req, res) => {
  try {
    const { title, tags, date } = req.query;
    console.log("Search query:", req.query);

    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' }; // case-insensitive match
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1); // inclusive to next day
      query.createdAt = { $gte: start, $lt: end };
    }

    const posts = await postModel.find(query).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});


module.exports = router;