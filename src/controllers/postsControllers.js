import prisma from "../../prisma/client.js";


// CREATE A NEW POST
export const createPost = async (req, res) => {
  try {
    const postData = { ...req.body };
    postData.authorId = req.user?.id || 1;

    // Handle single image upload
    if (req.files?.image?.[0]) {
      postData.image = `/media/${req.files.image[0].filename}`;
    }

    const post = await prisma.post.create({ data: postData });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET POSTS FOR LOGGED-IN USER
export const getLoggedInUserPosts = async (req, res) => {
  try {
    const userId = req.user?.id || 1;

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET POSTS BY SPECIFIC USER
export const getUserPosts = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE POST BY ID
export const getPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) return res.status(404).json({ message: 'Post not found' });

    // Authorization
    if (existingPost.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Update fields conditionally
    const dataToUpdate = {};
    if (req.body.title) dataToUpdate.title = req.body.title;
    if (req.body.content) dataToUpdate.content = req.body.content;
    if (req.files?.image?.[0]) {
      dataToUpdate.image = `/media/${req.files.image[0].filename}`;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: dataToUpdate,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
