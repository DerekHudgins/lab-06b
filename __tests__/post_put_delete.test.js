require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');


describe('post put and delete routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });
    test('/POST games creates a single game', async() => {

     
      const data = await fakeRequest(app)
        .post('/music')
        .send({
          name: 'new band',
          description: 'high energy stuff',
          category: 'rock',
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
        category: 'rock',
        price: 15.00,
        id: 12, 
        owner_id: 1,
      };

      expect(data.body).toEqual(newBand);

      expect(dataMusic.body).toContainEqual(newBand);
    });
    test('/PUT music updates a single music', async() => {

      const data = await fakeRequest(app)
        .put('/music/6')
        .send({
          name: 'Interpol 2',
          description: 'New version of Interpol',
          category: 'Indi Rock',
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
        category: 'Indi Rock',
        price: 16.00,
        'id': 6, 
        'owner_id': 1,
      };
          
      expect(data.body).toEqual(newBand);
      expect(dataMusic.body).toContainEqual(newBand);
    });
  });
});