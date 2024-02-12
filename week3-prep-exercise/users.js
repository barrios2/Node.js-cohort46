import { v4 as generateUUID } from 'uuid';
import { hash, compare } from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import usersDatabase from './usersDatabase.json' assert { type: "json" };

import sessions from './userSession.json' assert { type: "json" };

const SECRET = '7HFNVKFV87EBFKLSFV9885NGJERKVNSFKJ';

export const register = async (req, res) => {
  const { username, password } = req.body; // check request body

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

  try {
    const saltRounds = 10; // hash the password and create new user
    const hashedPassword = await hash(password, saltRounds);
    const newUser = {
      id: generateUUID(), // u can also use 'crypto.randomUUID();' so u don't install more packages 
      username: username,
      password: hashedPassword,
    };
    // save user to usersDatabase and sync json file with new user
    usersDatabase.push(newUser);
    fs.writeFileSync('./usersDatabase.json', JSON.stringify(usersDatabase, null, 2));
    // return success and the new user to the client
    res.status(201).json({ 
      id: newUser.id, 
      username: newUser.username,
    }).end();
  } catch (error) {
    res.status(500).json({ message: 'There was an error registering this user' }).end();
  }
};

export const login = async (req, res) => {
   const { username, password } = req.body; // check request body

   if (!username || !password) {
    res.status(400).json({ message: 'Please provide username and password' }).end();
    return;
  }

  try {
    const user = getUserByUsername(username); // find user in the database
    const isPasswordCorrect = await compare(password, user.password);// check if password is correct by using bcrypt compare

    if (!user || !isPasswordCorrect) {
      res.status(401).json({ message: 'Invalid username / password combination' }).end();
      return;
    }
    // Login successfully - create a JW token
    const token = jsonwebtoken.sign(user.id, SECRET);
    sessions.push({ token, userId: user.id }); // save the session token
    res.status(200).json({ token, message: 'Login is successful' }).end(); // return token and message to client
  } catch (error) {
    res.status(500).json({ message: `Internal server error + ${error}` }).end();
  }
};

export const getProfile = async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const token = extractBearerTokenFromAuth(authorizationHeader);

  if (!token) {
    res.status(401).json({ message: 'User is not logged in' }).end();
    return;
  }

  try {
    jsonwebtoken.verify(token, SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Invalid token' }).end();
        return;
      }

      const user = getUserById(decoded.userId);
      if (!user) {
        res.status(401).json({ message: 'User not found' }).end();
        return;
      }
      // Return a message with the username
      res.status(200).json({ message: `Hello! You are currently logged in as ${user.username}!` }).end();
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' }).end();
  }
};

export const logout = async (req, res) => {
  res.status(204).json({ message: 'Successful logout' }).end();
}


// Helper functions
const getUserByUsername = (username) => {
  return usersDatabase.find(user => user.username === username);
};

const getUserById = (userID) => {
  return usersDatabase.find(user => user.id === userID);
};

const extractBearerTokenFromAuth = (authorization) => {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }
  return authorization.replace('Bearer ', '');
}