const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/demo";

const client = new Client({ connectionString });

async function createUser(user) {
  const { name, age, email } = user;

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users (name, age, email)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `,
      [name, age, email]
    );

    return user;
  } catch (ex) {
    console.log("ERROR CREATING SINLGE USER.");
    console.log(ex);
  }
}

async function createPuppy(puppy) {
  const { name, age, email, ownerId } = puppy;
  


  try {
    const {
      rows: [puppy],
    } = await client.query(
      `
      INSERT INTO puppies (name, age, email, "ownerId")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [name, age, email, ownerId]
    );

    return puppy;
  } catch (ex) {
    console.log("ERROR CREATING SINGLE PUPPY.");
    console.log(ex);
  }
}


async function updateUser(id, fields = {}) {
  
  /*
  Update SQL syntax
  UPDATE users
  SET "name"='newname', "age"=<new-age>
  WHERE id=<incoming-id>;
  */
  
  
  try {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
       
    if (setString.length === 0) {
      return;
    }
    
    const {rows: [user]} = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return user;
  } catch(ex) {
    console.log("ERROR UPDATING USER");
    console.log(ex);
  }
}

async function createTrick(trickTitle) {
  try {
    client.query(
      `
      INSERT INTO tricks (title)
      VALUES ($1);
    `,
      [trickTitle]
    );
  } catch(ex) {
    console.log("ERROR CREATING SINGLE TRICK");
    console.log(ex);
  }
}

async function addTrickToPuppy(puppyId, trickId) {
  try {
    client.query(`
      INSERT INTO puppy_tricks ("puppyId", "trickId")
      VALUES ($1, $2);
    `, [puppyId, trickId])
  } catch(ex) {
    console.log("ERROR ADDING TRICK TO PUPPY");
    console.log(ex);
  }
}

async function getOwnersAndPuppies() {
  try {
    const { rows } = await client.query(`
      SELECT users.name AS "ownerName", puppies.name AS "petName"
      FROM puppies
      INNER JOIN users ON puppies."ownerId" = users.id;
    `)
    
    return rows;
  } catch(ex) {
    console.log("ERROR GETTING OWNERS AND PUPPIES");
    console.log(ex);
  }
}

module.exports = {
  client,
  createUser,
  createPuppy,
  updateUser,
  createTrick,
  addTrickToPuppy,
  getOwnersAndPuppies
}
