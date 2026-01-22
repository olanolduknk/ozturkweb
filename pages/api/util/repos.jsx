import fetch from 'isomorphic-unfetch';

const GH_URL = 'https://api.github.com/users/olanolduknk/repos';

// Basit in-memory cache (Vercel/Serverless cold start’ta sıfırlanabilir, ama yine de çok işe yarar)
let CACHE = {
    etag: null,
    data: null,
    ts: 0,
};

// Kaç ms cache tutalım (ör: 15 dk)
const TTL_MS = 15 * 60 * 1000;

export default async function Repos(req, res) {
    try {
        // 1) TTL içindeysek cache’den dön
        const now = Date.now();
        if (CACHE.data && (now - CACHE.ts) < TTL_MS) {
            // CDN/Proxy’ye de anlat: bunu cache’leyebilirsin
            res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
            return res.status(200).json(CACHE.data);
        }

        // 2) GitHub’a koşullu istek (ETag)
        const headers = {
            'User-Agent': 'ozturkweb',
            'Accept': 'application/vnd.github+json',
        };

        if (CACHE.etag) {
            headers['If-None-Match'] = CACHE.etag;
        }

        const r = await fetch(GH_URL, { headers });

        // 304 => değişmemiş, cache’i tazele ve cache data’yı dön
        if (r.status === 304 && CACHE.data) {
            CACHE.ts = now;
            res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
            return res.status(200).json(CACHE.data);
        }

        // GitHub hata dönerse ve cache varsa cache’i ver (site bozulmasın)
        if (!r.ok) {
            if (CACHE.data) {
                res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
                return res.status(200).json(CACHE.data);
            }
            return res.status(r.status).json([]);
        }

        const data = await r.json();

        // 3) Cache güncelle
        const etag = r.headers.get('etag');
        CACHE = {
            etag: etag || CACHE.etag,
            data: Array.isArray(data) ? data : [],
            ts: now,
        };

        // 4) CDN/Edge cache header’ı (Vercel s-maxage’i sever)
        res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');

        return res.status(200).json(CACHE.data);
    } catch (e) {
        // Network patlarsa: cache varsa onu dön
        if (CACHE.data) {
            res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
            return res.status(200).json(CACHE.data);
        }
        return res.status(200).json([]);
    }
}
