import { useContext, useEffect, useRef, useState } from "react";
import defaultImage from "../assets/defaultimage.jpeg";
import AuthContext from "../AuhtContext";
import { addDoc, collection } from "firebase/firestore";
import db from "../firebase";
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { PhotoIcon } from "@heroicons/react/24/outline";
import DefaultProfileImage from "./DefaultProfileImage";
import TagInput from "./Tags";

export default function AddPost() {
  const { user, userData } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [percent, setPercent] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const imageBtnRef = useRef<HTMLInputElement>(null);
  const storage = getStorage();
  console.log(storage);
  async function handleAddPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const post = {
      title,
      content: description,
      likes: 0,
      postedBy: user?.uid,
      author: userData?.name,
      addedDate: new Date().toISOString(),
      likedBy: [],
      replies: [],
      imageUrl,
      videoUrl,
      tags: tags || [],
    };
    // add post to db
    await addDoc(collection(db, "posts"), post);
    setTitle("");
    setDescription("");
    setImage(undefined);
    setImageUrl("");
    setVideoUrl("");
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImage(e.target?.files?.[0]);
  }
  function handleFileUpload() {
    if (image) {
      const storageRef = ref(storage, `/images/${image?.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ); // update progress
          setPercent(percent);
        },
        (err) => alert(err.message),
        () => {
          // if the upload is an image set imageurl else if video set videourl
          getMetadata(uploadTask.snapshot.ref).then((metadata) => {
            if (metadata.contentType?.includes("image")) {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setImageUrl(url);
                setPercent(0);
              });
            } else if (metadata.contentType?.includes("video")) {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setVideoUrl(url);
                setPercent(0);
              });
            }
          });
        }
      );
    }
  }
  useEffect(() => {
    if (image) {
      handleFileUpload();
    }
  }, [image]);

  return (
    <form
      className="flex items-start w-full gap-3 p-4 mt-20 border-b md:p-8 md:mt-0 border-brand-brown"
      onSubmit={handleAddPost}
    >
      {userData?.imageUrl ? (
        <img
          src={userData?.imageUrl || defaultImage}
          className="flex-shrink-0 object-cover object-center w-10 h-10 rounded-full"
          alt="user-image"
        />
      ) : (
        <DefaultProfileImage username={userData?.name} />
      )}
      <div className="w-full">
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="w-full mt-1 text-2xl font-semibold bg-transparent outline-none text-brand-white"
          placeholder="Add a title"
          value={title}
        />
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Add a description"
          className="w-full mt-2 text-xs font-semibold bg-transparent outline-none text-brand-white "
        />
        <TagInput tags={tags} setTags={setTags} />
        {imageUrl && (
          <img
            src={imageUrl}
            alt="post-image"
            className="object-contain object-center w-full mt-2 rounded-md bg-brand-brown h-60"
          />
        )}
        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className="object-contain object-center w-full mt-2 rounded-md bg-brand-brown h-60"
          />
        )}
        {percent > 0 && (
          <div className="w-full h-2 mt-2 rounded-full bg-brand-brown">
            <div
              className={`h-2 rounded-full bg-brand-red`}
              style={{
                width: `${percent}%`,
              }}
            />
          </div>
        )}
        <div className="flex items-center mt-2">
          <input
            type="file"
            id="actual-btn"
            hidden
            ref={imageBtnRef}
            onChange={handleImageChange}
          />
          <label htmlFor="actual-btn">
            <PhotoIcon className="w-6 h-6 cursor-pointer text-brand-red" />
          </label>
          <div className="flex justify-end w-full">
            <button
              disabled={!title || !description}
              type="submit"
              className="transition-all duration-200 ease-in-out button-small bg-brand-red disabled:opacity-50 text-brand-white"
            >
              Add post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
