const pool = require('./pool');

const initCategoriesTable = async () => {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('DONE');
    try {
        console.log('Attempting to create table...');
        await client.query('BEGIN');

        // create categories table
        await client.query(`
            CREATE TABLE IF NOT EXISTS categories(
            id SERIAL PRIMARY KEY, 
            title VARCHAR(50) NOT NULL UNIQUE, 
            description VARCHAR(200) NOT NULL
            );
            `);
        const categories = [
            { title: 'Electronics', description: 'Devices and gadgets' },
            { title: 'Groceries', description: 'Everyday food items' },
            { title: 'Clothing', description: 'Apparel and accessories' },
        ];

        for (let category of categories) {
            await client.query(
                `INSERT INTO categories(title, description) VALUES($1, $2) ON CONFLICT(title, description) DO NOTHING`,
                [category.title, category.description]
            );
        }
        await client.query('COMMIT');
        console.log('Categories table created and populated successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(
            'Error creating or populating the categories table: ',
            err
        );
    } finally {
        client.release();
        await pool.end();
    }
};

module.exports = initCategoriesTable;
