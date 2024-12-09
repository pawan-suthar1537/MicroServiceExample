import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide all fields",
      });
    }

    const is_exist = await User.findOne({ email });
    if (is_exist) {
      return res.status(400).json({
        status: "fail",
        message: `User already exist with email ${email}`,
      });
    }

    const hasheddPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = await User({
      name,
      email,
      password: hasheddPassword,
    });

    await user.save();

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all fields",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found please try again",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect password please try again",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).json({
      status: "success",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found in the request",
      });
    }

    const userData = await User.findById(user.userId).select("-password");
    if (!userData) {
      return res.status(400).json({
        status: "fail",
        message: "User not found in databse",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        req_user: user,
        user: userData,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const userDetailbyId = async (req, res) => {
  const { id } = req.params;
  console.log(`Received request for user details with id: ${id}`);
  try {
    const user = await User.findById(id).select("name email");
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found in the request",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User details fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
