import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import db from "../firebase";

const auth = getAuth();

export default function SignIn({
  setIsSigningIn,
  setIsCreatingAccount,
  isCreatingAccount,
}: {
  setIsSigningIn: React.Dispatch<React.SetStateAction<boolean>>;

  setIsCreatingAccount: React.Dispatch<React.SetStateAction<boolean>>;
  isCreatingAccount: boolean;
}) {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function validatePassword() {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  }

  function handleAuthError(err: any) {
    switch (err.code) {
      case "auth/email-already-in-use":
        setError("Email already in use.");
        break;
      case "auth/invalid-email":
        setError("Invalid email address format.");
        break;
      case "auth/weak-password":
        setError("Password should be at least 6 characters.");
        break;
      case "auth/user-not-found":
        setError("User not found.");
        break;
      case "auth/wrong-password":
        setError("Incorrect password.");
        break;
      default:
        setError("Something went wrong.");
        break;
    }
  }

  const register = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) {
      return;
    }

    try {
      if (isCreatingAccount) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const userRef = doc(db, "users", String(user?.uid));

        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: name,
          createdAt: new Date().toISOString(),
          bio: "",
        });

        setIsSigningIn(false);
        console.log("created user");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setIsSigningIn(false);
      }
    } catch (err: any) {
      handleAuthError(err);
    }

    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="fixed flex items-center justify-center bg-black bg-opacity-50  top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative w-full max-w-md max-h-full ">
        <div className="relative rounded-lg shadow bg-brand-dark">
          <button
            onClick={() => setIsSigningIn(false)}
            type="button"
            className="absolute top-3 right-2.5 text-white hover:bg-brand-dark  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            data-modal-hide="authentication-modal"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-brand-white ">
              Sign in to our platform
            </h3>
            <form className="space-y-6" onSubmit={register}>
              {isCreatingAccount && (
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-brand-white"
                  >
                    Display name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Matt123"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-brand-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-brand-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {isCreatingAccount && (
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-brand-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}
              {error && (
                <div className="text-sm font-medium text-brand-red">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full text-white bg-brand-red hover:bg-brand-red focus:ring-4 focus:outline-none focus:ring-brand-brown font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                {isCreatingAccount ? "Create account" : "Sign in"}
              </button>
              <div className="text-sm font-medium text-brand-white ">
                {isCreatingAccount
                  ? "Already have an account? "
                  : "Not registered? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingAccount(!isCreatingAccount);
                    setError("");
                  }}
                  className="text-brand-red hover:underline"
                >
                  {isCreatingAccount ? "Sign in" : "Create account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
