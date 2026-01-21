import swr from '../../lib/swr.jsx';
import Tippy from '@tippyjs/react';

export default function Activities() {
  const { data: profile } = swr('/api/util/me');

  const status = profile?.status || null;
  const statusUpper = status ? status.toUpperCase() : null;

  const isSpotify = !!profile?.listening_to_spotify && !!profile?.spotify;

  return (
    <div className="pt-5 pb-10 md:grid grid-cols-3 gap-x-6">
      {/* Discord card */}
      <div className="flex items-center space-x-5 rounded-lg bg-[#080808] p-5">
        <div className="relative flex items-center w-[100px] h-[100px]">
          {!profile ? (
            <img
              className="animate-pulse rounded-full w-auto"
              src="https://i.ibb.co/68X2Xfq/pulse.png"
              alt="loading"
            />
          ) : (
            <img className="rounded-full w-auto" src={profile.avatar_url} alt="discord avatar" />
          )}

          {statusUpper && (
            <Tippy interactive={true} content={statusUpper}>
              <div className="absolute bottom-1 bg-[#080808] rounded-full right-1 w-6 h-6 flex items-center justify-center">
                <div className="w-full h-full relative flex items-center justify-center">
                  <div className={"animate-ping w-3 h-3 rounded-full " + `discord-${status}`} />
                  <div
                    className={
                      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full " +
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
            <h1 className="text-center leading-none font-semibold text-xl md:text-lg lg:text-xl text-zinc-300">
              #{profile.discriminator}
            </h1>
          </div>
        )}
      </div>

      {/* Spotify/activity card */}
      <div className="mt-5 md:mt-0 rounded-lg overflow-hidden col-span-2 w-full h-[140px] sm:gap-x-6 py-5 relative bg-[#080808] flex items-center">
        {!profile ? (
          <div className="w-full px-6 flex items-center space-x-3">
            <div className="animate-pulse h-10 w-10 rounded-lg bg-white/10" />
            <div className="flex-1">
              <div className="animate-pulse h-5 w-40 md:w-80 rounded-lg bg-white/10" />
              <div className="animate-pulse mt-2 h-4 w-28 rounded-lg bg-white/10" />
            </div>
          </div>
        ) : isSpotify ? (
          <div className="w-full px-6 flex items-center space-x-4">
            <img src={profile.spotify.album_art_url} className="h-20 w-20 rounded-lg" alt="album" />
            <div className="flex-1">
              <div className="text-xs uppercase text-zinc-500 tracking-wider">Now Playing</div>
              <div className="text-white font-semibold leading-tight">{profile.spotify.song}</div>
              <div className="text-zinc-400 text-sm">{profile.spotify.artist}</div>
              <div className="text-zinc-600 text-xs mt-1">{profile.spotify.album}</div>
            </div>
            <div className="text-zinc-600 text-xs uppercase">Spotify</div>
          </div>
        ) : (
          <div className="w-full px-6 flex items-center justify-between">
            <div className="text-zinc-300">I don’t listen to anything on Spotify.</div>
            <div className="text-zinc-600 text-xs uppercase">UNKCORD</div>
          </div>
        )}
      </div>
    </div>
  );
}
