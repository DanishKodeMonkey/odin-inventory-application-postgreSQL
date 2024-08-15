const pool = require('./pool');

/* Categories */
async function getAllCategories() {
    const { rows } = await pool.query(
        `SELECT * FROM categories ORDER BY title ASC`
    );
    return rows;
}

async function getCategoryById(categoryId) {
    const query = 'SELECT title, description FROM categories WHERE id = $1';
    const values = [categoryId];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

async function createCategory(category) {
    const query =
        'INSERT INTO categories(title, description) VALUES ($1, $2) RETURNING *';
    const values = [category.title, category.description];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

async function updateCategoryById(id, category) {
    const query =
        'UPDATE categories SET title = $2, description = $3 WHERE id = $1 RETURNING *';
    const values = [id, category.title, category.description];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

async function deleteCategoryById(categoryId) {
    const query = 'DELETE from categories WHERE id=$1';
    const values = [categoryId];

    try {
        const res = await pool.query(query, values);
        return res.rowCount;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

async function getCategoryByIdWithItems(categoryId) {
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
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategoryById,
    deleteCategoryById,
    getCategoryByIdWithItems,
};
