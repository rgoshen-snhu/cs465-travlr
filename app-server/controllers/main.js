const port = process.env.PORT ?? 3000;
const homeEndpoint = `http://localhost:${port}/api/home`;
const newsEndpoint = `http://localhost:${port}/api/news`;
const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };

/* GET homepage */
const index = async function (req, res) {
  let message = null;
  let hero = {};
  let testimonial = {};
  let sidebar = [];
  let blogPosts = [];

  try {
    const [homeRes, newsRes] = await Promise.all([
      fetch(homeEndpoint, options),
      fetch(`${newsEndpoint}?type=latestNews`, options),
    ]);

    if (homeRes.ok) {
      const home = await homeRes.json();
      hero = home.hero || {};
      testimonial = home.testimonial || {};
      sidebar = home.sidebar || [];
    } else {
      message = 'Unable to load home content.';
    }

    if (newsRes.ok) {
      const latestNews = await newsRes.json();
      // Map publishedAt -> date to match the HBS template expectation; take first 2
      blogPosts = latestNews.slice(0, 2).map((a) => ({
        ...a,
        date: a.publishedAt
          ? new Date(a.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : '',
      }));
    }
  } catch (error) {
    console.error('Error fetching home content:', error);
    message = 'Unable to load page content at this time.';
  }

  res.render('index', { title: 'Travlr Getaways', navPage: 'home', hero, blogPosts, testimonial, sidebar, message });
};

module.exports = { index };
