import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import Pagination from "../../Pagination/Pagination";
import {
  MdAdd,
  MdDeleteOutline,
  MdOutlineFileUpload,
  MdEvent,
  MdLocationOn,
  MdRefresh,
  MdClose,
  MdAccessTime,
  MdEdit,
} from "react-icons/md";
const API = import.meta.env.VITE_API_URL;
const formatTime = (date) => {
  return date.toTimeString().slice(0, 8);
};
const fetchEvents = async () => {
  const response = await fetch(`${API}/events`);
  if (!response.ok) {
    throw new Error("Failed to load events.");
  }
  return response.json();
};
const EventManagement = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState(null);
  const [existingBanner, setExistingBanner] = useState("");
  const [formError, setFormError] = useState("");
  const formRef = useRef(null);
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: events = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [events.length]);
  const sortedEvents = useMemo(() => {
    const items = [...(events ?? [])];
    const getTimestamp = (item) => {
      if (item.createdAt) {
        const timestamp = new Date(item.createdAt).getTime();
        if (!Number.isNaN(timestamp)) return timestamp;
      }
      // MongoDB ObjectIds contain their creation timestamp in the first 8 characters.
      if (typeof item._id === "string" && /^[a-f\d]{24}$/i.test(item._id)) {
        return parseInt(item._id.slice(0, 8), 16) * 1000;
      }
      return null;
    };
    const timestamps = items.map(getTimestamp);
    const hasTimestamps = timestamps.some((timestamp) => timestamp !== null);
    // If the API has no timestamps/ ObjectId IDs, assume it returns oldest first.
    if (!hasTimestamps) return items.reverse();
    return items.sort(
      (a, b) => (getTimestamp(b) ?? 0) - (getTimestamp(a) ?? 0),
    );
  }, [events]);
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  useEffect(() => {
    if (!bannerFile) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(bannerFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [bannerFile]);
  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${API}/events`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Failed to create event.");
      }
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      setCurrentPage(1);
      setIsOpen(false);
      resetForm();
      await Swal.fire({
        title: "Event created!",
        text: "Your event has been added successfully.",
        icon: "success",
        confirmButtonColor: "#0F2A5F",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Create failed",
        text: error.message || "Could not create the event. Please try again.",
        icon: "error",
        confirmButtonColor: "#0F2A5F",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const response = await fetch(`${API}/events/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event.");
      }

      return result;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });

      setIsOpen(false);
      resetForm();

      await Swal.fire({
        title: "Event updated!",
        text: "Your event has been updated successfully.",
        icon: "success",
        confirmButtonColor: "#0F2A5F",
      });
    },

    onError: (error) => {
      Swal.fire({
        title: "Update failed",
        text: error.message || "Could not update the event. Please try again.",
        icon: "error",
        confirmButtonColor: "#0F2A5F",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API}/events/${id}`, {
        method: "DELETE",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete event.");
      }
      if (
        result.deletedCount === 0 ||
        (result.deletedCount === undefined && result.success === false)
      ) {
        throw new Error("The event could not be deleted.");
      }
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await Swal.fire({
        title: "Deleted!",
        text: "The event has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#0F2A5F",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Delete failed",
        text: error.message || "Could not delete the event. Please try again.",
        icon: "error",
        confirmButtonColor: "#0F2A5F",
      });
    },
  });
  const resetForm = () => {
    formRef.current?.reset();
    setBannerFile(null);
    setPreview("");
    setExistingBanner("");
    setEditingEvent(null);
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setFormError("");
  };

  const closeModal = () => {
    if (createMutation.isPending) return;

    setIsOpen(false);
    resetForm();
  };
  const handleBannerChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError("The banner must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    setFormError("");
    setBannerFile(file);
  };

  // HANDLE SUBMIT
  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    if (!selectedDate || !selectedTime) {
      setFormError("Please select both an event date and time.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    formData.set("date", selectedDate.toLocaleDateString("en-GB"));
    formData.set("time", formatTime(selectedTime));
    formData.set("desc", formData.get("desc")?.toString().trim() ?? "");

    // Include a new banner only if the user selected one.
    if (bannerFile) {
      formData.set("banner", bannerFile);
    }

    // Update existing event.
    if (editingEvent) {
      updateMutation.mutate({
        id: editingEvent._id,
        formData,
      });
      return;
    }

    // Otherwise, create a new event as before.
    createMutation.mutate(formData);
  };

  const handleDelete = async (event) => {
    const result = await Swal.fire({
      title: "Delete this event?",
      text: `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    deleteMutation.mutate(event._id);
  };
  const parseEventDate = (dateString) => {
    if (!dateString) return new Date();

    // Handles dates stored as DD/MM/YYYY
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      const parsedDate = new Date(year, month - 1, day);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    // Also supports ISO-style dates
    const parsedDate = new Date(dateString);
    return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  };

  const parseEventTime = (timeString) => {
    if (!timeString) return new Date();

    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    const parsedTime = new Date();
    parsedTime.setHours(hours || 0, minutes || 0, seconds || 0, 0);

    return parsedTime;
  };

  const openCreateModal = () => {
    setFormError("");
    setIsOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormError("");
    setBannerFile(null);
    setPreview("");

    setExistingBanner(event.banner || "");

    setSelectedDate(parseEventDate(event.date));
    setSelectedTime(parseEventTime(event.time));

    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen || !editingEvent || !formRef.current) return;

    const form = formRef.current;

    form.elements.title.value = editingEvent.title || "";
    form.elements.place.value = editingEvent.place || "";
    form.elements.org.value = editingEvent.org || "";
    form.elements.link.value = editingEvent.link || "";
    form.elements.desc.value = editingEvent.desc || "";
  }, [isOpen, editingEvent]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F2A5F] text-white shadow-sm">
              <MdEvent size={26} />
            </div>
            <h1 className="text-2xl font-bold text-[#0F2A5F] sm:text-3xl">
              Event Management
            </h1>
          </div>
          <p className="text-sm text-slate-500 sm:text-base">
            Create events and manage the EMA-BD event listings.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2A5F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173b7b]"
        >
          <MdAdd size={22} />
          Create an Event
        </button>
      </div>
      {/* Success feedback */}
      {/* Event summary */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total events</p>
              <p className="mt-2 text-3xl font-bold text-[#0F2A5F]">
                {isLoading ? "—" : events.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0F2A5F]">
              <MdEvent size={27} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Event listings
              </p>
              <p className="mt-2 text-lg font-bold text-slate-800">
                {isLoading
                  ? "Loading..."
                  : events.length
                    ? "Available"
                    : "No events yet"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh events"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-[#0F2A5F] disabled:opacity-50"
            >
              <MdRefresh
                size={23}
                className={isFetching ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </div>
      {/* Event list */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800">All Events</h2>
          <p className="mt-1 text-sm text-slate-500">
            Review event details or remove an event listing.
          </p>
        </div>
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading events...
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
          >
            <p className="font-semibold text-red-700">Unable to load events</p>
            <p className="mt-2 text-sm text-red-600">
              {error?.message || "Please check your connection and try again."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-[#0F2A5F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#173b7b]"
            >
              Try again
            </button>
          </div>
        ) : paginatedEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <MdEvent className="mx-auto mb-4 text-4xl text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-800">
              No events found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Create an event to get started.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {paginatedEvents.map((item) => (
                <article
                  key={item._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-800">
                      {item.title}
                    </h3>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        aria-label={`Edit ${item.title}`}
                        className="rounded-lg p-2 text-[#0F2A5F] transition hover:bg-blue-50"
                      >
                        <MdEdit size={21} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={deleteMutation.isPending}
                        aria-label={`Delete ${item.title}`}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                      >
                        <MdDeleteOutline size={22} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                      <MdEvent className="shrink-0 text-[#0F2A5F]" />
                      {item.date || "Date not specified"}
                    </p>
                    {item.time && (
                      <p className="flex items-center gap-2">
                        <MdAccessTime className="shrink-0 text-[#0F2A5F]" />
                        {item.time}
                      </p>
                    )}
                    {item.place && (
                      <p className="flex items-center gap-2">
                        <MdLocationOn className="shrink-0 text-[#0F2A5F]" />
                        {item.place}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Event title</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Time</th>
                      <th className="px-6 py-4 font-semibold">Location</th>
                      <th className="px-6 py-4 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedEvents.map((item) => (
                      <tr
                        key={item._id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="max-w-xs px-6 py-4 font-semibold text-slate-800">
                          {item.title}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          {item.date || "—"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          {item.time || "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {item.place || "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              aria-label={`Edit ${item.title}`}
                              className="inline-flex items-center justify-center rounded-lg p-2 text-[#0F2A5F] transition hover:bg-blue-50"
                            >
                              <MdEdit size={21} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={deleteMutation.isPending}
                              aria-label={`Delete ${item.title}`}
                              className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                            >
                              <MdDeleteOutline size={21} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
      {/* Create event modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !createMutation.isPending &&
              !updateMutation.isPending
            ) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-event-title"
            className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
              <div>
                <h2
                  id="create-event-title"
                  className="text-xl font-bold text-[#0F2A5F]"
                >
                  {editingEvent ? "Edit Event" : "Create an Event"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingEvent
                    ? "Update the event information below."
                    : "Add event information and upload a banner."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={createMutation.isPending || updateMutation.isPending}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
              >
                <MdClose size={23} />
              </button>
            </div>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
                {formError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {formError}
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Event title
                  </label>
                  <input
                    name="title"
                    required
                    maxLength={200}
                    placeholder="Enter event title"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Event date
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={setSelectedDate}
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select event date"
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                      wrapperClassName="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Event time
                    </label>
                    <DatePicker
                      selected={selectedTime}
                      onChange={setSelectedTime}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      placeholderText="Select event time"
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Event location
                    </label>
                    <input
                      name="place"
                      required
                      placeholder="Enter event location"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Partner organization
                    </label>
                    <input
                      name="org"
                      placeholder="Enter organization name"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Registration or joining link
                  </label>
                  <input
                    name="link"
                    type="url"
                    placeholder="https\://example.com/register"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Event banner
                  </label>
                  {preview || existingBanner ? (
                    <div className="relative overflow-hidden rounded-xl border border-slate-200">
                      <img
                        src={
                          preview ||
                          (existingBanner
                            ? `${API}/uploads/${existingBanner}`
                            : "")
                        }
                        alt="Event banner preview"
                        className="h-48 w-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Banner failed to load:",
                            e.currentTarget.src,
                          );
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBannerFile(null);
                          setPreview("");
                          setExistingBanner("");
                        }}
                        className="absolute right-3 top-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow hover:bg-red-50"
                      >
                        Remove banner
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-[#0F2A5F] hover:bg-blue-50/50">
                      <MdOutlineFileUpload
                        size={32}
                        className="mb-2 text-[#0F2A5F]"
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        Click to upload an event banner
                      </span>
                      <span className="mt-1 text-xs text-slate-500">
                        Image files up to 5 MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Event description
                  </label>
                  <textarea
                    name="desc"
                    required
                    rows={5}
                    maxLength={10000}
                    placeholder="Describe the event, its purpose and what participants can expect..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="rounded-xl bg-[#0F2A5F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173b7b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? editingEvent
                      ? "Saving changes..."
                      : "Creating event..."
                    : editingEvent
                      ? "Save Changes"
                      : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {sortedEvents.length > ITEMS_PER_PAGE && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={sortedEvents.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
export default EventManagement;
