const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/categories', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT 	 id, name
      FROM     categories
      ORDER BY name
    `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/music', async(req, res) => {
  try {
    const data = await client.query(`SELECT 	m.id, m.name, m.description, c.name as category_id, m.price, m.owner_id 
    FROM 	  music as m
    JOIN 	  categories as c
    ON 	 	  m.category_id = c.id;`);
    
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});
app.get('/music/:id', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT 	m.id, m.name, m.description, c.name as category_id, m.price, m.owner_id 
    FROM 	  music as m
    JOIN 	  categories as c
    ON 	 	  m.category_id = c.id 
    where m.id=$1;
    `, [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});
app.post('/music', async(req, res) => {
  try {
    // the SQL query is an INSERT
    const data = await client.query(`
      INSERT INTO music (name, description, category_id, price,  owner_id)
      VALUES ($1, $2, $3, $4, 1)
      RETURNING *`, [req.body.name, req.body.description, req.body.category_id, req.body.price]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});
app.put('/music/:id', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE music 
    SET 
      name=$1,
      description=$2, 
      category_id=$3, 
      price=$4
    WHERE id=$5
    RETURNING *`, [req.body.name, req.body.description, req.body.category_id, req.body.price, req.params.id]);
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});
app.delete('/music/:id', async(req, res) => {
  try {
    const data = await client.query('DELETE FROM music WHERE id=$1', [req.params.id]);
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;