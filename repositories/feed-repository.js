const Post = require('../models/post');

module.exports = {
  postsCount: () => Post.find().countDocuments(),

  find: (perPage, currentPage) => Post.find()
      .populate('creator', ['_id', 'name'])
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage),

  createPost: (title, content, imageUrl, creator) => {
    const post = new Post({
      title,
      content,
      imageUrl,
      creator,
    });
    return post.save();
  },

  findById: id => Post.findById(id),
};
