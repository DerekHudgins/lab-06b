require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

const music = [
  {
    id: 8,
    name: 'The Cure',
    description: 'Sad boi tunes',
    category_id: 'First wave emo',
    price: 15,
    owner_id: 1
  },
  {
    id: 7,
    name: 'Joy Division',
    description: 'Sad boi tunes',
    category_id: 'First wave emo',
    price: 15,
    owner_id: 1
  },
  {
    id: 6,
    name: 'Interpol',
    description: 'Indi rock from the UK',
    category_id: 'Indi Rock',
    price: 15,
    owner_id: 1
  },
  {
    id: 5,
    name: 'The Specials',
    description: 'first wave ska',
    category_id: 'ska',
    price: 15,
    owner_id: 1
  },
  {
    id: 4,
    name: 'Streetlight Manifesto',
    description: 'high energy ska',
    category_id: 'ska/punk',
    price: 15,
    owner_id: 1
  },
  {
    id: 3,
    name: 'Miles Davis',
    description: 'Jazz from the 1950s',
    category_id: 'Jazz',
    price: 15,
    owner_id: 1
  },
  {
    id: 2,
    name: 'The Growlers',
    description: 'surf rock',
    category_id: 'beachgoth',
    price: 15,
    owner_id: 1
  },
  {
    id: 1,
    name: 'The Smiths',
    description: 'A new wave/emo band from the UK',
    category_id: 'newwave',
    price: 15,
    owner_id: 1
  },
  {
    id: 9,
    name: 'The Cramps',
    description: 'surf punk',
    category_id: 'Pysch/Rock',
    price: 15,
    owner_id: 1
  }
];

const music2 = {
  name: 'The Growlers',
  description: 'surf rock',
  id: 2,
  category_id: 'beachgoth',
  owner_id: 1,
  price: 15.00
};




describe ('app routes', () => {
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

    test('returns growlers', async() => {

      const expectation = music2;

      const data = await fakeRequest(app)
        .get('/music/2')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('returns single music', async() => {
      

      const expectation = music;

      const data = await fakeRequest(app)
        .get('/music')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(expectation);
    });
  });
});