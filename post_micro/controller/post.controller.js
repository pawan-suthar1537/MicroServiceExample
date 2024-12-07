import axios from "axios";
import { Post } from "../model/post.model.js";
import dotenv from "dotenv";
dotenv.config();
import Redis from "ioredis";

const userCache = {};

const generateUserCacheKey = (userId) => `user:${userId}`;

export const Create = async (req, res) => {
  const authuser = req.user;
  if (!authuser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { title, desc } = req.body;
  try {
    const post = await Post.findOne({ title });
    if (post) {
      return res
        .status(400)
        .json({ message: "Post already exist with this title" });
    }

    const newPost = await Post.create({ title, desc, userId: authuser.userId });
    return res.status(201).json({
      status: "success",
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const Get = async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    const postWithUserDetails = await Promise.all(
      posts.map(async (post) => {
        const plainPost = post.toObject();
        const userId = post.userId;
        try {
          if (userCache[userId]) {
            return { ...plainPost, user: userCache[userId] };
          }
          const userResponse = await axios.post(
            `${process.env.AUTH_MICRO_URI}/detail/${userId}`
          );

          const userData = userResponse.data.data.user;

          userCache[userId] = userData;

          return {
            ...plainPost,
            user: userData,
          };
        } catch (error) {
          console.error(
            `Failed to fetch user details for userId: ${post.userId}`,
            error.message
          );
          return {
            ...plainPost,
            user: null,
          };
        }
      })
    );

    return res.status(200).json({
      status: "success",
      message: "Posts fetched successfully",
      data: postWithUserDetails,
    });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

process.on("SIGINT", async () => {
  await redisClient.quit();
  process.exit();
});
