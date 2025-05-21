import { jest } from "@jest/globals";

let createPost,
  getLoggedInUserPosts,
  getPosts,
  getUserPosts,
  getPost,
  updatePost,
  deletePost,
  prisma;

await jest.unstable_mockModule("../prisma/client.js", () => ({
  default: {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

beforeAll(async () => {
  prisma = (await import("../prisma/client.js")).default;
  ({
    createPost,
    getLoggedInUserPosts,
    getPosts,
    getUserPosts,
    getPost,
    updatePost,
    deletePost,
  } = await import("../src/controllers/postsControllers.js")); 
});
describe("Post CRUD Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: {},
      body: {},
      files: null,
      user: {
        id: 1,
        role: "user",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createPost", () => {
    beforeEach(() => {
      req.body = {
        title: "Test Post",
        content: "This is a test post content",
      };
    });

    test("should create post successfully without image", async () => {
      const mockPost = {
        id: 1,
        title: "Test Post",
        content: "This is a test post content",
        authorId: 1,
      };

      prisma.post.create.mockResolvedValue(mockPost);

      await createPost(req, res);

      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          title: "Test Post",
          content: "This is a test post content",
          authorId: 1,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    test("should create post successfully with image", async () => {
      req.files = {
        image: [{ filename: "test-image.jpg" }],
      };

      const mockPost = {
        id: 1,
        title: "Test Post",
        content: "This is a test post content",
        authorId: 1,
        image: "/media/test-image.jpg",
      };

      prisma.post.create.mockResolvedValue(mockPost);

      await createPost(req, res);

      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          title: "Test Post",
          content: "This is a test post content",
          authorId: 1,
          image: "/media/test-image.jpg",
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    test("should use default authorId when user not provided", async () => {
      req.user = null;

      const mockPost = {
        id: 1,
        title: "Test Post",
        content: "This is a test post content",
        authorId: 1,
      };

      prisma.post.create.mockResolvedValue(mockPost);

      await createPost(req, res);

      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          title: "Test Post",
          content: "This is a test post content",
          authorId: 1,
        },
      });
    });

    test("should handle database errors", async () => {
      prisma.post.create.mockRejectedValue(new Error("Database error"));

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getLoggedInUserPosts", () => {
    test("should get logged in user posts successfully", async () => {
      const mockPosts = [
        {
          id: 1,
          title: "User Post 1",
          content: "Content 1",
          authorId: 1,
          author: { id: 1, fullNames: "Test User" },
          comments: [
            {
              id: 1,
              content: "Test comment",
              user: { id: 2, fullNames: "Commenter" },
            },
          ],
        },
      ];

      prisma.post.findMany.mockResolvedValue(mockPosts);

      await getLoggedInUserPosts(req, res);

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { authorId: 1 },
        include: {
          author: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    test("should use default userId when user not provided", async () => {
      req.user = null;
      prisma.post.findMany.mockResolvedValue([]);

      await getLoggedInUserPosts(req, res);

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { authorId: 1 },
        include: {
          author: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });
    });

    test("should handle database errors", async () => {
      prisma.post.findMany.mockRejectedValue(new Error("Database error"));

      await getLoggedInUserPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getPosts", () => {
    test("should get all posts successfully", async () => {
      const mockPosts = [
        {
          id: 1,
          title: "Post 1",
          content: "Content 1",
          author: { id: 1, fullNames: "User 1" },
          comments: [],
        },
        {
          id: 2,
          title: "Post 2",
          content: "Content 2",
          author: { id: 2, fullNames: "User 2" },
          comments: [],
        },
      ];

      prisma.post.findMany.mockResolvedValue(mockPosts);

      await getPosts(req, res);

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        include: {
          author: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    test("should handle database errors", async () => {
      prisma.post.findMany.mockRejectedValue(new Error("Database error"));

      await getPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getUserPosts", () => {
    beforeEach(() => {
      req.params = { userId: "2" };
    });

    test("should get user posts successfully", async () => {
      const mockPosts = [
        {
          id: 1,
          title: "User 2 Post",
          content: "Content",
          authorId: 2,
          author: { id: 2, fullNames: "User 2" },
          comments: [],
        },
      ];

      prisma.post.findMany.mockResolvedValue(mockPosts);

      await getUserPosts(req, res);

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { authorId: 2 },
        include: {
          author: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    test("should handle database errors", async () => {
      prisma.post.findMany.mockRejectedValue(new Error("Database error"));

      await getUserPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getPost", () => {
    beforeEach(() => {
      req.params = { id: "1" };
    });

    test("should get single post successfully", async () => {
      const mockPost = {
        id: 1,
        title: "Test Post",
        content: "Test Content",
        author: { id: 1, fullNames: "Test User" },
        comments: [
          {
            id: 1,
            content: "Test comment",
            user: { id: 2, fullNames: "Commenter" },
          },
        ],
      };

      prisma.post.findUnique.mockResolvedValue(mockPost);

      await getPost(req, res);

      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          author: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    test("should return 404 when post not found", async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await getPost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
    });

    test("should handle database errors", async () => {
      prisma.post.findUnique.mockRejectedValue(new Error("Database error"));

      await getPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("updatePost", () => {
    beforeEach(() => {
      req.params = { id: "1" };
      req.body = {
        title: "Updated Title",
        content: "Updated Content",
      };
    });

    test("should update post successfully by owner", async () => {
      const existingPost = {
        id: 1,
        title: "Original Title",
        authorId: 1,
      };

      const updatedPost = {
        id: 1,
        title: "Updated Title",
        content: "Updated Content",
        authorId: 1,
      };

      prisma.post.findUnique.mockResolvedValue(existingPost);
      prisma.post.update.mockResolvedValue(updatedPost);

      await updatePost(req, res);

      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: "Updated Title",
          content: "Updated Content",
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedPost);
    });

    test("should update post successfully by admin", async () => {
      const existingPost = {
        id: 1,
        title: "Original Title",
        authorId: 2, // Different from current user
      };

      req.user.role = "admin";

      const updatedPost = {
        id: 1,
        title: "Updated Title",
        content: "Updated Content",
        authorId: 2,
      };

      prisma.post.findUnique.mockResolvedValue(existingPost);
      prisma.post.update.mockResolvedValue(updatedPost);

      await updatePost(req, res);

      expect(prisma.post.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should update post with image", async () => {
      req.files = {
        image: [{ filename: "updated-image.jpg" }],
      };

      const existingPost = {
        id: 1,
        title: "Original Title",
        authorId: 1,
      };

      const updatedPost = {
        id: 1,
        title: "Updated Title",
        content: "Updated Content",
        image: "/media/updated-image.jpg",
        authorId: 1,
      };

      prisma.post.findUnique.mockResolvedValue(existingPost);
      prisma.post.update.mockResolvedValue(updatedPost);

      await updatePost(req, res);

      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: "Updated Title",
          content: "Updated Content",
          image: "/media/updated-image.jpg",
        },
      });
    });

    test("should return 404 when post not found", async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
    });

    test("should return 401 when user is not authorized", async () => {
      const existingPost = {
        id: 1,
        title: "Original Title",
        authorId: 2, // Different from current user (id: 1)
      };

      prisma.post.findUnique.mockResolvedValue(existingPost);

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    test("should handle database errors", async () => {
      prisma.post.findUnique.mockRejectedValue(new Error("Database error"));

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("deletePost", () => {
    beforeEach(() => {
      req.params = { id: "1" };
    });

    test("should delete post successfully by owner", async () => {
      const existingPost = {
        id: 1,
        title: "Test Post",
        authorId: 1,
      };

      prisma.post.findUnique.mockResolvedValue(existingPost);
      prisma.post.delete.mockResolvedValue({});

      await deletePost(req, res);

      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Post deleted" });
    });

    test("should delete post successfully by admin", async () => {
      const existingPost = {
        id: 1,
        title: "Test Post",
        authorId: 2, // Different from current user
      };

      req.user.role = "admin";

      prisma.post.findUnique.mockResolvedValue(existingPost);
      prisma.post.delete.mockResolvedValue({});

      await deletePost(req, res);

      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should return 404 when post not found", async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
    });

    test("should return 401 when user is not authorized", async () => {
      const existingPost = {
        id: 1,
        title: "Test Post",
        authorId: 2, // Different from current user (id: 1)
      };

      prisma.post.findUnique.mockResolvedValue(existingPost);

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    test("should handle database errors", async () => {
      prisma.post.findUnique.mockRejectedValue(new Error("Database error"));

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
