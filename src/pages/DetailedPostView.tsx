import { useNavigate, useParams } from "react-router-dom";
import { PostType } from "./Home";
import { useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import db from "../firebase";
import AuthContext from "../AuhtContext";
import LeftSidebar from "../components/LeftSidebar";
import Search from "../components/Search";
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import defaultImage from "../assets/defaultimage.jpeg";
import moment from "moment";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AddReply from "../components/AddReply";
import Reply from "../components/Reply";
import DefaultProfileImage from "../components/DefaultProfileImage";
import { tagColors } from "../components/Tags";

export default function DetailedPostView() {
  const { postId } = useParams();
  const [post, setPost] = useState<PostType | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const hasUserLikedPost = post?.likedBy?.includes(String(user?.uid));
  const [postUser, setPostUser] = useState<any>(null);

  useEffect(() => {
    async function fetchPostAuthor() {
      const dbRef = doc(db, "users", String(post?.postedBy));
      const docSnap = await getDoc(dbRef);
      if (docSnap.exists()) {
        setPostUser(docSnap.data());
      }
    }
    fetchPostAuthor();
  }, [post?.postedBy]);
  async function handleClickPostLike() {
    if (post) {
      // Check if post.likedBy is undefined, assign an empty array

      await setDoc(doc(db, "posts", String(postId)), {
        ...post,
        likes: hasUserLikedPost ? post.likes - 1 : post.likes + 1,
        likedBy: hasUserLikedPost
          ? post.likedBy.filter((id) => id !== String(user?.uid))
          : [...post.likedBy, String(user?.uid)],
      });
    }
  }

  useEffect(() => {
    async function fetchPost() {
      const dbRef = collection(db, "posts");
      onSnapshot(dbRef, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          if (doc.id === postId) {
            setPost(doc.data() as PostType);
          }
        });
      });
    }

    fetchPost();
  }, [postId]);

  if (!user) {
    navigate("/");
  }

  return (
    <>
      <LeftSidebar />
      <Search />
      <div>
        <div className="min-h-screen md:ml-80 md:mr-[400px] bg-brand-dark pt-4  pb-24 md:pb-0">
          <div className="flex items-center gap-4 p-4 mt-12 border-b text-brand-white md:mt-0 border-brand-brown">
            <ArrowLeftIcon
              className="w-5 h-5 rounded-full cursor-pointer hover:bg-brand-brown"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-xl font-bold">Post</h1>
          </div>

          <div className="flex flex-col items-start justify-start flex-shrink-0 w-full gap-2 p-5 border-b text-brand-white border-brand-brown">
            <div className="flex items-center gap-2">
              {postUser?.imageUrl ? (
                <img
                  src={postUser?.imageUrl || defaultImage}
                  alt="defaultimage"
                  className="object-cover object-center w-10 h-10 rounded-full"
                />
              ) : (
                <DefaultProfileImage username={postUser?.name} />
              )}
              <p
                className="text-sm font-bold cursor-pointer hover:underline"
                onClick={() => navigate(`/profile/${post?.postedBy}`)}
              >
                @{postUser?.name}
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
            <p className="text-xl font-semibold">{post?.title}</p>
            <p className="text-base font-normal break-all">{post?.content}</p>
            {/* if imageurl is an image, show image, if video show video */}
            {post?.imageUrl && (
              <img
                src={post?.imageUrl}
                alt="postimage"
                className="object-cover w-full h-full rounded-md"
              />
            )}
            {post?.videoUrl && (
              <video
                src={post?.videoUrl}
                className="object-cover rounded-md w-max h-96"
                controls
              />
            )}
            <div className="flex items-center gap-1 text-sm">
              <p>{moment(post?.addedDate).format("HH:mm")}</p>
              <div className="w-1 h-1 bg-gray-100 rounded-full" />
              <p>{moment(post?.addedDate).format("MMM DD, YYYY")}</p>
            </div>
            <div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 transition-all duration-300 m hover:text-brand-red">
                  <HeartIcon
                    className={` ${
                      hasUserLikedPost && "fill-brand-red !text-brand-red"
                    } w-5 h-5 text-brand-white hover:fill-brand-red hover:text-brand-red rounded-full cursor-pointer hover:bg-opacity-40 transition-all duration-300`}
                    onClick={() => handleClickPostLike()}
                  />
                  <p className="text-sm ">{post?.likes ?? 0} likes</p>
                </div>
                <div className="flex items-center gap-1">
                  <ChatBubbleOvalLeftIcon
                    className={` w-5 h-5 text-white rounded-full`}
                  />
                  <p className="text-sm ">
                    {post?.replies?.length ?? 0} comments
                  </p>
                </div>
              </div>
            </div>
          </div>
          <AddReply postId={postId} post={post} />
          {post?.replies?.sort().map((reply) => (
            <Reply reply={reply} post={post} postId={postId} />
          ))}
        </div>
      </div>
    </>
  );
}
