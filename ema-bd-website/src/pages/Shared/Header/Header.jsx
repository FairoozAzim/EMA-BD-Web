import { NavLink } from 'react-router-dom';
import logo from '../../../Assets/EMA BD LOGO.png';
import { CiMenuFries } from 'react-icons/ci';
import { IoClose, IoChevronDown } from 'react-icons/io5';
import { useState } from 'react';

const navItems = [
  { name: 'Home', to: '/', end: true },
  {
    name: 'About Us',
    to: '/about',
    dropdown: [
      { name: 'Speech from EUD', to: '/keynoteEud' },
      { name: 'Speech from EMA CR', to: '/keynoteCR' },
    ],
  },
  { name: 'Our Team', to: 'team' },
  { name: 'Student and Alumni', to: 'alumni' },
  { name: 'Events', to: 'events' },
  { name: 'Blog', to: 'blogs' },
  { name: 'FAQ', to: 'faq' },
  { name: 'Contact', to: 'contact' },
];

const linkClass = ({ isActive }) =>
  `transition-colors duration-200 ${
    isActive
      ? 'text-[#0F2A5F] font-semibold'
      : 'text-gray-700 hover:text-[#C23911]'
  }`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 z-[1000] w-full bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        {/* Logo */}
        <NavLink to="/" className="w-32 shrink-0 md:w-36" onClick={closeMenu}>
          <img
            src={logo}
            alt="Erasmus Mundus Association - Bangladesh logo"
            className="w-full"
          />
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) =>
            item.dropdown ? (
              <div key={item.name} className="group relative">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-1 py-2 text-sm font-medium ${linkClass({ isActive })}`
                  }
                >
                  {item.name}
                  <IoChevronDown className="mt-0.5 text-xs transition-transform duration-200 group-hover:rotate-180" />
                </NavLink>

                <div className="invisible absolute left-0 top-full min-w-[220px] translate-y-1 rounded-lg bg-white py-2 opacity-0 shadow-lg ring-1 ring-black/5 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.dropdown.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      className={({ isActive }) =>
                        `block px-5 py-2.5 text-sm whitespace-nowrap transition-colors ${
                          isActive
                            ? 'bg-gray-50 text-[#0F2A5F] font-semibold'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#C23911]'
                        }`
                      }
                    >
                      {sub.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `py-2 text-sm font-medium ${linkClass({ isActive })}`
                }
              >
                {item.name}
              </NavLink>
            ),
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-gray-800 lg:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <IoClose /> : <CiMenuFries />}
        </button>
      </div>

      <hr className="border-t border-gray-200" />

      {/* Mobile nav drawer */}
      <div
        className={`fixed right-0 top-0 z-[1000] h-screen w-[80%] max-w-xs transform bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-end px-6 pt-5">
          <button
            onClick={closeMenu}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close menu"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <nav className="flex flex-col overflow-y-auto px-3 py-4 pt-6">
          {navItems.map((item) =>
            item.dropdown ? (
              <MobileDropdown key={item.name} item={item} closeMenu={closeMenu} />
            ) : (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.end}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0F2A5F]/5 text-[#0F2A5F] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ),
          )}
        </nav>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}
    </header>
  );
};

function MobileDropdown({ item, closeMenu }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-[15px] font-medium text-gray-700 hover:bg-gray-50"
      >
        {item.name}
        <IoChevronDown
          className={`text-sm text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="ml-2 flex flex-col border-l-2 border-gray-100 pl-4">
          {item.dropdown.map((sub) => (
            <NavLink
              key={sub.to}
              to={sub.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-md px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'text-[#0F2A5F] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {sub.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default Header;