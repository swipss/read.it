import { useContext, useEffect, useState } from "react";

import { collection, onSnapshot } from "firebase/firestore";
import db from "../firebase";
import SignIn from "../components/SignIn";
import Post from "../components/Post";
import AuthContext from "../AuhtContext";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import BottomBar from "../components/BottomBar";
import Search from "../components/Search";
import UsernameModal from "../components/UsernameModal";
import AddPost from "../components/AddPost";
import { PostSSkekeleton } from "../components/PostSkeleton";

export type PostType = {
  id: string;
  title: string;
  content: string;
  likes: number;
  postedBy: string;
  author: string;
  addedDate: Date;
  likedBy: string[];
  replies: ReplyType[];
  imageUrl: string;
  videoUrl: string;
  tags: string[];
};

export type ReplyType = {
  content: string;
  likes: number;
  postedBy: string;
  author: string;
  addedAt: Date;
  likedBy: string[];
};

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(true);
  const { user, userData } = useContext(AuthContext);
  const [loading, setIsLoading] = useState(true);

  async function fetchPosts() {
    setIsLoading(true);
    onSnapshot(collection(db, "posts"), (snapshot) => {
      const fetchedPosts: PostType[] = [];
      snapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() } as PostType);
      });
      setPosts(fetchedPosts);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <LeftSidebar />
      {!user ? (
        <>
          <RightSidebar setIsSigningIn={setIsSigningIn} />

          <BottomBar
            setIsSigningIn={setIsSigningIn}
            setIsCreatingAccount={setIsCreatingAccount}
          />
        </>
      ) : (
        <Search />
      )}
      <div className="min-h-screen md:ml-80 md:mr-[400px] bg-brand-dark pb-24 md:pb-0">
        {loading ? (
          <PostSSkekeleton />
        ) : (
          <>
            {!userData?.name && user && <UsernameModal />}

            {isSigningIn && (
              <SignIn
                setIsSigningIn={setIsSigningIn}
                setIsCreatingAccount={setIsCreatingAccount}
                isCreatingAccount={isCreatingAccount}
              />
            )}
            {user && <AddPost />}
            <div>
              {posts
                .sort(
                  (a, b) =>
                    new Date(b.addedDate).getTime() -
                    new Date(a.addedDate).getTime()
                )
                .map((post) => (
                  <Post post={post} setIsSigningIn={setIsSigningIn} />
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
