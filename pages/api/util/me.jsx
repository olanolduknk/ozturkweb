export default async function handler(req, res) {
  const DISCORD_ID = process.env.DISCORD_ID;

  if (!DISCORD_ID) {
    return res.status(200).json({ ok: false, error: "missing_env", missing: "DISCORD_ID" });
  }

  try {
    const r = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, {
      headers: { accept: "application/json" },
    });

    // Track edilmiyorsa / geçici problem varsa site çökmesin
    if (!r.ok) {
      return res.status(200).json({
        ok: false,
        error: "presence_unavailable",
        http_status: r.status,
        id: DISCORD_ID,
      });
    }

    const payload = await r.json();
    if (!payload?.success || !payload?.data) {
      return res.status(200).json({ ok: false, error: "bad_payload", id: DISCORD_ID });
    }

    const d = payload.data;
    const u = d.discord_user || {};

    const status = typeof d.discord_status === "string" ? d.discord_status : "offline";
    const avatarHash = u.avatar || null;

    const discNum = Number(u.discriminator || 0);
    const defaultAvatar = `https://cdn.discordapp.com/embed/avatars/${discNum % 5}.png`;

    const avatarUrl = avatarHash
      ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.png?size=4096`
      : defaultAvatar;

    return res.status(200).json({
      ok: true,
      id: DISCORD_ID,
      username: u.username || "Unknown",
      status,
      avatar_url: avatarUrl,
      listening_to_spotify: !!d.listening_to_spotify,
      spotify: d.spotify || null,
    });
  } catch (e) {
    return res.status(200).json({
      ok: false,
      error: "exception",
      message: String(e?.message || e),
      id: DISCORD_ID,
    });
  }
}
