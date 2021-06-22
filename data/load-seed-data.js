const client = require('../lib/client');
// import our seed data:
const music = require('./music.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
const categoriesData = require('./categories.js');
const { getCategoryIdByName } = require('../lib/utils.js');


run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];
    console.log(user);

    const categoryResponses = await Promise.all(
      categoriesData.map(category => {
        return client.query(`
          INSERT INTO categories (name)
          VALUES ($1)
          RETURNING *;
        `,
        [category.name]);
      })
    );

    const categories = categoryResponses.map(response => {
      return response.rows[0];
    });
    
    await Promise.all(
      music.map(music => {
        console.log(music);
        const matchedCategory = getCategoryIdByName(categories, music.category);
        
        return client.query(`
                    INSERT INTO music (name, description, category_id, price, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [music.name, music.description, matchedCategory, music.price, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
