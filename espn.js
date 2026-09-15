export default async function handler(req, res) {
  const { league = 'college', dates = '20260917-20260921' } = req.query || {};
  const path = league === 'nfl' ? 'football/nfl' : 'football/college-football';
  const groups = league === 'nfl' ? '' : '&groups=80';
  const url = `https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${encodeURIComponent(dates)}&limit=1000${groups}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const body = await response.text();
    res.status(response.status);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.send(body);
  } catch (err) {
    res.status(502).json({ error: 'ESPN proxy request failed', detail: String(err) });
  }
}
