import google from "../assets/google.png";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import db from "../firebase";

const provider = new GoogleAuthProvider();
const auth = getAuth();
export default function RightSidebar({
  setIsSigningIn,
}: {
  setIsSigningIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function handleSignInWithGoogle() {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        console.log("created user");
        const userRef = doc(db, "users", String(user?.uid));
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            name: null,
            createdAt: new Date().toISOString(),
            bio: "",
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
  // handle set username in firestore

  return (
    <>
      <aside
        id="default-sidebar"
        className="md:fixed block top-0 right-0 z-40 md:max-w-[400px] w-full transition-all duration-75 md:h-screen"
        aria-label="Sidebar"
      >
        <div className="flex flex-col items-center w-full h-full gap-4 p-4 overflow-y-auto border-l bg-brand-dark border-brand-brown ">
          <h1 className="text-2xl font-bold text-brand-white">
            New to read.it?
          </h1>
          <p className="text-xs text-brand-white">
            Sign up now to add posts yourself!
          </p>

          <button
            onClick={handleSignInWithGoogle}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-bold rounded-full bg-brand-white hover:bg-neutral-300"
          >
            <img src={google} className="w-5 h-5" />
            Sign in using Google
          </button>
          <button
            onClick={() => setIsSigningIn(true)}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-bold rounded-full bg-brand-white hover:bg-neutral-300"
          >
            Create account
          </button>
        </div>
      </aside>
    </>
  );
}
