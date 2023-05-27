export default function BottomBar({
  setIsSigningIn,
  setIsCreatingAccount,
}: {
  setIsSigningIn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreatingAccount: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function handleClickLogIn() {
    setIsSigningIn(true);
    setIsCreatingAccount(false);
  }
  function handleClickSignUp() {
    setIsSigningIn(true);
    setIsCreatingAccount(true);
  }

  return (
    <div
      id="default-sidebar"
      className="fixed bottom-0  z-40  w-full transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="w-full overflow-y-auto bg-brand-red ">
        <div className="border border-brand-brown gap-4  py-3 px-80 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl text-brand-white">
              Dont miss what's happening on read.it
            </h1>

            <p className="text-brand-white text-sm">
              People on read.it are the first to know.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handleClickLogIn}
              className="button-small border-brand-white border text-brand-white"
            >
              Log in
            </button>
            <button
              onClick={handleClickSignUp}
              className="button-small bg-brand-white"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
