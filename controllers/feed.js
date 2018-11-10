const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'First Posts', content: 'this is the first post' }]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect',
      errors: errors.array()
    });
  }
  const { title, content, imageUrl } = req.body;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: 'Yago' }
  });

  post
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Post Created Successfuly !',
        post: result
      });
    })
    .catch(err => {
      console.log(err);
    });
};
