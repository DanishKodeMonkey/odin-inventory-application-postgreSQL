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
        LEFT JOIN item_categories ON categories.id = item_categories.category_id
        LEFT JOIN items ON item_categories.item_id = items.id
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
        const query = `
       SELECT items.*, 
       COALESCE(json_agg(categories.*) FILTER(WHERE categories.id IS NOT NULL), '[]') AS categories
       FROM items
       LEFT JOIN item_categories ON items.id = item_categories.item_id
       LEFT JOIN categories ON item_categories.category_id = categories.id
       GROUP BY items.id
       ORDER BY items.name ASC
       `;
        const { rows } = await pool.query(query);
        return rows;
    },

    getItemById: async (itemId) => {
        const query = `
    SELECT items.*, 
    COALESCE(json_agg(categories.*) FILTER(WHERE categories.id IS NOT NULL), '[]') AS categories 
    FROM items
    LEFT JOIN item_categories ON items.id = item_categories.item_id
    LEFT JOIN categories ON item_categories.category_id = categories.id
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
    INSERT INTO items(name, description, price, numberInStock) 
    VALUES($1, $2, $3, $4) 
    ON CONFLICT(name) DO NOTHING
    RETURNING id`;
        const values = [
            item.name,
            item.description,
            item.price,
            item.numberInStock,
        ];

        try {
            const { rows } = await pool.query(query, values);
            const itemId = rows[0].id;

            // add relation to category through JOIN table
            if (item.categoryIds && item.categoryIds.length > 0) {
                await addCategoryToItem(itemId, item.categoryIds);
            }

            // return new item id
            return { id: itemId };
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },

    updateItemById: async (id, item) => {
        const query = `
    UPDATE items
    SET name = $1, description = $3, price = $4, numberInStock = $5
    WHERE id = $6 
    RETURNING id
    `;
        const values = [
            item.name,
            item.description,
            item.price,
            item.numberInStock,
            id,
        ];

        try {
            const { rows } = await pool.query(query, values);
            const itemId = rows[0].id;
            // update item relation to categories in item_categories table

            await updateItemCategories(itemId, item.categoryIds || []);
            return { id: itemId }; // return updated items id
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },

    deleteItemById: async (itemId) => {
        const query = 'DELETE FROM items WHERE id = $1';
        const values = [itemId];

        try {
            await clearCategoriesFromItem(itemId);
            const { rowCount } = await pool.query(query, values);
            return rowCount;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    },
};

/* Relation operations */
// On new item
const addCategoryToItem = async (itemId, categoryIds) => {
    const query = `
    INSERT INTO item_categories(item_id, category_id)
    VALUES($1, $2)
    ON CONFLICT (item_id, category_id) DO NOTHING
    RETURNING *
    `;

    const promises = categoryIds.map((categoryId) =>
        pool.query(query, [itemId, categoryId])
    );
    return Promise.all(promises);
};

// on delete item
const removeCategoryFromItem = async (itemId, categoryId) => {
    const query =
        'DELETE FROM item_categories WHERE item_id = $1 AND category_id = $2';
    const values = [itemId, categoryId];

    try {
        const { rowCount } = await pool.query(query, values);
        return rowCount;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// on update item
const clearCategoriesFromItem = async (itemId) => {
    const query = 'DELETE FROM item_categories WHERE item_id = $1';
    const values = [itemId];

    try {
        const { rowCount } = await pool.query(query, values);
        return rowCount;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};
const updateItemCategories = async (itemId, categoryIds) => {
    // Clear existing associations
    await clearCategoriesFromItem(itemId);

    // Add new associations
    if (categoryIds && categoryIds.length > 0) {
        const promises = categoryIds.map((categoryId) =>
            addCategoryToItem(itemId, categoryId)
        );
        return Promise.all(promises);
    }
};
module.exports = {
    indexQueries,
    categoryQueries,
    itemQueries,
};
