require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

const music = [
  {
    name: 'The Smiths',
    description: 'A new wave/emo band from the UK',
    id: 1,
    category: 'newwave',
    owner_id: 1,
    price: 15.00
  },
  {
    name: 'The Growlers',
    description: 'surf rock',
    id: 2,
    category: 'beachgoth',
    owner_id: 1,
    price: 15.00
  },
  {
    name: 'Miles Davis',
    description: 'Jazz from the 1950s',
    id: 3,
    category: 'Jazz',
    owner_id: 1,
    price: 15.00
  },
  {
    name: 'Streetlight Manifesto',
    description: 'high energy ska',
    id: 4,
    category: 'ska/punk',
    owner_id: 1,
    price: 15.00
  },
  {
    name: 'The Specials',
    description: 'first wave ska',
    id: 5,
    category: 'ska',
    owner_id: 1,
    price: 15.00
  },
  {
    name: 'Interpol',
    description: 'Indi rock from the UK',
    id: 6,
    category: 'Indi Rock',
    owner_id: 1,
    price: 15.00
  },
  {
    name: 'Joy Division',
    description: 'Sad boi tunes',
    id: 7,
    category: 'First wave emo',
    owner_id: 1,
    price: 15.00
  },
  {
    name: 'The Cure',
    description: 'Sad boi tunes',
    id: 8,
    category: 'First wave emo',
    owner_id: 1,
    price: 15.00
  },
  {
    name: 'The Cramps',
    description: 'surf punk',
    id: 9,
    category: 'Pysch/Rock',
    owner_id: 1,
    price: 15.00
  },
  {
    name: 'Snail Mail',
    description: 'Dreamy',
    id: 10,
    category: 'rock',
    owner_id: 1,
    price: 15.00
  },
  {
    name: 'Angel Olsen',
    description: 'Dreamy',
    id: 11,
    category: 'Mysitc/dark',
    owner_id: 1,
    price: 15.00
  },
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