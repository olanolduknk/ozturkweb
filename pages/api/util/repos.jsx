export default async function handler(req, res) {
  const USERNAME = process.env.GITHUB_USERNAME || "olanolduknk";
  const TOKEN = process.env.GITHUB_TOKEN;
  const LIMIT = Math.max(1, Number(process.env.GITHUB_REPO_LIMIT || 6));

  if (!TOKEN) {
    return res.status(200).json({
      ok: false,
      error: "missing_env",
      missing: "GITHUB_TOKEN",
      repos: [],
    });
  }

  try {
    const r = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`,
      {
        headers: {
          accept: "application/vnd.github+json",
          "user-agent": "ozturkweb",
          authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return res.status(200).json({
        ok: false,
        error: "github_http_error",
        http_status: r.status,
        detail: detail.slice(0, 300),
        repos: [],
      });
    }

    const data = await r.json();

    if (!Array.isArray(data)) {
      return res.status(200).json({
        ok: false,
        error: "github_bad_payload",
        repos: [],
      });
    }

    // Eski tasarımın beklediği alanlar zaten GitHub objesinde var.
    // Sadece sayıyı ENV ile kontrol ediyoruz.
    return res.status(200).json({
      ok: true,
      repos: data.slice(0, LIMIT),
    });
  } catch (e) {
    return res.status(200).json({
      ok: false,
      error: "github_exception",
      message: String(e?.message || e),
      repos: [],
    });
  }
}
