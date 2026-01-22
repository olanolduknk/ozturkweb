import axios from 'axios';

const USER_ID = '1442201028048060529';

export default async function Me(req, res) {
    try {
        const r = await axios.get(`https://api.lanyard.rest/v1/users/${USER_ID}`, {
            timeout: 8000,
            headers: { 'User-Agent': 'ozturkweb' },
        });

        const d = r?.data?.data;

        if (!d || !d.discord_user) {
            return res.json({});
        }

        // Frontend'in zaten kullandığı alanları koruyoruz + yeni alanlar ekliyoruz
        return res.json({
            id: d.discord_user.id,
            avatar: d.discord_user.avatar,
            username: d.discord_user.username,
            discriminator: d.discord_user.discriminator,
            status: d.discord_status || 'offline',

            // Lanyard extras (Activities kartı için)
            spotify: d.spotify || null,
            listening_to_spotify: !!d.listening_to_spotify,
            activities: Array.isArray(d.activities) ? d.activities : [],
        });
    } catch (e) {
        return res.json({});
    }
}
