// Database songs

/** Work in progress to move all DB songs query
 * Separation of task
 */

const db = require('../connection');

// const create = async (song: string) => {
//   const queryString = 'INSERT INTO songs (song_api_id, likes, created_at updated_at) VALUES ($1, $2, $3, $4) ON CONFLICT (song_api_id) DO NOTHING RETURNING *;';
  
//   const values = [song.id, song.likes, song.now(), song.now()];
// }
//   console.log("Attempting to insert song with ID:", song);

//   try {
//     // Insert song into the database
//     const query = `
//       INSERT INTO songs (song_api_id, likes, created_at, updated_at)
//       VALUES ($1, 0, NOW(), NOW())
//       ON CONFLICT (song_api_id) DO NOTHING
//     `;

//     // Use the songApiId as a parameter to prevent SQL injection
//     await db.query(query, [song]);

//     console.log(`Successfully inserted. The ID: ${songApiId}`);
//   } catch (error) {
//     console.error("Sorry, Error inserting:", error);
//   }
// };

const getAllSongs = () => {
  return db.query('SELECT * FROM songs;')
           .then((response: { rows: any[]; }) => {
            return response.rows[0]; })
           .catch((error: { message: any; }) => console.log("Error getting all songs: ", error.message));
};

const deleteAllSongs = async () => {
  const client = await db;

  try {
    // Start a transaction
    await client.query('BEGIN');
    await client.query('DELETE FROM songs');

    // Reset the auto-increment sequence (id)
    await client.query('TRUNCATE TABLE songs RESTART IDENTITY');
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log("All songs deleted and sequence reset.");
  } catch (error) {
    // In case of an error, rollback the transaction
    await client.query('ROLLBACK');
    console.error('Error deleting songs:', error);
  } finally {
    client.release();
  }
};

