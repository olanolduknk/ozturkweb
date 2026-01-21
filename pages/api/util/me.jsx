import axios from "axios";

export default async function handler(req, res) {
  const DISCORD_ID = process.env.DISCORD_ID || "245511350724329473";

  try {
    const r = await axios.get(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const payload = r.data;

    if (!payload?.success) return res.status(502).json({});

    const d = payload.data;
    const u = d.discord_user || {};

    const status = d.discord_status || "offline";
    const avatarHash = u.avatar || null;

    const discNum = Number(u.discriminator || 0);
    const defaultAvatar = `https://cdn.discordapp.com/embed/avatars/${discNum % 5}.png`;

    const avatarUrl = avatarHash
      ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.png?size=4096`
      : defaultAvatar;

    res.json({
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
    res.status(502).json({});
  }
}
