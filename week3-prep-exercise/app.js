import express from 'express';
// import { register, login, getProfile, logout } from './users.js';
import { register, login, profile} from './users.js';

let app = express();

app.use(express.json());

app.post ( '/register', register);
app.post ( '/login',    login);
app.get  ( '/profile',  profile);
// app.post ( '/logout',   logout);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});