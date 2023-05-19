const { 
  client, 
  createUser, 
  createPuppy, 
  updateUser,
  createTrick,
  addTrickToPuppy,
  getOwnersAndPuppies
} = require('./index');

const { users, puppies, tricks } = require('./seed_data');


async function dropTables() {
  try {
    await client.query(`
      DROP TABLE IF EXISTS puppy_tricks;
      DROP TABLE IF EXISTS tricks;
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
        username VARCHAR(255) UNIQUE NOT NULL,
        age INTEGER,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
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
    
    await client.query(`
      CREATE TABLE tricks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255)
      );
    `)
    
    await client.query(`
      CREATE TABLE puppy_tricks (
        id SERIAL PRIMARY KEY,
        "puppyId" INTEGER REFERENCES puppies(id),
        "trickId" INTEGER REFERENCES tricks(id)
      );
    `)
  } catch(ex) {
    console.log('CREATING TABLES FAILED!');
    console.log(ex);
  }
}


async function createInitialUsers() {
  try {
    await Promise.all(users.map(createUser));
  } catch(ex) {
    console.log('ERROR CREATING USERS!');
    console.log(ex);
  }
}

async function createInitialPuppies() {
  try {
    await Promise.all(puppies.map(createPuppy));
  } catch(ex) {
    console.log('ERROR CREATING PUPPIES');
    console.log(ex);
  }
}

async function createInitialTricks() {
  try {
    await Promise.all(tricks.map(createTrick));
  } catch(ex) {
    console.log('ERROR CREATING INITIAL TRICKS');
    console.log(ex);
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
    
    
    console.log('Creating tricks');
    await createInitialTricks();
    console.log('Finished creating initial tricks.')
    
    
    console.log('Creating puppy-trick relations');
    
    // WHERE clause: finds records based on specified "WHERE" conditions
    const {rows: [userJoe]} = await client.query(`
      SELECT * FROM users
      WHERE "username"='Joe';
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
      AND "username"='Remy';
    `);
    
    // using OR:
    const { rows: [singleUser]} = await client.query(`
      SELECT * FROM users
      WHERE "age"=25 
      OR "username"='Sara';
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
      username: 'Joseph'
    })
    
    console.log(updatedUser);
    
    await addTrickToPuppy(1, 1)
    await addTrickToPuppy(1, 2)
    await addTrickToPuppy(2, 2)
    await addTrickToPuppy(2, 3)
    await addTrickToPuppy(5, 1)
    await addTrickToPuppy(5, 2)
    await addTrickToPuppy(5, 3)
    
    
    const ownersAndTheirPuppies = await getOwnersAndPuppies();
    console.log(ownersAndTheirPuppies);
    
    
    client.end();
  } catch(ex) {
    console.log('SOMETHING WENT WRONG BUILDING THE DB!');
    console.log(ex);
  }
}

buildDB();
