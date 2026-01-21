export default async function handler(req, res) {
  const DISCORD_ID = "1442201028048060529";

  try {
    const r = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, {
      headers: { "accept": "application/json" },
    });

    if (!r.ok) {
      return res.status(502).json({ error: "lanyard_http_error", status: r.status });
    }

    const payload = await r.json();

    if (!payload?.success || !payload?.data) {
      return res.status(502).json({ error: "lanyard_bad_payload", payload });
    }

    const d = payload.data;
    const u = d.discord_user || {};

    const status = d.discord_status || "offline";
    const avatarHash = u.avatar || null;

    const discNum = Number(u.discriminator || 0);
    const defaultAvatar = `https://cdn.discordapp.com/embed/avatars/${discNum % 5}.png`;

    const avatarUrl = avatarHash
      ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.png?size=4096`
      : defaultAvatar;

    return res.status(200).json({
      id: DISCORD_ID,
      username: u.username || "Unknown",
      discriminator: u.discriminator || "0000",
      status,
      avatar: avatarHash,
      avatar_url: avatarUrl,
      listening_to_spotify: !!d.listening_to_spotify,
      spotify: d.spotify || null,
    });
  } catch (e) {
    return res.status(502).json({ error: "lanyard_exception", message: String(e?.message || e) });
  }
}
