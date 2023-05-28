import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { TUserData } from "../AuhtContext";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";
import useDebounce from "../helpers/useDebounce";
import DefaultProfileImage from "./DefaultProfileImage";
import { useOutsideClick } from "../helpers/useOutsideClick";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState<TUserData[]>([]);
  const [isSearchResultDropdownOpen, setIsSearchResultDropdownOpen] =
    useState(false);
  const searchResultRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  useOutsideClick(searchResultRef, () => {
    setIsSearchResultDropdownOpen(false);
    setSearchResult([]);
  });

  // fetch users from firestore
  async function fetchUsers() {
    setSearchResult([]);
    setLoading(true);
    const usersRef = collection(db, "users");
    await getDocs(usersRef).then((querySnapshot) => {
      const users: TUserData[] = [];
      querySnapshot.forEach((doc) => {
        // check if username in input
        if (doc.data().name.toLowerCase().includes(input.toLowerCase())) {
          users.push(doc.data() as TUserData);
        }
      });
      setSearchResult(users);
      setLoading(false);
    });
  }

  // use debounce to search for users
  const debouncedSearchTerm = useDebounce(input, 1000);
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchUsers();
    }
  }, [debouncedSearchTerm]);
  console.log(searchResult);

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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            onClick={() => setIsSearchResultDropdownOpen(true)}
            placeholder="Search read.it"
            className="w-full bg-transparent border-none outline-none text-brand-white placeholder-brand-white"
          />
        </div>
      </div>
      {isSearchResultDropdownOpen && (
        <SearchResultDropdown
          searchResults={searchResult}
          refr={searchResultRef}
          loading={loading}
        />
      )}
    </aside>
  );
}

function SearchResultDropdown({
  searchResults,
  refr,
  loading,
}: {
  searchResults: TUserData[];
  refr?: React.MutableRefObject<HTMLDivElement | null>;
  loading: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div ref={refr} className="absolute z-50 w-full p-4 mt-2 top-12">
      <div className="z-50 flex flex-col p-2 border rounded-lg bg-brand-dark border-brand-brown text-brand-white">
        {searchResults?.length === 0 && (
          <div className="flex items-center justify-center p-2 rounded-lg cursor-pointer ">
            <span className="text-sm font-semibold">
              {loading ? (
                <>Searching...</>
              ) : (
                <>Try searching for people or keywords</>
              )}
            </span>
          </div>
        )}
        {searchResults?.map((user) => (
          <div
            key={user?.uid}
            onClick={() => navigate(`/profile/${user?.uid}`)}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-brand-brown"
          >
            {user?.imageUrl ? (
              <img
                src={user?.imageUrl}
                className="w-10 h-10 rounded-full bg-brand-brown"
              />
            ) : (
              <DefaultProfileImage username={user?.name} />
            )}

            <span className="text-sm font-semibold">{user?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
