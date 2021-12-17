import { MongoClient } from "mongodb";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    const errors = validateUserData(data);

    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const client = await MongoClient.connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.ivuvf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    );
    const db = client.db();

    const users = await db.collection("users").find().toArray();
    const foundUser = users.find(
      (user) =>
        user.username === data.identifier || user.email === data.identifier
    );

    if (!foundUser) {
      res.status(401).json({status: "error", message: "User not found." });
      client.close();
      return;
    }

    const checkPassword = await compare(data.password, foundUser.password);

    if (!checkPassword) {
      res.status(401).json({status: "error", message: "Incorrect password." });
      client.close();
      return;
    }

    const token = jwt.sign({
      id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
    }, JWT_SECRET);

    res.status(200).json({ status: "success", message: "Successul login.", token: token });
  } else {
    res.status(500).json({ status: "error", message: "Server error, try again later." });
  }
  client.close();
}

const validateUserData = (credentials) => {
  const errors = [];

  if (
    !credentials.identifier &&
    credentials.identifier.trim().length === 0 &&
    !credentials.password &&
    credentials.password.trim.length === 0
  ) {
    errors.push("Missing user identifier!");
  }

  return errors;
};

export default handler;
