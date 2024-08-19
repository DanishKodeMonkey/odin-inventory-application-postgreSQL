const pool = require('./pool');

const populateData = async () => {
    const client = await pool.connect();
    try {
        console.log('Starting table data population operation...');
        await client.query('BEGIN');

        console.log('Inserting categories...');
        const categories = [
            { title: 'Electronics', description: 'Devices and gadgets' },
            { title: 'Groceries', description: 'Everyday food items' },
            { title: 'Clothing', description: 'Apparel and accessories' },
        ];

        const categoryIds = {};
        for (let category of categories) {
            const result = await client.query(
                `INSERT INTO categories(title, description) VALUES($1, $2) ON CONFLICT(title) DO NOTHING RETURNING id`,
                [category.title, category.description]
            );
            const categoryId = result.rows[0]?.id;
            categoryIds[category.title] = categoryId;
        }
        console.log('Categories table populated successfully...');
        console.log('Inserting items...');
        // array of sample items to parse into new table
        // Thanks chatGPT for generating a bunch of these!
        const items = [
            // Electronics
            {
                name: 'Laptop',
                description: 'A powerful gaming laptop hosting Linux!',
                price: 555.99, // Numeric value
                numberInStock: 9, // Integer value
                categories: ['Electronics'],
            },
            {
                name: 'Smartphone',
                description:
                    'Latest model with 5G connectivity and 128GB storage.',
                price: 699.99, // Numeric value
                numberInStock: 15, // Integer value
                categories: ['Electronics'],
            },
            {
                name: 'Bluetooth Headphones',
                description:
                    'Noise-cancelling over-ear headphones with long battery life.',
                price: 199.99, // Numeric value
                numberInStock: 30, // Integer value
                categories: ['Electronics', 'Clothing'],
            },
            {
                name: 'Smartwatch',
                description:
                    'Wearable device with fitness tracking and mobile notifications.',
                price: 149.99, // Numeric value
                numberInStock: 25, // Integer value
                categories: ['Electronics'],
            },
            {
                name: '4K TV',
                description: '55-inch 4K Ultra HD Smart LED TV with HDR.',
                price: 799.99, // Numeric value
                numberInStock: 10, // Integer value
                categories: ['Electronics'],
            },
            {
                name: 'Gaming Console',
                description: 'Next-gen gaming console with 1TB storage.',
                price: 499.99, // Numeric value
                numberInStock: 20, // Integer value
                categories: ['Electronics'],
            },
            {
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with adjustable DPI.',
                price: 29.99, // Numeric value
                numberInStock: 50, // Integer value
                categories: ['Electronics'],
            },
            {
                name: 'External Hard Drive',
                description: '2TB USB 3.0 portable external hard drive.',
                price: 89.99, // Numeric value
                numberInStock: 40, // Integer value
                categories: ['Electronics'],
            },
            {
                name: 'Tablet',
                description:
                    '10-inch tablet with 64GB storage and Wi-Fi connectivity.',
                price: 329.99, // Numeric value
                numberInStock: 18, // Integer value
                categories: ['Electronics'],
            },
            {
                name: 'Digital Camera',
                description:
                    'Mirrorless digital camera with 24MP sensor and 4K video recording.',
                price: 999.99, // Numeric value
                numberInStock: 12, // Integer value
                categories: ['Electronics'],
            },

            // Groceries
            {
                name: 'Milk',
                description: '1 gallon of organic whole milk.',
                price: 3.99, // Numeric value
                numberInStock: 100, // Integer value
                categories: ['Groceries'],
            },
            {
                name: 'Bread',
                description: 'Whole wheat sandwich bread, 1 loaf.',
                price: 2.49, // Numeric value
                numberInStock: 75, // Integer value
                categories: ['Groceries'],
            },
            {
                name: 'Eggs',
                description: '12 large grade-A eggs.',
                price: 2.99, // Numeric value
                numberInStock: 60, // Integer value
                categories: ['Groceries'],
            },
            {
                name: 'Bananas',
                description: '1 pound of ripe bananas.',
                price: 0.99, // Numeric value
                numberInStock: 200, // Integer value
                categories: ['Groceries'],
            },
            {
                name: 'Chicken Breast',
                description: 'Boneless, skinless chicken breasts, 1 pound.',
                price: 6.99, // Numeric value
                numberInStock: 50, // Integer value
                categories: ['Groceries'],
            },
            {
                name: 'Rice',
                description: '5-pound bag of long grain white rice.',
                price: 4.99, // Numeric value
                numberInStock: 40, // Integer value
                categories: ['Groceries'],
            },
            {
                name: 'Pasta',
                description: '1-pound box of spaghetti.',
                price: 1.49, // Numeric value
                numberInStock: 80, // Integer value
                categories: ['Groceries'],
            },
            {
                name: 'Tomato Sauce',
                description: '24 oz jar of marinara sauce.',
                price: 3.49, // Numeric value
                numberInStock: 45, // Integer value
                categories: ['Groceries'],
            },
            {
                name: 'Apples',
                description: '1 pound of red delicious apples.',
                price: 1.49, // Numeric value
                numberInStock: 120, // Integer value
                categories: ['Groceries'],
            },
            {
                name: 'Orange Juice',
                description: '64 oz bottle of 100% orange juice, no pulp.',
                price: 4.99, // Numeric value
                numberInStock: 30, // Integer value
                categories: ['Groceries'],
            },

            // Clothing
            {
                name: 'T-Shirt',
                description:
                    '100% cotton t-shirt, available in various colors.',
                price: 14.99, // Numeric value
                numberInStock: 60, // Integer value
                categories: ['Clothing'],
            },
            {
                name: 'Jeans',
                description: 'Classic fit denim jeans.',
                price: 39.99, // Numeric value
                numberInStock: 40, // Integer value
                categories: ['Clothing'],
            },
            {
                name: 'Sneakers',
                description:
                    'Comfortable running shoes available in multiple sizes.',
                price: 59.99, // Numeric value
                numberInStock: 35, // Integer value
                categories: ['Clothing'],
            },
            {
                name: 'Jacket',
                description: 'Water-resistant windbreaker jacket.',
                price: 79.99, // Numeric value
                numberInStock: 20, // Integer value
                categories: ['Clothing'],
            },
            {
                name: 'Socks',
                description: 'Pack of 6 pairs of athletic socks.',
                price: 9.99, // Numeric value
                numberInStock: 100, // Integer value
                categories: ['Clothing'],
            },
            {
                name: 'Hat',
                description: 'Adjustable baseball cap.',
                price: 19.99, // Numeric value
                numberInStock: 50, // Integer value
                categories: ['Clothing'],
            },
            {
                name: 'Scarf',
                description: 'Wool scarf available in various patterns.',
                price: 24.99, // Numeric value
                numberInStock: 25, // Integer value
                categories: ['Clothing'],
            },
            {
                name: 'Belt',
                description: 'Leather belt with a silver buckle.',
                price: 29.99, // Numeric value
                numberInStock: 45, // Integer value
                categories: ['Clothing'],
            },
            {
                name: 'Dress Shirt',
                description: 'Formal dress shirt made from breathable fabric.',
                price: 49.99, // Numeric value
                numberInStock: 30, // Integer value
                categories: ['Clothing'],
            },
            {
                name: 'Sweater',
                description: 'Cozy wool sweater, perfect for winter.',
                price: 59.99, // Numeric value
                numberInStock: 22, // Integer value
                categories: ['Clothing'],
            },
        ];
        const itemIds = {};
        for (let item of items) {
            const result = await client.query(
                `INSERT INTO items(name, description, price, numberInStock) VALUES($1, $2, $3, $4) ON CONFLICT(name) DO NOTHING RETURNING id`,
                [item.name, item.description, item.price, item.numberInStock]
            );
            const itemId = result.rows[0]?.id;
            itemIds[item.name] = itemId;
        }

        console.log('Items table populated successfully...');
        console.log('Insert item-category relationships to JOIN table');
        for (let item of items) {
            const itemId = itemIds[item.name];
            for (let category of item.categories) {
                const categoryId = categoryIds[category];
                if (categoryId) {
                    await client.query(
                        `
                        INSERT INTO item_categories(item_id, category_id) VALUES($1, $2) ON CONFLICT DO NOTHING
                        `,
                        [itemId, categoryId]
                    );
                }
            }
        }
        await client.query('COMMIT');
        console.log('Data population operation completed successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error populating data: ', err);
    } finally {
        client.release();
    }
};

populateData();
