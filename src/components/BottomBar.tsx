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
      className="fixed bottom-0 z-40 w-full "
      aria-label="Sidebar"
    >
      <div className="w-full overflow-y-auto bg-brand-red ">
        <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 border md:flex-row border-brand-brown md:px-80">
          <div>
            <h1 className="text-2xl font-bold text-brand-white">
              Dont miss what's happening on read.it
            </h1>

            <p className="text-sm text-brand-white">
              People on read.it are the first to know.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClickLogIn}
              className="border button-small border-brand-white text-brand-white"
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
