function cleanToken(t) {
  if (!t) return "";
  // Tırnak/boşluk/newline temizle
  return String(t).trim().replace(/^["']|["']$/g, "");
}

export default async function handler(req, res) {
  const USERNAME = (process.env.GITHUB_USERNAME || "olanolduknk").trim();
  const LIMIT = Math.max(1, Number(process.env.GITHUB_REPO_LIMIT || 6));

  const TOKEN = cleanToken(process.env.GITHUB_TOKEN);

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
          // GitHub REST için en stabil format:
          authorization: `token ${TOKEN}`,
        },
      }
    );

    const text = await r.text().catch(() => "");

    if (!r.ok) {
      // 401 ise "Bad credentials" görünsün diye detail'ı geçiriyoruz
      return res.status(200).json({
        ok: false,
        error: "github_http_error",
        http_status: r.status,
        detail: text.slice(0, 400),
        repos: [],
      });
    }

    const data = JSON.parse(text);

    if (!Array.isArray(data)) {
      return res.status(200).json({
        ok: false,
        error: "github_bad_payload",
        detail: text.slice(0, 200),
        repos: [],
      });
    }

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
