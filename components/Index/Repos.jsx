import swr from "../../lib/swr.jsx";

export default function Repos() {
  const { data } = swr("/api/util/repos", 600000);

  // loading -> eski tasarım gibi skeleton
  if (!data) {
    return (
      <div className="pt-10">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-lg bg-blue-600/40 flex items-center justify-center">
            <span className="text-white font-bold">GH</span>
          </div>
          <h1 className="text-white text-2xl font-semibold">GitHub Repositories</h1>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg bg-[#080808] p-6">
              <div className="animate-pulse bg-white/10 h-5 w-48 rounded-lg" />
              <div className="animate-pulse mt-3 bg-white/10 h-4 w-32 rounded-lg" />
              <div className="animate-pulse mt-8 bg-white/10 h-4 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // error -> tasarımı bozma ama mesaj göster (skeleton’da kalmak yerine)
  if (!data.ok) {
    return (
      <div className="pt-10">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-lg bg-blue-600/40 flex items-center justify-center">
            <span className="text-white font-bold">GH</span>
          </div>
          <h1 className="text-white text-2xl font-semibold">GitHub Repositories</h1>
        </div>

        <div className="mt-6 rounded-lg bg-[#080808] p-6 text-zinc-300 flex items-center justify-between">
          <div>GitHub repolar şu an alınamadı.</div>
          <div className="text-zinc-600 text-xs uppercase">
            {data.error}
            {data.http_status ? ` (${data.http_status})` : ""}
          </div>
        </div>
      </div>
    );
  }

  const repos = Array.isArray(data.repos) ? data.repos : [];

  return (
    <div className="pt-10">
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-lg bg-blue-600/40 flex items-center justify-center">
          <span className="text-white font-bold">GH</span>
        </div>
        <h1 className="text-white text-2xl font-semibold">GitHub Repositories</h1>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {repos.slice(0, 6).map((r) => (
          <a
            key={r.full_name}
            href={r.html_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[#080808] p-6 hover:bg-white/5 transition"
          >
            <div className="text-white font-semibold">{r.full_name}</div>
            <div className="text-zinc-500 text-sm mt-1">Collaborator</div>

            <div className="text-zinc-400 text-sm mt-4 line-clamp-2">
              {r.description || "No description."}
            </div>

            <div className="mt-6 flex items-center justify-between text-zinc-500 text-xs">
              <div>{r.language || "—"}</div>
              <div className="flex items-center space-x-4">
                <div>★ {r.stargazers_count ?? 0} stars</div>
                <div>⑂ {r.forks_count ?? 0} forks</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
