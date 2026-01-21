import swr from "../../lib/swr.jsx";

export default function Repos() {
  const { data } = swr("/api/util/repos");

  if (!data) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-32 rounded-lg bg-[#080808] animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!data.ok) {
    return (
      <div className="bg-[#080808] p-4 rounded-lg text-red-400">
        GitHub repolar alınamadı.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {data.repos.map(repo => (
        <a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          className="bg-[#080808] p-4 rounded-lg hover:scale-[1.02] transition"
        >
          <h1 className="text-white font-semibold">{repo.full_name}</h1>
          <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
            {repo.description || "No description."}
          </p>
          <div className="flex justify-between mt-4 text-xs text-zinc-500">
            <span>{repo.language || "-"}</span>
            <span>★ {repo.stargazers_count}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
