import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { FaHome } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
import { MdDashboard, MdEvent } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { RiMenu2Line, RiTeamLine, RiCloseLine } from "react-icons/ri";
import { PiStudentFill } from "react-icons/pi";

import { AuthContext } from "../../providers/AuthProvider";

const Dashboard = () => {
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationLinks = [
    {
      to: "/dashboard/manageEvents",
      text: "Events",
      Icon: MdEvent,
      roles: ["SuperAdmin", "Monitor", "EventManager"],
    },
    {
      to: "/dashboard/manageBlogs",
      text: "Blogs",
      Icon: GrNotes,
      roles: ["SuperAdmin", "Monitor"],
    },
    {
      to: "/dashboard/manageAlumni",
      text: "Students",
      Icon: PiStudentFill,
      roles: ["SuperAdmin", "Monitor", "StudentManager"],
    },
    {
      to: "/dashboard/manageMembers",
      text: "Members",
      Icon: RiTeamLine,
      roles: ["SuperAdmin", "Monitor"],
    },
  ];

  const hasAllowedRole = (allowedRoles) => {
    return role?.some((r) => allowedRoles.includes(r));
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    closeSidebar();
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#0F2A5F] text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-[#0F2A5F]"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-[#0F2A5F]"
          aria-label="Open menu"
        >
          <RiMenu2Line className="text-xl" />
        </button>

        <div className="text-center">
          <p className="text-base font-bold text-[#0F2A5F]">
            EMA Bangladesh
          </p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Admin Dashboard
          </p>
        </div>

        <div className="w-10" />
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#0F2A5F]">
              EMA Bangladesh
            </h1>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Admin Dashboard
            </p>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="mx-4 mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F2A5F] text-sm font-bold text-white">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                Administrator
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {role?.length ? role.join(", ") : "Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Main Menu
          </p>

          <ul className="space-y-1.5">
            {/* Dashboard */}
            <li>
              <NavLink
                to="/dashboard/adminHome"
                onClick={closeSidebar}
                className={navLinkClass}
              >
                <MdDashboard className="shrink-0 text-xl" />
                <span>Dashboard</span>
              </NavLink>
            </li>

            {/* Role Based Links */}
            {navigationLinks.map((link) => {
              if (!hasAllowedRole(link.roles)) {
                return null;
              }

              const Icon = link.Icon;

              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={closeSidebar}
                    className={navLinkClass}
                  >
                    <Icon className="shrink-0 text-xl" />
                    <span>{link.text}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <AiOutlineLogout className="text-xl" />
            <span>Logout</span>
          </button>

          <NavLink
            to="/"
            onClick={closeSidebar}
            className="mt-1.5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-[#0F2A5F]"
          >
            <FaHome className="text-lg" />
            <span>Home Page</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-72">
        {/* Desktop Top Bar */}
        <div className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Administration
            </p>

            <h2 className="text-lg font-semibold text-slate-800">
              EMA Bangladesh Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">
                Administrator
              </p>

              <p className="text-xs text-slate-400">
                {role?.length ? role.join(" • ") : "Admin"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F2A5F] text-sm font-bold text-white">
              A
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;