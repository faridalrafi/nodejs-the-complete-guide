exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'First Posts', content: 'this is the first post' }]
  });
};

exports.createPost = (req, res, next) => {
  const { title, content } = req.body;
  res.status(201).json({
    message: 'Post Created Successfuly !',
    post: { id: new Date().toISOString(), title: title, content: content }
  });
};
