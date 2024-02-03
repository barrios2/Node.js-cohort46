import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 3000;
app.use(express.json());
 
app.get('/', function (req, res) {
  res.send('<h1>Hello World</h1>');
});

// to create new blog
app.post('/blogs', (req, res) => {
  const { title, content} = req.body; // accessing properties from req
  fs.writeFileSync(title, content);
  res.end('ok')
})

// to update existing blog
app.put('/posts/:title', (req, res) => {
  const { title, content} = req.body;
  let fileExists = fs.existsSync(`./${req.params.title}`);
  
  if (fileExists) {
    if (title && content) {
      fs.writeFileSync(title, content);
      res.end('ok')
    } else {
      res.end('Content or title required!')
    }
  } else {
    res.end('This post does not exist!');
  }
})

// to delete blog
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

// to read blog
app.get('/blogs/:title', (req, res) => {
  const title = req.params.title;
  let fileExists = fs.existsSync(`./${title}`);

  if (fileExists) {
    const post = fs.readFileSync(title);
    res.end(post);
  } else {
    res.end('This blog does not exist!');
  }
})

// BONUS: to read all blogs
app.get('/blogs', (req, res) => {
  try {
    const blogPosts = fs.readdirSync('./'); // reading contents in dir
    const blogTitles = blogPosts
      .filter((file) => fs.statSync(file).isFile() && file.includes(' ')) // filtering non-directory files
      .map((file) => file.replace(/ /, '_')); // replace spaces with underscores
    res.json(blogTitles); // sending only modified file names in the res
  } catch (error) {
    console.error('Error fetching blog titles');
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));