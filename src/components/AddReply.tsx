import { useContext, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import db from "../firebase";
import AuthContext from "../AuhtContext";
import { PostType } from "../pages/Home";
import DefaultProfileImage from "./DefaultProfileImage";

export default function AddReply({
  postId,
  post,
}: {
  postId: string | undefined;
  post: PostType | null;
}) {
  const [comment, setComment] = useState("");
  const { user, userData } = useContext(AuthContext);

  async function handleAddComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (post) {
      await setDoc(doc(db, "posts", String(postId)), {
        ...post,
        replies: [
          ...post.replies,
          {
            content: comment,
            addedAt: new Date().toISOString(),
            postedBy: user?.uid,
            author: userData?.name,
            likes: 0,
            likedBy: [],
          },
        ],
      });
      setComment("");
    }
  }

  return (
    <form
      onSubmit={handleAddComment}
      className="flex items-center gap-2 p-5 border-b border-brand-brown"
    >
      {userData?.imageUrl ? (
        <img
          src={userData?.imageUrl}
          alt="defaultimage"
          className="flex-shrink-0 w-10 h-10 rounded-full"
        />
      ) : (
        <DefaultProfileImage username={userData?.name} />
      )}
      <input
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        type="text"
        placeholder="Send in your reply!"
        className="bg-transparent w-full placeholder:text-[#A79797] text-xl font-semibold outline-none text-brand-white"
      />
      <button
        type="submit"
        disabled={!comment}
        className="button-small bg-brand-red text-brand-white disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
