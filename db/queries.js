const pool = require('./pool');

/* Counts for index */
const indexQueries = {
    getItemCount: async () => {
        const query = 'SELECT COUNT(*) FROM items';
        const { rows } = await pool.query(query);
        return parseInt(rows[0].count, 10);
    },

    getCategoryCount: async () => {
        const query = 'SELECT COUNT(*) FROM categories';
        const { rows } = await pool.query(query);
        return parseInt(rows[0].count, 10);
    },
};

/* Categories */
const categoryQueries = {
    getAllCategories: async () => {
        const { rows } = await pool.query(
            `SELECT * FROM categories ORDER BY title ASC`
        );
        return rows;
    },

    getCategoryById: async (categoryId) => {
        const query = 'SELECT title, description FROM categories WHERE id = $1';
        const values = [categoryId];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },

    createCategory: async (category) => {
        const query =
            'INSERT INTO categories(title, description) VALUES ($1, $2) RETURNING *';
        const values = [category.title, category.description];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },

    updateCategoryById: async (id, category) => {
        const query =
            'UPDATE categories SET title = $2, description = $3 WHERE id = $1 RETURNING *';
        const values = [id, category.title, category.description];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },

    deleteCategoryById: async (categoryId) => {
        const query = 'DELETE FROM categories WHERE id = $1';
        const values = [categoryId];

        try {
            const { rowCount } = await pool.query(query, values);
            return rowCount;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },

    getCategoryByIdWithItems: async (categoryId) => {
        const query = `
        SELECT categories.*, 
        COALESCE(json_agg(items.*) FILTER(WHERE items.id IS NOT NULL), '[]') AS items
        FROM categories 
        LEFT JOIN items ON categories.id = items.category_id 
        WHERE categories.id = $1
        GROUP BY categories.id
        `;
        const values = [categoryId];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },
};

/* Items */
const itemQueries = {
    getAllItems: async () => {
        const { rows } = await pool.query(
            `SELECT * FROM items ORDER BY name ASC`
        );
        return rows;
    },

    getItemById: async (itemId) => {
        const query = `
    SELECT items.*, COALESCE(json_agg(categories.*) FILTER(WHERE categories.id IS NOT NULL), '[]') AS categories 
    FROM items
    LEFT JOIN UNNEST(items.category_ids) AS category_id ON category_id = categories.id
    WHERE items.id = $1
    GROUP BY items.id
    `;
        const values = [itemId];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },

    createItem: async (item) => {
        const query = `
    INSERT INTO items(name, category_ids, description, price, numberInStock) 
    VALUES($1, $2, $3, $4, $5) 
    ON CONFLICT(name) DO NOTHING
    RETURNING *`;
        const values = [
            item.name,
            item.category_ids,
            item.description,
            item.price,
            item.numberInStock,
        ];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },

    updateItemById: async (id, item) => {
        const query = `
    UPDATE items
    SET name = $1, category_ids = $2, description = $3, price = $4, numberInStock = $5
    WHERE id = $6 
    RETURNING *
    `;
        const values = [
            item.name,
            item.category_ids,
            item.description,
            item.price,
            item.numberInStock,
            id,
        ];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },

    deleteItemById: async (itemId) => {
        const query = 'DELETE FROM items WHERE id = $1';
        const values = [itemId];

        try {
            const { rowCount } = await pool.query(query, values);
            return rowCount;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },
};

module.exports = {
    indexQueries,
    categoryQueries,
    itemQueries,
};
