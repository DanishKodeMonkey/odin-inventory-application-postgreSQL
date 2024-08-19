const pool = require('./pool');

const initTables = async () => {
    const client = await pool.connect();
    try {
        console.log('Starting population operation...');
        await client.query('BEGIN');

        console.log('Trying to create and populate "categories" table...');
        // create categories table
        await client.query(`
            CREATE TABLE IF NOT EXISTS categories(
            id SERIAL PRIMARY KEY, 
            title VARCHAR(50) NOT NULL UNIQUE, 
            description VARCHAR(200) NOT NULL
            );
            `);

        console.log('Categories table created successfully...');
        console.log('Attempting to create and populate items table...');
        // create items table
        await client.query(`
            CREATE TABLE IF NOT EXISTS items(
            id SERIAL PRIMARY KEY, 
            name VARCHAR(255) NOT NULL UNIQUE, 
            description TEXT,
            price NUMERIC(10, 2) NOT NULL,
            numberInStock NUMERIC(4) NOT NULL
            );
            `);

        console.log('Items table created successfully...');
        console.log(
            'Attempting to create JOIN table between categories and items...'
        );
        await client.query(`
            CREATE TABLE IF NOT EXISTS item_categories(
            item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
            category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
            PRIMARY KEY(item_id, category_id)
            )
            `);
        console.log('JOIN table established successfully...');
        console.log('Committing changes to database...');
        await client.query('COMMIT');
        console.log('All tables created successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating tables, rolling back...', err);
    } finally {
        client.release();
        console.log('Population operation ended...');
    }
};

initTables();
