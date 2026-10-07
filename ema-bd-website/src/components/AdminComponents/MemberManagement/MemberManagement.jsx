import { useEffect, useState } from "react";
import { RiTeamLine } from "react-icons/ri";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/members`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load members.");
        }

        return res.json();
      })
      .then((data) => {
        setMembers(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F2A5F]/10 text-[#0F2A5F]">
              <RiTeamLine className="text-xl" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Members
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View current EMA Bangladesh team members.
              </p>
            </div>
          </div>
        </div>

        {/* Member Count */}
        {!loading && !error && (
          <div className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            {members.length} {members.length === 1 ? "Member" : "Members"}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="animate-pulse space-y-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 border-b border-slate-100 pb-5 last:border-0"
              >
                <div className="h-12 w-12 rounded-full bg-slate-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded bg-slate-200" />
                  <div className="h-3 w-28 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && members.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <RiTeamLine className="mx-auto text-4xl text-slate-300" />

          <h2 className="mt-4 text-lg font-semibold text-slate-700">
            No members found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            There are currently no members to display.
          </p>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && !error && members.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Member
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Position
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Year
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <tr
                    key={member._id}
                    className="transition-colors duration-200 hover:bg-slate-50"
                  >
                    {/* Member */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/uploads/${member.url}`}
                          alt={member.name}
                          className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                        />

                        <div>
                          <p className="font-semibold text-slate-800">
                            {member.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Team Member
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[#0F2A5F]/10 px-3 py-1.5 text-xs font-medium text-[#0F2A5F]">
                        {member.position}
                      </span>
                    </td>

                    {/* Year */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {member.year || "—"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && !error && members.length > 0 && (
        <div className="space-y-3 md:hidden">
          {members.map((member) => (
            <div
              key={member._id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${member.url}`}
                  alt={member.name}
                  className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-slate-800">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {member.position}
                  </p>
                </div>

                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-400">
                  Year
                </span>

                <span className="text-sm font-medium text-slate-600">
                  {member.year || "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberManagement;