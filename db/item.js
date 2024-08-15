const pool = require('./pool');

const initItemsTable = async () => {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('DONE');
    try {
        console.log('Attempting to create items table...');
        await client.query('BEGIN');

        // create items table
        await client.query(`
            CREATE TABLE IF NOT EXISTS items(
            id SERIAL PRIMARY KEY, 
            name VARCHAR(255) NOT NULL UNIQUE, 
            category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
            description TEXT,
            price NUMERIC(10, 2) NOT NULL,
            numberInStock NUMERIC(4) NOT NULL
            );
            `);
        // array of sample items to parse into new table
        // Thanks chatGPT for generating a bunch of these!
        const items = [
            // Electronics
            {
                name: 'Laptop',
                category_id: 1,
                description: 'A powerful gaming laptop hosting Linux!',
                price: '555.99',
                numberInStock: '9',
            },
            {
                name: 'Smartphone',
                category_id: 1,
                description:
                    'Latest model with 5G connectivity and 128GB storage.',
                price: '699.99',
                numberInStock: '15',
            },
            {
                name: 'Bluetooth Headphones',
                category_id: 1,
                description:
                    'Noise-cancelling over-ear headphones with long battery life.',
                price: '199.99',
                numberInStock: '30',
            },
            {
                name: 'Smartwatch',
                category_id: 1,
                description:
                    'Wearable device with fitness tracking and mobile notifications.',
                price: '149.99',
                numberInStock: '25',
            },
            {
                name: '4K TV',
                category_id: 1,
                description: '55-inch 4K Ultra HD Smart LED TV with HDR.',
                price: '799.99',
                numberInStock: '10',
            },
            {
                name: 'Gaming Console',
                category_id: 1,
                description: 'Next-gen gaming console with 1TB storage.',
                price: '499.99',
                numberInStock: '20',
            },
            {
                name: 'Wireless Mouse',
                category_id: 1,
                description: 'Ergonomic wireless mouse with adjustable DPI.',
                price: '29.99',
                numberInStock: '50',
            },
            {
                name: 'External Hard Drive',
                category_id: 1,
                description: '2TB USB 3.0 portable external hard drive.',
                price: '89.99',
                numberInStock: '40',
            },
            {
                name: 'Tablet',
                category_id: 1,
                description:
                    '10-inch tablet with 64GB storage and Wi-Fi connectivity.',
                price: '329.99',
                numberInStock: '18',
            },
            {
                name: 'Digital Camera',
                category_id: 1,
                description:
                    'Mirrorless digital camera with 24MP sensor and 4K video recording.',
                price: '999.99',
                numberInStock: '12',
            },

            // Groceries
            {
                name: 'Milk',
                category_id: 2,
                description: '1 gallon of organic whole milk.',
                price: '3.99',
                numberInStock: '100',
            },
            {
                name: 'Bread',
                category_id: 2,
                description: 'Whole wheat sandwich bread, 1 loaf.',
                price: '2.49',
                numberInStock: '75',
            },
            {
                name: 'Eggs',
                category_id: 2,
                description: '12 large grade-A eggs.',
                price: '2.99',
                numberInStock: '60',
            },
            {
                name: 'Bananas',
                category_id: 2,
                description: '1 pound of ripe bananas.',
                price: '0.99',
                numberInStock: '200',
            },
            {
                name: 'Chicken Breast',
                category_id: 2,
                description: 'Boneless, skinless chicken breasts, 1 pound.',
                price: '6.99',
                numberInStock: '50',
            },
            {
                name: 'Rice',
                category_id: 2,
                description: '5-pound bag of long grain white rice.',
                price: '4.99',
                numberInStock: '40',
            },
            {
                name: 'Pasta',
                category_id: 2,
                description: '1-pound box of spaghetti.',
                price: '1.49',
                numberInStock: '80',
            },
            {
                name: 'Tomato Sauce',
                category_id: 2,
                description: '24 oz jar of marinara sauce.',
                price: '3.49',
                numberInStock: '45',
            },
            {
                name: 'Apples',
                category_id: 2,
                description: '1 pound of red delicious apples.',
                price: '1.49',
                numberInStock: '120',
            },
            {
                name: 'Orange Juice',
                category_id: 2,
                description: '64 oz bottle of 100% orange juice, no pulp.',
                price: '4.99',
                numberInStock: '30',
            },

            // Clothing
            {
                name: 'T-Shirt',
                category_id: 3,
                description:
                    '100% cotton t-shirt, available in various colors.',
                price: '14.99',
                numberInStock: '60',
            },
            {
                name: 'Jeans',
                category_id: 3,
                description: 'Classic fit denim jeans.',
                price: '39.99',
                numberInStock: '40',
            },
            {
                name: 'Sneakers',
                category_id: 3,
                description:
                    'Comfortable running shoes available in multiple sizes.',
                price: '59.99',
                numberInStock: '35',
            },
            {
                name: 'Jacket',
                category_id: 3,
                description: 'Water-resistant windbreaker jacket.',
                price: '79.99',
                numberInStock: '20',
            },
            {
                name: 'Socks',
                category_id: 3,
                description: 'Pack of 6 pairs of athletic socks.',
                price: '9.99',
                numberInStock: '100',
            },
            {
                name: 'Hat',
                category_id: 3,
                description: 'Adjustable baseball cap.',
                price: '19.99',
                numberInStock: '50',
            },
            {
                name: 'Scarf',
                category_id: 3,
                description: 'Wool scarf available in various patterns.',
                price: '24.99',
                numberInStock: '25',
            },
            {
                name: 'Belt',
                category_id: 3,
                description: 'Leather belt with a silver buckle.',
                price: '29.99',
                numberInStock: '45',
            },
            {
                name: 'Dress Shirt',
                category_id: 3,
                description: 'Formal dress shirt made from breathable fabric.',
                price: '49.99',
                numberInStock: '30',
            },
            {
                name: 'Sweater',
                category_id: 3,
                description: 'Cozy wool sweater, perfect for winter.',
                price: '59.99',
                numberInStock: '22',
            },
        ];

        for (let item of items) {
            await client.query(
                `INSERT INTO items(name, category_id, description, price, numberInStock) VALUES($1, $2, $3, $4, $5) ON CONFLICT(name) DO NOTHING`,
                [
                    item.name,
                    item.category_id,
                    item.description,
                    item.price,
                    item.numberInStock,
                ]
            );
        }
        await client.query('COMMIT');
        console.log('Items table created and populated successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating or populating the Items table: ', err);
    } finally {
        client.release();
        await pool.end();
    }
};

initItemsTable();
/* module.exports = initItemsTable; */
