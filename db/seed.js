const { 
  client, 
  createUser, 
  createPuppy, 
  updateUser 
} = require('./index');

const { users, puppies } = require('./seed_data');


async function dropTables() {
  try {
    await client.query(`
      DROP TABLE IF EXISTS puppies;
      DROP TABLE IF EXISTS users;
    `)
  } catch(ex) {
    console.log('ERROR DROPPING TABLES!');
    console.log(ex);
  }
}


async function createTables() {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        email VARCHAR(255) UNIQUE NOT NULL
      );
    `)
    
    await client.query(`
      CREATE TABLE puppies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        email VARCHAR(255),
        "ownerId" INTEGER REFERENCES users(id)
      )
    `)
  } catch(ex) {
    console.log('CREATING TABLES FAILED!');
    console.log(ex.error);
  }
}


async function createInitialUsers() {
  try {
    await Promise.all(users.map(createUser));
  } catch(ex) {
    console.log('ERROR CREATING USERS!');
    console.log(ex.error);
  }
}

async function createInitialPuppies() {
  try {
    await Promise.all(puppies.map(createPuppy));
  } catch(ex) {
    console.log('ERROR CREATING PUPPIES');
    console.log(ex.error);
  }
}


async function buildDB() {
  try {
    console.log('Starting to build the DB!');
    client.connect();
    
    console.log('Dropping tables.');
    await dropTables();
    console.log('Finished Dropping tables.');
    
    console.log('Creating tables.');
    await createTables();
    console.log('Finished Creating Tables.');
    
    console.log('Creating Initial Users.');
    await createInitialUsers();
    console.log('Finished Creating Initial Users.');
    
    console.log('Creating Initial Puppies');
    await createInitialPuppies();
    console.log('Finished Creating Initial Puppies');
    
    
    // WHERE clause: finds records based on specified "WHERE" conditions
    const {rows: [userJoe]} = await client.query(`
      SELECT * FROM users
      WHERE "name"='Joe';
    `)
    
    // const {rows} = await client.query(`
    //   SELECT * FROM users
    //   WHERE "age"=30;
    // `)
    
    
    // Operators: AND, OR, and NOT
    // using AND:
    const { rows: [remy] } = await client.query(`
      SELECT * FROM users
      WHERE "age"=30
      AND "name"='Remy';
    `);
    
    // using OR:
    const { rows: [singleUser]} = await client.query(`
      SELECT * FROM users
      WHERE "age"=25 
      OR "name"='Sara';
    `)

    // using NOT
    // const { rows } = await client.query(`
    //   SELECT * FROM users
    //   WHERE NOT "name"='John';
    // `)
    

    const { rows } = await client.query(`
      SELECT * FROM users;
    `)
    
    console.log(rows);
    
    const updatedUser = await updateUser(3, {
      // email: 'joe1234@email.com',
      age: 46,
      name: 'Joseph'
    })
    
    console.log(updatedUser);
    
    
    
  } catch(ex) {
    console.log('SOMETHING WENT WRONG BUILDING THE DB!');
    console.log(ex);
  }
}

buildDB();
