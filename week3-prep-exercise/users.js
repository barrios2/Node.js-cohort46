import { v4 as generateUUID } from 'uuid';
import { hash, compare } from 'bcrypt';
import fs from 'fs';
import usersDatabase from './usersDatabase.json' assert { type: "json" };
import jsonwebtoken from 'jsonwebtoken';

export const register = async (req, res) => {
  // Check request body
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Please provide username and password' }).end();
    return;
  }

  // Check if username already exists
  const isUsernameExists = getUserByUsername(username) !== undefined;
  if (isUsernameExists) {
    res.status(400).json({ message: 'Username already exists' }).end();
    return;
  }

  // Hash the password and create new user
  const saltRounds = 10; 
  const hashedPassword = await hash(password, saltRounds);
  const newUser = {
    id: generateUUID(),
    username: username,
    password: hashedPassword,
  };

  // Save user to usersDatabase and sync json file with new user
  try {
    usersDatabase.push(newUser);
    fs.writeFileSync('./usersDatabase.json', JSON.stringify(usersDatabase, null, 2));
    // Return success and the new user to the client
    res.status(201).json({ 
      id: newUser.id, 
      username: newUser.username,
    }).end();
  } catch (error) {
    res.status(500).json({ message: 'There was an error registering this user' }).end();
  }
};

export const login = async (req, res) => {
   // Check request body
   const { username, password } = req.body;

   if (!username || !password) {
    res.status(400).json({ message: 'Please provide username and password' }).end();
    return;
  }

  // Find user in the database
  const user = getUserByUsername(username);
  if (!user) {
    res.status(401).json({ message: 'Invalid username / password combination' }).end();
    return;
  }

  // Check if password is correct by using bcrypt compare
  const isPasswordCorrect = await compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).json({ message: 'Invalid username / password combination' }).end();
    return;
  }

  // Login successfully - create a JW token
  const SECRET = generateUUID();
  const token = jsonwebtoken.sign(user.id, SECRET);

  // Return the token to the client
  res.status(200).json({ token }).end();
};

// Helper functions

const getUserByUsername = (username) => {
  return usersDatabase.find(user => user.username === username);
};