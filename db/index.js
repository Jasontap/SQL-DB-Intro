const { Client } = require("pg");
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const client = new Client({ connectionString });

// ============= DATABASE ADAPTERS ========================
async function createUser(user) {
  const { username, age, email, password } = user;

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users (username, age, email, password)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `,
      [username, age, email, password]
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
      SELECT users.username AS "ownerName", puppies.name AS "petName"
      FROM puppies
      INNER JOIN users ON puppies."ownerId" = users.id;
    `)
    
    return rows;
  } catch(ex) {
    console.log("ERROR GETTING OWNERS AND PUPPIES");
    console.log(ex);
  }
}

async function getAllPuppies() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM puppies;
    `)
    
    return rows;
  } catch(ex) {
    console.log('ERROR GETTING ALL PUPPIES');
    console.log(ex);
  }
}

async function getAllUsers() {
  try {
    const {rows} = await client.query(`
      SELECT * FROM users;
    `)
    
    return rows;
  } catch(ex) {
    console.log('ERROR GETTING ALL USERS');
    console.log(ex);
  }
}

async function getSingleUser(username, password) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT * FROM users
      WHERE username = $1;
    `, [username]);
    
    if (user.password === password) {
      delete user.password;
      return {
        error: false, 
        user, 
        message: 'User details are correct.'
      }
    } else {
      return {
        error: true,
        message: 'Incorrect credentials.'
      }
    }
  } catch(ex) {
    console.log("ERROR GETTING SINGLE USER");
    console.log(ex);
  }
};

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT * FROM users
      WHERE id = $1;
    `, [userId] );
    
    if (user) {
      delete user.password;
      return {
        error: false,
        user,
        message: "User details are correct.",
      };
    } else {
      return {
        error: true,
        message: "Incorrect credentials.",
      };
    }
  } catch(ex) {
    console.log('ERROR GETTING USER BY ID');
    console.log(ex);
  }
}

async function getPuppiesByOwnerId(ownerId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM puppies
      WHERE "ownerId" = $1;
    `, [ownerId]);
    
    return rows;
  } catch(ex) {
    console.log('ERROR GETTING PUPPIES BY OWNER ID');
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
  getOwnersAndPuppies,
  getAllPuppies,
  getAllUsers,
  getSingleUser,
  getUserById,
  getPuppiesByOwnerId
};
