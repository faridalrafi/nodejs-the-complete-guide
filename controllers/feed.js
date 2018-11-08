exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'First Posts', content: 'this is the first post' }]
  });
};
