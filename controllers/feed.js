const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

const clearImage = (filePath) => {
  const filePathResult = path.join(__dirname, '..', filePath);
  fs.unlink(filePathResult, (err) => {
    console.log(err);
  });
};

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully.',
        posts,
        totalItems,
      });
    })
    .catch((err) => {
      const errorToSend = err;
      if (!errorToSend.statusCode) errorToSend.statusCode = 500;

      next(errorToSend);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
    imageUrl,
    creator: { name: 'YSOUZAS' },
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: result,
      });
    })
    .catch((err) => {
      const errorToSend = err;
      if (!errorToSend.statusCode) {
        errorToSend.statusCode = 500;
      }
      next(errorToSend);
    });
};

exports.getPost = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post });
    })
    .catch((err) => {
      const errorToSend = err;
      if (!errorToSend.statusCode) {
        errorToSend.statusCode = 500;
      }
      next(errorToSend);
    });
};

exports.updatePost = (req, res, next) => {
  const { postId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const { title, content } = req.body;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      const postToUpdate = post;
      if (!postToUpdate) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== postToUpdate.imageUrl) {
        clearImage(postToUpdate.imageUrl);
      }
      postToUpdate.title = title;
      postToUpdate.imageUrl = imageUrl;
      postToUpdate.content = content;
      return postToUpdate.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch((err) => {
      const errorToSend = err;
      if (!errorToSend.statusCode) {
        errorToSend.statusCode = 500;
      }
      next(errorToSend);
    });
};

exports.deletePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      // Check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: 'Deleted post.' });
    })
    .catch((err) => {
      const errorToSend = err;
      if (!errorToSend.statusCode) errorToSend.statusCode = 500;
      next(errorToSend);
    });
};
