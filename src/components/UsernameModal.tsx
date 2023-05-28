import { useContext, useState } from "react";
import AuthContext from "../AuhtContext";
import { doc, setDoc } from "firebase/firestore";
import db from "../firebase";

export default function UsernameModal() {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState("");

  async function handleSetUsername(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // find the user in firestore by their uid and set the username
    await setDoc(
      doc(db, "users", String(user?.uid)),
      {
        name: username,
      },
      { merge: true }
    );
  }
  return (
    <div className="fixed flex items-center justify-center bg-black bg-opacity-50  top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative w-full max-w-md max-h-full ">
        <div className="relative rounded-lg shadow bg-brand-dark">
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-brand-white ">
              What should we call you?
            </h3>
            <form className="space-y-6" onSubmit={handleSetUsername}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-brand-white"
                >
                  Your username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="@matt12"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full  text-white bg-brand-red hover:bg-brand-red focus:ring-4 focus:outline-none focus:ring-brand-brown font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Set username
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
