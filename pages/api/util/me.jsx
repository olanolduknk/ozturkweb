import axios from "axios";

export default async function handler(req, res) {
  const DISCORD_ID = process.env.DISCORD_ID || "1442201028048060529";

  try {
    const r = await axios.get(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const payload = r.data;

    if (!payload?.success) return res.status(502).json({});

    const d = payload.data;
    const u = d.discord_user || {};

    const status = d.discord_status || "offline";
    const avatarHash = u.avatar || null;

    // CDN avatar fallback (Discord default avatar)
    const discNum = Number(u.discriminator || 0);
    const defaultAvatar = `https://cdn.discordapp.com/embed/avatars/${discNum % 5}.png`;

    const avatarUrl = avatarHash
      ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.png?size=4096`
      : defaultAvatar;

    return res.json({
      id: DISCORD_ID,
      username: u.username || "Unknown",
      discriminator: u.discriminator || "0000",
      status, // online / idle / dnd / offline
      avatar: avatarHash,
      avatar_url: avatarUrl,

      listening_to_spotify: !!d.listening_to_spotify,
      spotify: d.spotify || null, // { song, artist, album, album_art_url, track_id }
    });
  } catch (e) {
    return res.status(502).json({});
  }
}
