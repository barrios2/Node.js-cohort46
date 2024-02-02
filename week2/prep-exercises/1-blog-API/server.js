import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 3000;
app.use(express.json());
 
app.get('/', function (req, res) {
  res.send('<h1>Hello World</h1>');
});

app.post('/blogs', (req, res) => {
  const { title, content} = req.body; // accessing properties from req
  fs.writeFileSync(title, content);
  res.end('ok')
})

app.put('/posts/:title', (req, res) => {
  const { title, content} = req.body;
  let fileExists = fs.existsSync(`./${req.params.title}`);
  
  if (fileExists) {
    if (title && content) {
      fs.writeFileSync(title, content);
      res.end('ok')
    } else {
      res.end('Content or title is missing!')
    }
  } else {
    res.end('This post does not exist!');
  }
})

app.delete('/blogs/:title', (req, res) => {
  const title = req.params.title;
  let fileExists = fs.existsSync(`./${title}`);

  if (fileExists) {
    fs.unlinkSync(title);
    res.end('ok');
  } else {
    res.end('Blog does not exist');
  }
})

app.get('/blogs/:title', (req, res) => {
  const title = req.params.title;
  let fileExists = fs.existsSync(`./${title}`);

  if (fileExists) {
    const post = fs.readFileSync(title);
    res.end(post);
  } else {
    res.end('This post does not exist!');
  }
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));