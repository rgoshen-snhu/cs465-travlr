const port = process.env.PORT ?? 3000;
const newsEndpoint = `http://localhost:${port}/api/news`;
const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };

/* GET news view */
const news = async function (req, res) {
  let message = null;
  let latestNews = [];
  let vacationTips = [];
  let featured = null;

  try {
    const [latestRes, tipsRes, featuredRes] = await Promise.all([
      fetch(`${newsEndpoint}?type=latestNews`, options),
      fetch(`${newsEndpoint}?type=vacationTips`, options),
      fetch(`${newsEndpoint}?type=featured`, options),
    ]);

    if (latestRes.ok) latestNews = await latestRes.json();
    if (tipsRes.ok) vacationTips = await tipsRes.json();
    if (featuredRes.ok) {
      const featuredArr = await featuredRes.json();
      if (Array.isArray(featuredArr) && featuredArr.length > 0) {
        const f = featuredArr[0];
        // Map publishedAt -> date to match the HBS template expectation
        featured = { ...f, date: f.publishedAt ? new Date(f.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '' };
      }
    }

    if (!latestNews.length && !vacationTips.length && !featured) {
      message = 'No news articles found in our database!';
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    message = 'Unable to load news at this time.';
  }

  res.render('news', { title: 'Travlr Getaways - News', navPage: 'news', latestNews, vacationTips, featured, message });
};

module.exports = { news };
