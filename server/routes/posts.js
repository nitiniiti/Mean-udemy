const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const multer = require("multer");
const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("Invalid Mime Type");
        if (isValid) {
            error = null;
        }
        cb(error, __dirname + "/../images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(" ").join("-");
        const ext = MIME_TYPE[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});


router.get('/api/posts', (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    const postQuery = Post.find();
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    postQuery.then((documents) => {
        console.log(documents);
        res.status(200).json({ message: "Successfully fetched", posts: documents });
    })
});

router.get('/api/post/:postId', (req, res, next) => {
    Post.findOne({ _id: req.params.postId }).then((document) => {
        console.log(document);
        res.status(200).json({ message: "Successfully fetched", post: document });
    })
});

router.post('/api/posts', multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    console.log("postData ==========>", post);
    post.save().then((post) => {
        res.status(200).json({ message: "Successfully saved", post: post });
    }).catch((err) => {
        console.log("Error occured", err);
    });
});

router.put('/api/post/:postId', multer({ storage: storage }).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.params.postId,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    })
    Post.updateOne({ _id: req.params.postId }, post).then((post) => {
        res.status(200).json({ message: "Successfully updated", post: post });
    }).catch((err) => {
        console.log("Error occured", err);
    });
});

router.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then((result) => {
        res.status(200).json({ message: "Post deleted" });
    }).catch((err) => {
        console.log("Error occured", err);
    });
});


module.exports = router;