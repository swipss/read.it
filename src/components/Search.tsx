import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search() {
  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 right-0 z-40 md:max-w-[400px] w-full transition-all duration-75 md:h-screen"
      aria-label="Sidebar"
    >
      <div className="flex flex-col items-center w-full h-full p-4 overflow-y-auto border-l bg-brand-dark border-brand-brown ">
        <div className="flex items-center w-full gap-2 px-2 py-3 border rounded-full border-brand-brown">
          <MagnifyingGlassIcon className="w-5 h-5 text-brand-white" />
          <input
            type="text"
            placeholder="Search read.it"
            className="w-full bg-transparent border-none outline-none text-brand-white placeholder-brand-white"
          />
        </div>
      </div>
    </aside>
  );
}
