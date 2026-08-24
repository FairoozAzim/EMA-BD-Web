import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import Profile from "../../components/Profile/Profile";
import Pagination from "../../components/Pagination/Pagination";
import { FiSearch } from "react-icons/fi";
import AlumniSkeleton from "../../components/ui/AlumniSkeleton";
import ErrorPage from "../Error/Error";

// Get unique sessions
const sessions = [
  "2020-2022",
  "2021-2023",
  "2022-2024",
  "2023-2025",
  "2024-2026",
  "2025-2027",
];

// Extract university names
const extractUniversities = (uniName) => {
  if (!uniName) return [];

  return uniName
    .replace(/\d+\.\s*/g, "")
    .replace(/\s+and\s+/gi, ",")
    .split(/,\s*/)
    .map((u) => u.trim())
    .filter(Boolean);
};

const API = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 12;

const fetchAlumni = async () => {
  const res = await fetch(`${API}/alumni`);

  if (!res.ok) {
    throw new Error("Failed to fetch alumni");
  }

  return res.json();
};

const Alumni = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [session, setSession] = useState("");
  const [program, setProgram] = useState("");
  const [emjmUniversity, setEmjmUniversity] = useState("");
  const [bdUniversity, setBdUniversity] = useState("");
  const [search, setSearch] = useState("");

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const {
    data: alumni = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["alumni"],
    queryFn: fetchAlumni,
    staleTime: 5 * 60 * 1000,
  });

  const sortedAlumni = useMemo(() => {
    return [...alumni].sort((a, b) => a.Name.localeCompare(b.Name));
  }, [alumni]);

  const filteredAlumni = useMemo(() => {
    let filtered = [...sortedAlumni];

    if (search) {
      const query = search.toLowerCase();

      filtered = filtered.filter(
        (a) =>
          a.Name?.toLowerCase().includes(query) ||
          a.ProgramName?.toLowerCase().includes(query) ||
          a.Session?.toLowerCase().includes(query) ||
          a.UniName?.toLowerCase().includes(query),
      );
    }

    if (session) {
      filtered = filtered.filter((a) => a.Session === session);
    }

    if (program) {
      filtered = filtered.filter((a) => a.ProgramName === program);
    }

    if (emjmUniversity) {
      filtered = filtered.filter((a) =>
        extractUniversities(a.UniName).includes(emjmUniversity),
      );
    }

    if (bdUniversity) {
      filtered = filtered.filter((a) =>
        extractUniversities(a.UniName).includes(bdUniversity),
      );
    }

    return filtered;
  }, [sortedAlumni, search, session, program, emjmUniversity, bdUniversity]);

  const currentAlumni = useMemo(() => {
    return filteredAlumni.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAlumni, indexOfFirstItem, indexOfLastItem]);

  const programs = useMemo(() => {
    return [...new Set(sortedAlumni.map((a) => a.ProgramName))];
  }, [sortedAlumni]);

  const emjmUniversities = useMemo(() => {
    return [
      ...new Set(sortedAlumni.flatMap((a) => extractUniversities(a.UniName))),
    ];
  }, [sortedAlumni]);

  const bdUniversities = useMemo(() => {
    return [
      ...new Set(sortedAlumni.flatMap((a) => extractUniversities(a.UniName))),
    ];
  }, [sortedAlumni]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, session, program, emjmUniversity, bdUniversity]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSession("");
    setProgram("");
    setEmjmUniversity("");
    setBdUniversity("");
  }, []);

  if (isLoading) {
    return <AlumniSkeleton />;
  }

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            Student & Alumni
          </h1>

          <p className="mx-auto text-xs md:text-base mt-4 max-w-2xl text-slate-600">
            Explore the inspiring journeys of Erasmus Mundus scholars and alumni
            from Bangladesh across different programs, universities, and
            academic sessions.
          </p>
        </div>
      </section>

      {/* Alumni Content */}
      <section className="mx-auto max-w-7xl px-6 pb-16 mt-8 md:mt-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Filters - Left Side */}
          <aside className="w-full lg:w-72 lg:shrink-0">
            <div className="rounded-2xl bg-white p-6 shadow-md lg:sticky lg:top-24">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Filter Alumni
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Filter by session, program, or university.
                  </p>
                </div>

                <button
                  onClick={handleClearFilters}
                  className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-[#0F2A5F] hover:text-white"
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-col gap-5">
                {/* Session */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Session
                  </label>

                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">All Sessions</option>

                    {sessions.map((sesh) => (
                      <option key={sesh} value={sesh}>
                        {sesh}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Program */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Program
                  </label>

                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">All Programs</option>

                    {programs.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* EMJM University */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    EMJM University
                  </label>

                  <select
                    value={emjmUniversity}
                    onChange={(e) => setEmjmUniversity(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">All Universities</option>

                    {emjmUniversities.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BD University */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    BD University
                  </label>

                  <select
                    value={bdUniversity}
                    onChange={(e) => setBdUniversity(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">All Universities</option>

                    {bdUniversities.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Alumni - Right Side */}
          <div className="min-w-0 flex-1">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 md:text-3xl">
                  Alumni Directory
                </h2>

                <p className="mt-2 text-xs text-slate-500 md:text-sm">
                  Showing {filteredAlumni.length} alumni
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <FiSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-10 text-sm outline-none transition focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-400 hover:text-slate-700"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {currentAlumni.length ? (
                currentAlumni.map((alumni) => (
                  <Profile
                    key={alumni._id}
                    designation="alumni"
                    data={alumni}
                  />
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-20 text-center">
                  <h3 className="text-xl font-semibold text-slate-700">
                    No Alumni Found
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Try changing the selected filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="pb-20">
        <Pagination
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredAlumni.length}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
};

export default Alumni;
