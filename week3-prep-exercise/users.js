import { v4 as generateUUID } from 'uuid';
import { hash, compare } from 'bcrypt';
import usersDatabase from './usersDatabase.json' assert { type: "json" };

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

  // Save user to usersDatabase
  usersDatabase.push(newUser);

  // Return success and the new user to the client
  res.status(201).json({ 
    id: newUser.id, 
    username: newUser.username,
  }).end();
};

// Helper function
const getUserByUsername = (username) => {
  return usersDatabase.find(user => user.username === username);
};