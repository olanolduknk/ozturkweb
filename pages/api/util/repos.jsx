export default async function handler(req, res) {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  try {
    const r = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "ozturkweb"
      }
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({
        ok: false,
        error: "github_http_error",
        http_status: r.status,
        detail: data,
        repos: []
      });
    }

    res.status(200).json({
      ok: true,
      repos: data
    });

  } catch (err) {
    res.status(500).json({
      ok: false,
      error: "fetch_failed",
      repos: []
    });
  }
}
