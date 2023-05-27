import { useContext, useEffect, useRef, useState } from "react";
import defaultImage from "../assets/defaultimage.jpeg";
import AuthContext from "../AuhtContext";
import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import {} from "firebase/storage";
import { handleFileUpload } from "../helpers/fileUpload";
import { CameraIcon } from "@heroicons/react/24/outline";
import DefaultProfileImage from "./DefaultProfileImage";

export default function EditProfileModal({
  setIsEditingProfile,
}: {
  setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user, userData } = useContext(AuthContext);
  const [name, setName] = useState(userData?.name);
  const [bio, setBio] = useState(userData?.bio ?? "");
  const [imageUrl, setImageUrl] = useState(userData?.imageUrl ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    userData?.coverImageUrl ?? ""
  );
  const [profileImagePercent, setProfileImagePercent] = useState(0);
  const [coverImagePercent, setCoverImagePercent] = useState(0);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [coverImage, setCoverImage] = useState<File | undefined>(undefined);
  const profileImageBtnRef = useRef<HTMLInputElement>(null);
  const coverImageBtnRef = useRef<HTMLInputElement>(null);

  async function updateProfile(e: React.FormEvent<HTMLFormElement>) {
    console.log("a");
    e.preventDefault();
    const docRef = doc(db, "users", String(user?.uid));
    await updateDoc(docRef, {
      name,
      bio: bio,
      imageUrl,
      coverImageUrl,
    });
    setName("");
    setBio("");
    setImageUrl("");

    setIsEditingProfile(false);
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0];
    setImage(file);
    if (file) {
      handleFileUpload(
        file,
        handleUploadSuccess,
        handleUploadProgress,
        handleUploadError
      );
    }
  }

  const handleUploadSuccess = (url: string) => {
    console.log("Upload successful. File URL:", url);
    setImageUrl(url);
    setProfileImagePercent(0);
  };

  const handleUploadProgress = (profileImagePercent: number) => {
    console.log("Upload progress:", profileImagePercent);
    setProfileImagePercent(profileImagePercent);
  };

  const handleUploadError = (errorMessage: string) => {
    console.error("Upload error:", errorMessage);
    alert(errorMessage);
    // Handle the error, such as displaying an error message to the user
  };

  useEffect(() => {
    if (image) {
      handleFileUpload(
        image,
        handleUploadSuccess,
        handleUploadProgress,
        handleUploadError
      );
    }
  }, [image]);
  function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0];
    setCoverImage(file);
    if (file) {
      handleFileUpload(
        file,
        handleCoverUploadSuccess,
        handleCoverUploadProgress,
        handleCoverUploadError
      );
    }
  }

  const handleCoverUploadSuccess = (url: string) => {
    console.log("Upload successful. File URL:", url);
    setCoverImageUrl(url);
    setCoverImagePercent(0);
  };

  const handleCoverUploadProgress = (coverImagePercent: number) => {
    console.log("Upload progress:", coverImagePercent);
    setCoverImagePercent(coverImagePercent);
  };

  const handleCoverUploadError = (errorMessage: string) => {
    console.error("Upload error:", errorMessage);
    alert(errorMessage);
    // Handle the error, such as displaying an error message to the user
  };

  useEffect(() => {
    if (coverImage) {
      handleFileUpload(
        coverImage,
        handleCoverUploadSuccess,
        handleCoverUploadProgress,
        handleCoverUploadError
      );
    }
  }, [coverImage]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center w-full max-h-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 md:inset-0">
      <div className="relative w-full max-w-md max-h-full ">
        <form
          className="relative rounded-lg shadow bg-brand-dark"
          onSubmit={(e) => updateProfile(e)}
        >
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditingProfile(false)}
                type="button"
                className=" text-white hover:bg-brand-dark  rounded-lg text-sm p-1.5  items-center"
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
              <h1 className="text-xl font-bold">Edit profile</h1>
            </div>
            <button
              type="submit"
              className="button-small bg-brand-red text-brand-white"
            >
              Save
            </button>
          </div>
          <div className="relative h-40 bg-brand-brown">
            {coverImageUrl && (
              <img
                src={coverImageUrl ? coverImageUrl : ""}
                alt="cover"
                className="object-cover object-center w-full h-full"
              />
            )}

            <input
              type="file"
              id="cover-btn"
              hidden
              ref={coverImageBtnRef}
              onChange={handleCoverImageChange}
            />
            <label htmlFor="cover-btn">
              <div className="absolute z-10 p-4 transition-all duration-100 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-80 left-1/2 top-1/2">
                {coverImagePercent === 0 ? (
                  <CameraIcon className="w-6 h-6 text-brand-white" />
                ) : (
                  <div className="w-6 h-6 text-brand-white animate-spin">
                    <svg
                      className="w-full h-full text-brand-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </label>
          </div>
          <input
            type="file"
            id="profile-btn"
            hidden
            ref={profileImageBtnRef}
            onChange={handleImageChange}
          />
          <div className="relative ml-4 w-max">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="profile"
                className="object-cover object-center w-32 h-32 -mt-12 border-4 rounded-full border-brand-dark bg-brand-dark"
              />
            ) : (
              <DefaultProfileImage
                username={name}
                style="object-cover object-center w-32 h-32 -mt-12 border-4 rounded-full border-brand-dark "
              />
            )}
            <label htmlFor="profile-btn">
              <div className="absolute z-10 p-4 transition-all duration-100 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-80 left-1/2 top-1/2">
                {profileImagePercent === 0 ? (
                  <CameraIcon className="w-6 h-6 text-brand-white" />
                ) : (
                  <div className="w-6 h-6 text-brand-white animate-spin">
                    <svg
                      className="w-full h-full text-brand-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </label>
          </div>
          <div className="flex flex-col gap-2 p-2">
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
                className="bg-transparent text-brand-white border border-brand-brown  text-sm rounded-lg focus:ring-brand-red focus:border-brand-red block w-full p-2.5"
                placeholder="Matt123"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block mb-2 text-sm font-medium text-brand-white"
              >
                Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                className="bg-transparent resize-none h-24  text-brand-white border border-brand-brown  text-sm rounded-lg focus:ring-brand-red focus:border-brand-red block w-full p-2.5"
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
