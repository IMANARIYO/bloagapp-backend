import { models } from "../models/index.js";

const { Comment, Post, User } = models;

export const addComment = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content: req.body.content,
      userId: req.user.id,
      postId: req.params.postId
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getALLCommentsForALLposts = async (req, res) => {
  try {
    // Fetch all comments without filtering by postId
    const comments = await Comment.findAll({
      include: [{ model: User, as: 'user' }] // Include User model
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      include: [{ model: User, as: 'user', }] // Assuming you have a User model with name and email fields
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [{ model: User,  as: 'user',}]
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.UserId !== req.user.id) { // Assuming req.user.id contains the authenticated user's ID
      return res.status(401).json({ message: 'Unauthorized' });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getCommentsForUserPosts = async (req, res) => {
  try {
    // Get all posts for the logged-in user
    const posts = await Post.findAll({
      where: { authorId: req.user.id }
    });

    if (!posts.length) {
      return res.status(404).json({ message: 'No posts found for this user' });
    }

    // Extract post IDs
    const postIds = posts.map(post => post.id);

    // Get all comments for these posts
    const comments = await Comment.findAll({
      where: { postId: postIds },
      include: [{ model: User, as: 'user' }]
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.authorId !== req.user.id) { // Assuming req.user.id contains the authenticated user's ID
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await comment.destroy();

    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
