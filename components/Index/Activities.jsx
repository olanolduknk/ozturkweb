import swr from '../../lib/swr.jsx';
import Tippy from '@tippyjs/react';
import { useMemo, useState } from 'react';

export default function Activities() {
    const { data: _profile } = swr('/api/util/me');
    const profile = _profile || null;
    const [type, setType] = useState('spotify_large');

    const toggle = (e) => {
        e.preventDefault();
        setType(type === 'vsc' ? 'spotify_large' : 'vsc');
    };

    // status bazen undefined geliyor -> normalize + default
    const status = useMemo(() => {
        const raw = profile?.status;
        if (typeof raw === 'string' && raw.trim().length > 0) return raw.trim().toLowerCase();
        return 'offline';
    }, [profile]);

    const statusLabel = useMemo(() => status.toUpperCase(), [status]);

    const avatarUrl = useMemo(() => {
        if (profile?.id && profile?.avatar) {
            return `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}?size=4096`;
        }
        return null;
    }, [profile]);

    // Lanyard spotify + activities
    const spotify = profile?.spotify || null;
    const activities = Array.isArray(profile?.activities) ? profile.activities : [];

    // VS Code activity (varsa)
    const vsc = useMemo(() => {
        const hit = activities.find((a) => (a?.name || '').toLowerCase().includes('visual studio code'));
        return hit || null;
    }, [activities]);

    // Spotify progress % (varsa)
    const spotifyProgress = useMemo(() => {
        const start = Number(spotify?.timestamps?.start);
        const end = Number(spotify?.timestamps?.end);
        if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;

        const now = Date.now();
        const pct = ((now - start) / (end - start)) * 100;
        return Math.max(0, Math.min(100, pct));
    }, [spotify]);

    return (
        <div className="pt-5 pb-10 md:grid grid-cols-3 gap-x-6">
            {/* Discord card */}
            <div className="flex items-center space-x-5 rounded-lg bg-[#080808] p-5">
                <div className="relative flex items-center w-[100px] h-[100px]">
                    {!profile ? (
                        <img
                            className="animate-pulse rounded-full w-auto"
                            src="https://i.ibb.co/68X2Xfq/pulse.png"
                            alt="Loading avatar"
                        />
                    ) : avatarUrl ? (
                        <img className="rounded-full w-auto" src={avatarUrl} alt="Discord avatar" />
                    ) : (
                        <div className="rounded-full bg-white/10 w-[100px] h-[100px]" />
                    )}

                    {profile && (
                        <Tippy interactive={true} content={statusLabel}>
                            <div className="absolute bottom-1 bg-[#080808] rounded-full right-1 w-6 h-6 flex items-center justify-center">
                                <div className="w-full h-full relative flex items-center justify-center">
                                    <div className={'animate-ping w-3 h-3 rounded-full ' + `discord-${status}`} />
                                    <div
                                        className={
                                            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ' +
                                            `discord-${status}`
                                        }
                                    />
                                </div>
                            </div>
                        </Tippy>
                    )}
                </div>

                {!profile ? (
                    <div className="flex-1">
                        <div className="animate-pulse bg-white/10 w-16 h-6 rounded-lg" />
                        <div className="animate-pulse mt-2 bg-white/10 w-12 h-4 rounded-md" />
                    </div>
                ) : (
                    <div className="flex-1">
                        <h1 className="text-center leading-none font-light text-3xl md:text-xl lg:text-3xl text-white">
                            {profile.username}
                        </h1>
                        {/* discriminator (#xxxx) kaldırıldı */}
                    </div>
                )}
            </div>

            {/* Activity card */}
            <div className="mt-5 md:mt-0 rounded-lg overflow-hidden col-span-2 w-full h-[140px] sm:gap-x-6 py-5 relative bg-[#080808]">
                {!profile && (
                    <div className="space-x-3 absolute inset-0 bg-[#080808] rounded-lg flex items-center justify-center">
                        <div className="animate-pulse h-6 w-6 rounded-lg bg-white/10" />
                        <div className="animate-pulse h-5 w-40 md:w-80 rounded-lg bg-white/10" />
                    </div>
                )}

                {profile && (
                    <a
                        onClick={toggle}
                        className="cursor-pointer absolute top-2 left-2 z-[2] uppercase text-xs text-zinc-700 select-none"
                    >
                        {type === 'vsc' ? 'spotify' : 'vsc'}
                    </a>
                )}

                {profile && (
                    <div className="absolute inset-0 px-5 flex items-center">
                        {/* Spotify view */}
                        {type !== 'vsc' && (
                            <div className="w-full flex items-center gap-4">
                                {spotify?.album_art_url ? (
                                    <img
                                        src={spotify.album_art_url}
                                        alt="Album Art"
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-lg bg-white/10" />
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-medium truncate">
                                        {spotify?.song ? spotify.song : 'Not listening'}
                                    </div>
                                    <div className="text-zinc-400 text-sm truncate">
                                        {spotify?.artist ? spotify.artist : '—'}
                                    </div>
                                    <div className="text-zinc-500 text-xs truncate mt-1">
                                        {spotify?.album ? spotify.album : ''}
                                    </div>

                                    <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-2 bg-white/30"
                                            style={{ width: `${spotifyProgress ?? 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VSC view */}
                        {type === 'vsc' && (
                            <div className="w-full">
                                <div className="text-white font-medium">
                                    {vsc ? 'Visual Studio Code' : 'No activity'}
                                </div>
                                <div className="text-zinc-400 text-sm mt-1 truncate">
                                    {vsc?.details ? vsc.details : '—'}
                                </div>
                                <div className="text-zinc-500 text-xs mt-1 truncate">
                                    {vsc?.state ? vsc.state : ''}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
