import swr from "../../lib/swr.jsx";

export default function Repos() {
  const { data } = swr("/api/util/repos");

  // loading
  if (!data) {
    return (
      <div className="pt-10">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-lg bg-blue-600/40" />
          <h1 className="text-white text-2xl font-semibold">GitHub Repositories</h1>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg bg-[#080808] p-5">
              <div className="animate-pulse bg-white/10 h-5 w-40 rounded-lg" />
              <div className="animate-pulse mt-3 bg-white/10 h-4 w-28 rounded-lg" />
              <div className="animate-pulse mt-6 bg-white/10 h-4 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // error
  if (!data.ok) {
    return (
      <div className="pt-10">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-lg bg-blue-600/40" />
          <h1 className="text-white text-2xl font-semibold">GitHub Repositories</h1>
        </div>

        <div className="mt-6 rounded-lg bg-[#080808] p-5 text-zinc-300 flex items-center justify-between">
          <div>GitHub repolar şu an alınamadı.</div>
          <div className="text-zinc-600 text-xs uppercase">
            {data.error}
            {data.http_status ? ` (${data.http_status})` : ""}
          </div>
        </div>
      </div>
    );
  }

  const repos = data.repos || [];

  return (
    <div className="pt-10">
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-lg bg-blue-600/40 flex items-center justify-center">
          <span className="text-white font-bold">GH</span>
        </div>
        <h1 className="text-white text-2xl font-semibold">GitHub Repositories</h1>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-5">
        {repos.map((r) => (
          <a
            key={r.full_name}
            href={r.html_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[#080808] p-5 hover:bg-white/5 transition"
          >
            <div className="text-white font-semibold">{r.full_name}</div>
            <div className="text-zinc-400 text-sm mt-1 line-clamp-2">
              {r.description || "No description."}
            </div>

            <div className="mt-4 flex items-center justify-between text-zinc-500 text-xs">
              <div>{r.language || "—"}</div>
              <div className="flex items-center space-x-4">
                <div>★ {r.stargazers_count ?? 0}</div>
                <div>⑂ {r.forks_count ?? 0}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
