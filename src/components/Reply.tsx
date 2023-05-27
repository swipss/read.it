import { PostType, ReplyType } from "../pages/Home";
import defaultImage from "../assets/defaultimage.jpeg";
import moment from "moment";
import { HeartIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuhtContext";
import { useContext } from "react";
import { doc, setDoc } from "firebase/firestore";
import db from "../firebase";

export default function Reply({
  reply,
  post,
  postId,
}: {
  reply: ReplyType;
  post: PostType;
  postId: string | undefined;
}) {
  const { user } = useContext(AuthContext);
  const hasUserLikedReply = reply?.likedBy?.includes(String(user?.uid));
  async function handleReplyLikeClick() {
    if (reply) {
      await setDoc(doc(db, "posts", String(postId)), {
        ...post,
        replies: post.replies.map((rep) => {
          if (rep === reply) {
            return {
              ...rep,
              likes: hasUserLikedReply ? rep.likes - 1 : rep.likes + 1,
              likedBy: hasUserLikedReply
                ? rep.likedBy.filter((id) => id !== String(user?.uid))
                : [...rep.likedBy, String(user?.uid)] ?? [],
            };
          }
          return rep;
        }),
      });
    }
  }
  return (
    <div className="flex items-start gap-2 p-5 border-b text-brand-white border-brand-brown">
      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-brand-brown">
        <p className="text-2xl font-bold text-brand-white">
          {reply?.author?.[0].toUpperCase()}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <p className="text-sm font-bold">@{reply.author}</p>
          <div className="w-1 h-1 bg-gray-100 rounded-full" />

          <p className="text-xs">{moment(reply.addedAt).fromNow()}</p>
        </div>
        <p className="text-base font-normal">{reply.content}</p>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center gap-1">
            <HeartIcon
              onClick={() => handleReplyLikeClick()}
              className={` w-5 h-5 text-gray-100 transition-all duration-75 cursor-pointer hover:text-brand-red hover:fill-brand-red ${
                hasUserLikedReply && "!text-brand-red fill-brand-red"
              }`}
            />
            <p className="text-sm">{reply.likes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
