require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

const { getCategoryIdByName } = require('../lib/utils.js');


describe('post put and delete routes', () => {
  describe('routes', () => {
    let token;
    let categories;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token;// eslint-disable-line 
      
      const categoryData = await fakeRequest(app).get('/categories');
      categories = categoryData.body;
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });
    test('/POST games creates a single game', async() => {
      const categoryId = getCategoryIdByName(categories, 'newwave');
      const data = await fakeRequest(app)
        .post('/music')
        .send({
          name: 'new band',
          description: 'high energy stuff',
          category_id: categoryId,
          price: 15.00
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const dataMusic = await fakeRequest(app)
        .get('/music')
        .expect('Content-Type', /json/)
        .expect(200);

      const newBand = { 
        name: 'new band',
        description: 'high energy stuff',
        category_id: 'newwave',
        price: 15.00,
        id: 10, 
        owner_id: 1,
      };
      const postedNewBand = { 
        name: 'new band',
        description: 'high energy stuff',
        category_id: categoryId,
        price: 15.00,
        id: 10, 
        owner_id: 1,
      };

      expect(data.body).toEqual(postedNewBand);

      expect(dataMusic.body).toContainEqual(newBand);
    });
    test('/PUT music updates a single music', async() => {
      const categoryId = getCategoryIdByName(categories, 'newwave');
      const data = await fakeRequest(app)
        .put('/music/6')
        .send({
          name: 'Interpol 2',
          description: 'New version of Interpol',
          category_id: categoryId,
          price: 16.00
        })
        .expect('Content-Type', /json/)
        .expect(200);
    
      const dataMusic = await fakeRequest(app)
        .get('/music')
        .expect('Content-Type', /json/)
        .expect(200);
    
      const newBand = { 
        name: 'Interpol 2',
        description: 'New version of Interpol',
        category_id: 'newwave',
        price: 16.00,
        'id': 6, 
        'owner_id': 1,
      };
      const putNewBand = { 
        name: 'Interpol 2',
        description: 'New version of Interpol',
        category_id: categoryId,
        price: 16.00,
        'id': 6, 
        'owner_id': 1,
      };
          
      expect(data.body).toEqual(putNewBand);
      const matchingBand = dataMusic.body.find(music =>{
        return music.description === 'New version of Interpol';
      });
      expect(matchingBand).toEqual(newBand);
    });
    test('/DELETE music deletes a single band from the db', async() => {

      await fakeRequest(app)
        .delete('/music/6')
        .expect('Content-Type', /json/)
        .expect(200);
      
      const dataMusic = await fakeRequest(app)
        .get('/music')
        .expect('Content-Type', /json/)
        .expect(200);
      
      const newBand = { 
        name: 'Interpol 2',
        description: 'New version of Interpol',
        category: 'Indi Rock',
        price: 16.00,
        'id': 6, 
        'owner_id': 1,
      };
      expect(dataMusic.body).not.toContainEqual(newBand);
    });
  });
});