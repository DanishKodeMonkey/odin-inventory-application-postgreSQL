#! /usr/bin/env node

console.log(
    'This script populates stuff to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require('./models/category');
const Item = require('./models/item');

const categories = [];
const items = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch(err => console.log(err));

async function main() {
    console.log('Debug: About to connect');
    await mongoose.connect(mongoDB);
    console.log('Debug: Should be connected?');
    await createCategories();
    await createItems();
    console.log('Debug: Closing mongoose');
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, title, description) {
    const category = new Category({
        title: title,
        description: description,
    });
    await category.save();
    categories[index] = category;
    console.log(`Added Category: ${title}`);
}

async function itemCreate(
    index,
    name,
    category,
    description,
    price,
    numberInStock
) {
    const item = new Item({
        name: name,
        category: category,
        description: description,
        price: price,
        numberInStock: numberInStock,
    });

    await item.save();
    items[index] = item;
    console.log(`Added item: ${name} `);
}

async function createCategories() {
    console.log('Adding categories');
    await Promise.all([
        categoryCreate(
            0,
            'Electronics',
            'Devices and gadgets running on electricity'
        ),
        categoryCreate(1, 'Clothing', 'Items of style to gear up with'),
        categoryCreate(2, 'Accesories', 'Equipment to tackle the world'),
        categoryCreate(3, 'Furniture', 'stuff your home with this'),
        categoryCreate(4, 'cybernetics', 'so cool cyberpunk stuff'),
    ]);
}
async function createItems() {
    console.log('Adding Items');
    await Promise.all([
        itemCreate(
            0,
            'Gaming monitor',
            [categories[0]],
            'A truly epic gaming monitor with 20k resolution and 800hz refresh rate!',
            9999.0,
            8
        ),
        itemCreate(
            1,
            'danish Kode Monkey shirt',
            [categories[1]],
            'This one of a kind DKM shirt for all the fans out there!',
            58.0,
            50
        ),
        itemCreate(
            2,
            'hackerMan boots',
            [categories[1], categories[3]],
            'Protect them footsies in style with these sick hacker boots!',
            73.5,
            45
        ),
        itemCreate(
            3,
            'Wrist computer',
            [categories[0], categories[3]],
            'Hack the planets from this incredibly powerful wrist computer!',
            12183.1,
            1
        ),
        itemCreate(
            4,
            '1337c0deH4x0rz',
            [categories[1]],
            'hack tHe Pl4n3t!',
            1.5,
            999
        ),
        itemCreate(
            5,
            '1337c0deH4x0rz',
            [categories[1]],
            'hack tHe Pl4n3t!',
            1.5,
            999
        ),
        itemCreate(
            6,
            'Quantum Gaming Keyboard',
            [categories[0]],
            'Experience gaming in a new dimension with this quantum-powered keyboard!',
            299.99,
            15
        ),

        // Thanks chatGPT for creating these amazing items!
        itemCreate(
            7,
            'VR Gaming Chair',
            [categories[0], categories[3]],
            'Immerse yourself in virtual reality while sitting comfortably in this advanced gaming chair!',
            799.0,
            5
        ),
        itemCreate(
            8,
            'Cybernetic Arm Enhancement',
            [categories[4]],
            'Upgrade your gaming skills with this cybernetic arm enhancement, precision guaranteed!',
            2499.99,
            2
        ),
        itemCreate(
            9,
            'Nanotech Gaming Mouse',
            [categories[0]],
            'Navigate your virtual worlds with unparalleled precision using this nanotechnology-infused gaming mouse!',
            149.5,
            20
        ),
        itemCreate(
            10,
            'Quantum-Entangled Headset',
            [categories[0], categories[2]],
            'Communicate with your teammates across infinite distances with this quantum-entangled headset!',
            499.0,
            10
        ),
        itemCreate(
            11,
            'Hacker Hoodie',
            [categories[1]],
            'Stay cozy and stylish with this hacker-themed hoodie, perfect for late-night coding sessions!',
            79.99,
            30
        ),
        itemCreate(
            12,
            'Encryption Glasses',
            [categories[1], categories[3]],
            'Protect your eyes from digital glare while looking cool in these encryption glasses!',
            129.0,
            25
        ),
        itemCreate(
            13,
            'Neural Interface Gloves',
            [categories[2]],
            'Control your devices with a thought using these neural interface gloves, the future of user interaction!',
            899.99,
            3
        ),
        itemCreate(
            14,
            'Quantum Backpack',
            [categories[1]],
            'Carry your gear in style with this quantum-entangled backpack, offering infinite storage possibilities!',
            199.0,
            12
        ),
        itemCreate(
            15,
            'Cybernetic Leg Augmentation',
            [categories[4]],
            'Enhance your mobility and agility with these cybernetic leg augmentations, built for extreme gaming!',
            3499.99,
            1
        ),
    ]);
}
