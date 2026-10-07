import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaGraduationCap } from "react-icons/fa";

import Profile from "../../Profile/Profile";
import Pagination from "../../Pagination/Pagination";
import AlumniSkeleton from "../../ui/AlumniSkeleton";
import ErrorPage from "../../../pages/Error/Error";

const API = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 12;

const fetchAlumni = async () => {
  const res = await fetch(`${API}/alumni`);

  if (!res.ok) {
    throw new Error("Failed to fetch alumni");
  }

  return res.json();
};

const AlumniManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: alumni = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["alumni"],
    queryFn: fetchAlumni,
    staleTime: 5 * 60 * 1000,
  });

  // Sort alumni alphabetically without modifying React Query's cached data
  const sortedAlumni = useMemo(() => {
    return [...alumni].sort((a, b) =>
      (a.Name || "").localeCompare(b.Name || "")
    );
  }, [alumni]);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const currentAlumni = useMemo(() => {
    return sortedAlumni.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedAlumni, indexOfFirstItem, indexOfLastItem]);

  // Reset pagination when alumni data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [alumni]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <AlumniSkeleton />;
  }

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F2A5F] text-white shadow-sm">
              <FaGraduationCap className="text-xl" />
            </div>

            <h1 className="text-2xl font-bold text-[#0F2A5F] sm:text-3xl">
              Alumni Management
            </h1>
          </div>

          <p className="text-sm text-slate-500 sm:text-base">
            Manage and view all alumni members.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total Alumni
          </p>

          <p className="mt-1 text-xl font-bold text-[#0F2A5F]">
            {alumni.length}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {alumni.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <FaGraduationCap className="mx-auto mb-4 text-4xl text-slate-300" />

          <h2 className="text-lg font-semibold text-slate-700">
            No alumni found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            There are currently no alumni records available.
          </p>
        </div>
      ) : (
        <>
          {/* Alumni Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentAlumni.map((person) => (
              <Profile
                key={person._id}
                designation="alumni"
                data={person}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={alumni.length}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AlumniManagement;