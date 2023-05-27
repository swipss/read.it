import { HeartIcon } from "@heroicons/react/24/outline";
import { PostType } from "../pages/Home";
import defaultimage from "../assets/defaultimage.jpeg";
import moment from "moment";
import { doc, getDoc, setDoc } from "firebase/firestore";
import db from "../firebase";
import AuthContext, { IUserData } from "../AuhtContext";
import React, { useContext, useEffect, useState } from "react";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import DefaultProfileImage from "./DefaultProfileImage";
import Vibrant from "node-vibrant";
import { tagColors } from "./Tags";

export default function Post({
  post,
  setIsSigningIn,
}: {
  post: PostType;
  setIsSigningIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const hasUserLikedPost = post?.likedBy?.includes(String(user?.uid));
  const [postUser, setPostUser] = useState<IUserData | null>(null);

  async function fetchPostAuthor() {
    const dbRef = doc(db, "users", post?.postedBy);
    const docSnap = await getDoc(dbRef);
    if (docSnap.exists()) {
      setPostUser(docSnap.data() as IUserData);
    }
  }
  useEffect(() => {
    fetchPostAuthor();
  }, []);
  console.log(post?.tags);
  async function handleClickPostLike() {
    if (user) {
      await setDoc(doc(db, "posts", String(post.id)), {
        ...post,
        likes: hasUserLikedPost ? post.likes - 1 : post.likes + 1,
        likedBy: hasUserLikedPost
          ? post.likedBy.filter((id) => id !== String(user?.uid))
          : [...post.likedBy, String(user?.uid)],
      });
    } else {
      setIsSigningIn(true);
    }
  }

  function handlePostClick() {
    if (!user) {
      setIsSigningIn(true);
    } else {
      navigate(`/${post.id}`);
    }
  }
  return (
    <div
      onClick={() => handlePostClick()}
      className="flex items-start justify-start flex-shrink-0 w-full gap-2 p-4 transition-all duration-100 border-b cursor-pointer md:p-8 hover:bg-brand-brown text-brand-white border-brand-brown"
    >
      {postUser?.imageUrl ? (
        <img
          src={postUser?.imageUrl || defaultimage}
          alt="defaultimage"
          className="flex-shrink-0 object-cover object-center w-10 h-10 rounded-full"
        />
      ) : (
        <DefaultProfileImage username={postUser?.name} />
      )}
      <div>
        <div className="flex items-center gap-1">
          <p
            className="text-sm font-bold cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${post?.postedBy}`);
            }}
          >
            @{postUser?.name}
          </p>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <p className="text-xs font-normal">
            {moment(post?.addedDate).fromNow()}
          </p>
        </div>
        <div className="flex items-center gap-1 mt-1">
          {post?.tags?.map((tag, index) => (
            <p
              key={tag}
              className={`px-2 py-1 text-xs font-semibold text-white rounded-md ${tagColors[index]}`}
            >
              {tag}
            </p>
          ))}
        </div>

        <h1 className="text-xl font-semibold">{post?.title}</h1>
        <p className="text-base font-normal">{post?.content}</p>
        {post?.imageUrl && (
          <img
            src={post?.imageUrl}
            alt="postimage"
            className="object-cover object-center w-full rounded-md h-96"
          />
        )}
        {post?.videoUrl && (
          <video
            src={post?.videoUrl}
            className="object-cover w-full rounded-md h-80"
            controls
          />
        )}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center transition-all duration-300 m hover:text-brand-red">
            <HeartIcon
              className={` ${
                hasUserLikedPost && "fill-brand-red !text-brand-red"
              } w-8 h-8 p-1 -ml-2 text-brand-white hover:fill-brand-red hover:text-brand-red hover:bg-brand-red rounded-full cursor-pointer hover:bg-opacity-40 transition-all duration-300`}
              onClick={(e) => {
                e.stopPropagation();
                handleClickPostLike();
              }}
            />
            <p className="text-sm font-semibold">{post.likes}</p>
          </div>
          <div className="flex items-center ">
            <ChatBubbleOvalLeftIcon
              className={` w-8 h-8 p-1 text-white rounded-full`}
              onClick={(e) => {
                e.stopPropagation();
                handleClickPostLike();
              }}
            />
            <p className="text-sm font-semibold">
              {post?.replies?.length ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
