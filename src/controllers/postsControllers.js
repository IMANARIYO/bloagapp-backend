import { models } from "../models/index.js";

const { Comment, Post, User } = models;

export const createPost = async (req, res) => {
  try {
    // Dynamically build the post object from req.body
    const postData = { ...req.body};
    postData.authorId= req.user.id || 1 ;

    // Handle single image upload
    if (req.files && req.files.image) {
      postData.image = `/media/${req.files.image[0].filename}`;
      console.log('Uploaded file path:', postData.image);
    }
   

    const post = await Post.create(postData);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, as: 'author'},
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user' }]
        }
      ]
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    let userId=req.params.userId;
    const posts = await Post.findAll({
      where: { authorId: userId },
      include: [
        { model: User, as: 'author'},
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user' }]
        }
      ]
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author' },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user' }]
        }
      ]
    });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the logged-in user is the author
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Update the post fields only if new data is provided
    if (req.body.title) {
      post.title = req.body.title;
    }
    if (req.body.content) {
      post.content = req.body.content;
    }
    if (req.files && req.files.image) {
      post.image =`/media/${req.files.image[0].filename}`;
      console.log('Uploaded file path:', post.image);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the logged-in user is the author
    if (post.authorId !== req.user.id&& req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await post.destroy();
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
