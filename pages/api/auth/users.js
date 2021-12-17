import { MongoClient } from "mongodb";
import { hash } from "bcryptjs";

const DUMMY_USERS = [];
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

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

    const checkExistingUsername = await db
      .collection("users")
      .findOne({ username: data.username });
    const checkExistingEmail = await db
      .collection("users")
      .findOne({ email: data.email });

    if (checkExistingUsername) {
      res.status(422).json({ message: "Username is already taken." });
      client.close();
      return;
    }

    if (checkExistingEmail) {
      res.status(422).json({ message: "Email is already taken." });
      client.close();
      return;
    }

    const user = { ...data, password: await hash(data.password, 12) };

    const status = db.collection("users").insertOne(user);
    res.status(201).json({ message: "User created!", ...status });
    client.close();
    // DUMMY_USERS.push(user);
    // console.log(DUMMY_USERS);
  } else {
    res.status(500).json({ message: "Route not valid" });
  }
}

const validateUserData = (userData) => {
  const errors = [];

  if (!userData.username || userData.username.trim() === "") {
    errors.push("Username can't be empty!");
  }

  if (!userData.email || !userData.email.includes("@")) {
    errors.push("Invalid email format!");
  }

  if (!userData.password || userData.password.length < 6) {
    errors.push("Password must be at least 6 characters!");
  }

  DUMMY_USERS.forEach((user) => {
    if (user.username === userData.username) {
      errors.push("Username is already taken!");
    }

    if (user.email === userData.email) {
      errors.push("Email is already taken!");
    }
  });

  return errors;
};

export default handler;
