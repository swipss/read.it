import { useContext } from "react";
import AuthContext from "../AuhtContext";
import { GlobeAmericasIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";

import defaultImage from "../assets/defaultimage.jpeg";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import DefaultProfileImage from "./DefaultProfileImage";

export default function LeftSidebar() {
  const { user, userData } = useContext(AuthContext);

  return (
    <aside
      id="default-sidebar"
      className="fixed bottom-0 z-40 w-full transition-all duration-75 md:w-80 md:h-screen"
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between py-4 pr-4 overflow-y-auto border-r md:flex-col md:h-full md:pl-28 bg-brand-dark border-brand-brown">
        <div>
          <a
            className="hidden pl-4 text-4xl font-bold text-brand-white md:block"
            href="/"
          >
            read<span className="text-brand-red">.</span>it
          </a>
          <ul className="flex gap-2 font-mediumspace-y md:flex-col md:mt-4">
            <li>
              <a
                href="#"
                className="flex items-center w-full px-4 py-2 text-xl font-semibold transition-all duration-75 rounded-full text-brand-white hover:bg-brand-brown"
              >
                <GlobeAmericasIcon className="w-6 h-6 text-brand-white" />
                <span className="ml-2">Explore</span>
              </a>
            </li>
            {user && (
              <li>
                <a
                  href={`/profile/${userData?.uid}`}
                  className="flex items-center w-full px-4 py-2 text-xl font-semibold transition-all duration-75 rounded-full text-brand-white hover:bg-brand-brown"
                >
                  <UserIcon className="w-6 h-6 text-brand-white" />
                  <span className="ml-2">Profile</span>
                </a>
              </li>
            )}
          </ul>
        </div>
        {user && (
          <div
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 p-2 break-words transition-all duration-100 rounded-full cursor-pointer hover:bg-brand-brown"
          >
            {userData?.imageUrl ? (
              <img
                src={userData?.imageUrl ? userData?.imageUrl : defaultImage}
                alt="defaultimage"
                className="flex-shrink-0 object-cover object-center w-10 h-10 rounded-full"
              />
            ) : (
              <DefaultProfileImage username={userData?.name} />
            )}
            <div className="flex-col hidden md:flex">
              <p className="text-sm font-bold text-brand-white">
                @{userData?.name}
              </p>
              <p className="text-xs break-all text-brand-white">
                {userData?.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}