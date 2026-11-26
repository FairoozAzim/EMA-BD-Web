import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { adminRequest } from "../../utils/adminApi";

const SUPPORTED_ROLES = [
  "SuperAdmin",
  "Monitor",
  "EventManager",
  "StudentManager",
  "HomeViewer",
];

const RoleManagement = () => {
  const { role } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState({});
  const isSuperAdmin = role.includes("SuperAdmin");

  const {
    data: accounts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminAccounts", search],
    queryFn: async () => {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      return adminRequest(`/admin/accounts${query}`);
    },
    enabled: isSuperAdmin,
  });

  useEffect(() => {
    setSelectedRoles(
      Object.fromEntries(
        accounts.map((account) => [account._id, account.adminType || []]),
      ),
    );
  }, [accounts]);

  const updateRoles = useMutation({
    mutationFn: ({ accountId, roles }) =>
      adminRequest(`/admin/accounts/${accountId}/roles`, {
        method: "PATCH",
        body: JSON.stringify({ roles }),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminAccounts"] }),
  });

  const handleRoleChange = (accountId, changedRole, checked) => {
    setSelectedRoles((current) => {
      const accountRoles = current[accountId] || [];
      const nextRoles = checked
        ? [...accountRoles, changedRole]
        : accountRoles.filter((assignedRole) => assignedRole !== changedRole);

      return { ...current, [accountId]: nextRoles };
    });
  };

  const handleSave = async (account) => {
    const roles = selectedRoles[account._id] || [];
    const unchanged =
      roles.length === account.adminType.length &&
      roles.every((assignedRole) => account.adminType.includes(assignedRole));

    if (account.isCurrentUser || unchanged) {
      return;
    }

    const confirmation = await Swal.fire({
      title: "Update account roles?",
      text: `Save the selected roles for ${account.name || account.email}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0F2A5F",
      confirmButtonText: "Save roles",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await updateRoles.mutateAsync({ accountId: account._id, roles });
      await Swal.fire({
        title: "Roles updated",
        text: "The account roles were saved successfully.",
        icon: "success",
        confirmButtonColor: "#0F2A5F",
      });
    } catch (requestError) {
      await Swal.fire({
        title: "Unable to update roles",
        text: requestError.message,
        icon: "error",
        confirmButtonColor: "#0F2A5F",
      });
    }
  };

  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2A5F] md:text-3xl">
            Account Roles
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Assign or remove existing roles for login accounts.
          </p>
        </div>

        <label className="w-full sm:max-w-sm">
          <span className="sr-only">Search accounts</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#0F2A5F] focus:ring-2 focus:ring-[#0F2A5F]/20"
          />
        </label>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading accounts...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-600">
          {error.message}
        </div>
      )}

      {!isLoading && !error && accounts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
          No login accounts found.
        </div>
      )}

      {!isLoading && !error && accounts.length > 0 && (
        <div className="space-y-4">
          {accounts.map((account) => {
            const roles = selectedRoles[account._id] || [];
            const unchanged =
              roles.length === account.adminType.length &&
              roles.every((assignedRole) =>
                account.adminType.includes(assignedRole),
              );

            return (
              <section
                key={account._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {account.name || "Account"}
                      {account.isCurrentUser && (
                        <span className="ml-2 text-xs font-medium text-slate-400">
                          (you)
                        </span>
                      )}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {account.email}
                    </p>
                  </div>
                  {account.studentId && (
                    <span className="mt-2 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 sm:mt-0">
                      Linked student
                    </span>
                  )}
                </div>

                <div className="grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SUPPORTED_ROLES.map((supportedRole) => (
                    <label
                      key={supportedRole}
                      className={`flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm ${
                        account.isCurrentUser
                          ? "cursor-not-allowed bg-slate-50 text-slate-400"
                          : "cursor-pointer text-slate-700 hover:border-[#0F2A5F]/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={roles.includes(supportedRole)}
                        disabled={account.isCurrentUser}
                        onChange={(event) =>
                          handleRoleChange(
                            account._id,
                            supportedRole,
                            event.target.checked,
                          )
                        }
                        className="h-4 w-4 accent-[#0F2A5F]"
                      />
                      {supportedRole}
                    </label>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    {account.isCurrentUser
                      ? "Your own roles cannot be changed here."
                      : "The last SuperAdmin account cannot lose its SuperAdmin role."}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSave(account)}
                    disabled={
                      account.isCurrentUser ||
                      unchanged ||
                      updateRoles.isPending
                    }
                    className="rounded-xl bg-[#0F2A5F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b214b] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updateRoles.isPending ? "Saving..." : "Save roles"}
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
