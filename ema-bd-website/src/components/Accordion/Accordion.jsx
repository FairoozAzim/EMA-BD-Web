import { useState } from "react";
import { MdOutlineExpandMore } from "react-icons/md";

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-xl border transition-all duration-300 ${
        isOpen
          ? "border-[#0F2A5F]/20 bg-white shadow-md"
          : "border-slate-200 bg-white hover:border-[#0F2A5F]/20 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
      >
        <h4
          className={`text-sm font-semibold leading-6 transition-colors duration-300 sm:text-base ${
            isOpen ? "text-[#0F2A5F]" : "text-slate-800"
          }`}
        >
          {title}
        </h4>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen
              ? "rotate-180 bg-[#0F2A5F] text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <MdOutlineExpandMore size={22} />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-7 text-slate-600 sm:px-6 sm:text-base">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;