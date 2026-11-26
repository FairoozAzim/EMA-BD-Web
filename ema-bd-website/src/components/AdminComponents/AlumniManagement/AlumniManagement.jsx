import { useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaGraduationCap,
  FaInfoCircle,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import Profile from "../../Profile/Profile";
import Pagination from "../../Pagination/Pagination";
import AlumniSkeleton from "../../ui/AlumniSkeleton";
import ErrorPage from "../../../pages/Error/Error";
import { AuthContext } from "../../../providers/AuthProvider";
import { adminRequest } from "../../../utils/adminApi";

const API = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 12;
const PROFILE_FIELDS = [
  { name: "Name", label: "Name", type: "text", maxLength: 200, required: true },
  { name: "Email", label: "Email", type: "email", maxLength: 320 },
  { name: "ProgramName", label: "Program", type: "text", maxLength: 200 },
  { name: "Session", label: "Session", type: "text", maxLength: 100 },
  { name: "UniName", label: "Universities", type: "text", maxLength: 1000 },
  { name: "About", label: "About", type: "textarea", maxLength: 5000 },
  { name: "FBLink", label: "Facebook link", type: "url", maxLength: 2000 },
  { name: "LinkedIn", label: "LinkedIn link", type: "url", maxLength: 2000 },
  { name: "OtherLink", label: "Other link", type: "url", maxLength: 2000 },
];

/* ---------- shared UI class names (styling only) ---------- */
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2A5F]/40 focus-visible:ring-offset-1";

