const mongoose = require('./db');
const Trip = require('./travlr');
const Room = require('./room');
const Meal = require('./meal');
const NewsArticle = require('./newsarticle');
const HomeContent = require('./homecontent');

const fs = require('fs');

const tripData = JSON.parse(fs.readFileSync('./data/trips.json', 'utf-8'));
const roomData = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf-8'));
const mealData = JSON.parse(fs.readFileSync('./data/meals.json', 'utf-8'));
const newsData = JSON.parse(fs.readFileSync('./data/news.json', 'utf-8'));
const homeData = JSON.parse(fs.readFileSync('./data/home.json', 'utf-8'));

// Normalize the nested news JSON into a flat array of NewsArticle documents.
const buildNewsArticles = (news) => {
    const articles = [];

    (news.latestNews || []).forEach((item) => {
        articles.push({
            articleType: 'latestNews',
            title: item.title,
            excerpt: item.excerpt || null,
            url: item.url || null,
            publishedAt: item.date ? new Date(item.date) : null,
        });
    });

    (news.vacationTips || []).forEach((item) => {
        articles.push({
            articleType: 'vacationTips',
            title: item.title,
            url: item.url || null,
        });
    });

    if (news.featured) {
        const f = news.featured;
        articles.push({
            articleType: 'featured',
            title: f.title,
            image: f.image || null,
            body: Array.isArray(f.body) ? f.body : [f.body],
            publishedAt: f.date ? new Date(f.date) : null,
            author: f.author || null,
        });
    }

    return articles;
};

const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(tripData);
    console.log('Trips seeded');

    await Room.deleteMany({});
    await Room.insertMany(roomData);
    console.log('Rooms seeded');

    await Meal.deleteMany({});
    await Meal.insertMany(mealData);
    console.log('Meals seeded');

    await NewsArticle.deleteMany({});
    await NewsArticle.insertMany(buildNewsArticles(newsData));
    console.log('NewsArticles seeded');

    await HomeContent.deleteMany({});
    await HomeContent.insertMany([homeData]);
    console.log('HomeContent seeded');

    console.log('Database seeded!');
};

seedDB().then(() => {
    mongoose.connection.close();
    process.exit(0);
});