const cardActionBase = `inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-medium transition ${focusRing}`;
const cardActionNeutral = `${cardActionBase} border-slate-200 text-slate-700 hover:border-[#0F2A5F] hover:bg-slate-50 hover:text-[#0F2A5F]`;
const cardActionDanger = `${cardActionBase} border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50`;

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-[#0F2A5F] focus:ring-2 focus:ring-[#0F2A5F]/20";

const fetchAlumni = async () => {
  const res = await fetch(`${API}/alumni`);

  if (!res.ok) {
    throw new Error("Failed to fetch alumni");
  }

  return res.json();
};

const getStudentFormValues = (student) =>
  Object.fromEntries(
    PROFILE_FIELDS.map(({ name }) => [
      name,
      typeof student?.[name] === "string" ? student[name] : "",
    ]),
  );

const AlumniManagement = () => {
  const { role = [] } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const isSuperAdmin = role.includes("SuperAdmin");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    data: alumni = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["alumni"],
    queryFn: fetchAlumni,
    staleTime: 5 * 60 * 1000,
  });

  const { error: accountsError } = useQuery({
    queryKey: ["adminAccounts"],
    queryFn: () => adminRequest("/admin/accounts"),
    enabled: isSuperAdmin,
  });

  useEffect(() => {
    reset(getStudentFormValues(editingStudent));
  }, [editingStudent, reset]);

  const sortedAlumni = useMemo(() => {
    return [...alumni].sort((a, b) =>
      (a.Name || "").localeCompare(b.Name || ""),
    );
  }, [alumni]);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentAlumni = useMemo(() => {
    return sortedAlumni.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedAlumni, indexOfFirstItem, indexOfLastItem]);

  useEffect(() => {
    setCurrentPage(1);
  }, [alumni]);

  const editMutation = useMutation({
    mutationFn: ({ studentId, values }) =>
      adminRequest(`/alumni/${studentId}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["alumni"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (studentId) =>
      adminRequest(`/alumni/${studentId}`, { method: "DELETE" }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["alumni"] }),
        queryClient.invalidateQueries({ queryKey: ["adminAccounts"] }),
      ]);
    },
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = async (values) => {
    const originalValues = getStudentFormValues(editingStudent);
    const changedValues = Object.fromEntries(
      PROFILE_FIELDS.filter(
        ({ name }) => values[name] !== originalValues[name],
      ).map(({ name }) => [name, values[name]]),
    );

    if (Object.keys(changedValues).length === 0) {
      await Swal.fire({
        title: "No changes",
        text: "Update at least one profile field before saving.",
        icon: "info",
        confirmButtonColor: "#0F2A5F",
      });
      return;
    }

    try {
      await editMutation.mutateAsync({
        studentId: editingStudent._id,
        values: changedValues,
      });
      setEditingStudent(null);
      await Swal.fire({
        title: "Student updated",
        text: "The student profile was saved successfully.",
        icon: "success",
        confirmButtonColor: "#0F2A5F",
      });
    } catch (requestError) {
      await Swal.fire({
        title: "Unable to update student",
        text: requestError.message,
        icon: "error",
        confirmButtonColor: "#0F2A5F",
      });
    }
  };

  const handleDelete = async (student) => {
    const confirmation = await Swal.fire({
      title: "Delete student profile?",
      text: `This will permanently delete ${student.Name || "this student"}'s profile. Any linked login account will remain.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete profile",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await deleteMutation.mutateAsync(student._id);
      await Swal.fire({
        title: "Profile deleted",
        text: "The student profile was deleted. Login accounts are not deleted.",
        icon: "success",
        confirmButtonColor: "#0F2A5F",
      });
    } catch (requestError) {
      await Swal.fire({
        title: "Unable to delete student",
        text: requestError.message,
        icon: "error",
        confirmButtonColor: "#0F2A5F",
      });
    }
  };

  if (isLoading) {
    return <AlumniSkeleton />;
  }

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F2A5F] text-white shadow-sm">
            <FaGraduationCap className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight text-[#0F2A5F] sm:text-3xl">
              Alumni Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Manage and view all alumni members.
            </p>
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm sm:min-w-[9rem] sm:flex-col sm:items-start sm:gap-0">
          <p className="text-xs font-medium text-slate-500">Total alumni</p>
          <p className="text-2xl font-bold leading-tight text-[#0F2A5F]">
            {alumni.length}
          </p>
        </div>
      </div>

      {isSuperAdmin && (
        <div
          role="note"
          className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800"
        >
          <FaInfoCircle className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            Student-account linking is disabled until account-owner
            confirmation is available. Creating new login accounts also
            requires a secure account-activation flow.
            {accountsError && (
              <p className="mt-1 font-medium text-amber-900">
                Account link status could not be loaded:{" "}
                {accountsError.message}
              </p>
            )}
          </div>
        </div>
      )}

      {alumni.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <FaGraduationCap className="text-3xl text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-700">
            No alumni found
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            There are currently no alumni records available.
          </p>
        </div>
      ) : (
        <>
          <div className="grid auto-rows-fr grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentAlumni.map((person) => (
              <div key={person._id} className="flex min-w-0 flex-col">
                <div className="flex-1 [&>*]:h-full">
                  <Profile designation="alumni" data={person} />
                </div>

                {isSuperAdmin && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingStudent(person)}
                      className={cardActionNeutral}
                    >
                      <FaEdit aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(person)}
                      disabled={deleteMutation.isPending}
                      className={cardActionDanger}
                    >
                      <FaTrash aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={alumni.length}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {editingStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-student-title"
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Modal header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-8 sm:py-5">
              <div className="min-w-0">
                <h2
                  id="edit-student-title"
                  className="text-xl font-bold text-[#0F2A5F]"
                >
                  Edit student profile
                </h2>
                <p className="mt-1 truncate text-sm text-slate-500">
                  Update profile information for{" "}
                  <span className="font-medium text-slate-700">
                    {editingStudent.Name ||
                      editingStudent["Name *"] ||
                      "student"}
                  </span>
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                disabled={editMutation.isPending}
                className={`-mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 ${focusRing}`}
                aria-label="Close edit form"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(handleEdit)}
              className="flex min-h-0 flex-1 flex-col"
            >
              {/* Scrollable fields */}
              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
                <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                  {PROFILE_FIELDS.map((field) => (
                    <div
                      key={field.name}
                      className={
                        field.type === "textarea" ? "sm:col-span-2" : ""
                      }
                    >
                      <label
                        htmlFor={`student-${field.name}`}
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        {field.label}
                        {field.required && (
                          <span className="ml-0.5 text-red-500" aria-hidden="true">
                            *
                          </span>
                        )}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          id={`student-${field.name}`}
                          rows={5}
                          maxLength={field.maxLength}
                          aria-invalid={errors[field.name] ? "true" : "false"}
                          {...register(field.name, {
                            maxLength: {
                              value: field.maxLength,
                              message: `Use ${field.maxLength} characters or fewer.`,
                            },
                          })}
                          className={`${inputBase} resize-y leading-relaxed ${
                            errors[field.name]
                              ? "border-red-300"
                              : "border-slate-200"
                          }`}
                        />
                      ) : (
                        <input
                          id={`student-${field.name}`}
                          type={field.type}
                          maxLength={field.maxLength}
                          aria-invalid={errors[field.name] ? "true" : "false"}
                          {...register(field.name, {
                            required: field.required
                              ? `${field.label} is required.`
                              : false,
                            maxLength: {
                              value: field.maxLength,
                              message: `Use ${field.maxLength} characters or fewer.`,
                            },
                          })}
                          className={`${inputBase} ${
                            errors[field.name]
                              ? "border-red-300"
                              : "border-slate-200"
                          }`}
                        />
                      )}
                      {errors[field.name] && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                          {errors[field.name].message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sticky footer */}
              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  disabled={editMutation.isPending}
                  className={`rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 ${focusRing}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className={`rounded-xl bg-[#0F2A5F] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0b214b] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
                >
                  {editMutation.isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default AlumniManagement;