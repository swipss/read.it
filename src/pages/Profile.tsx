import { useNavigate, useParams } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../firebase";
import { useContext, useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Search from "../components/Search";
import defaultImage from "../assets/defaultimage.jpeg";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { PostType } from "./Home";
import Post from "../components/Post";
import AuthContext from "../AuhtContext";
import EditProfileModal from "../components/EditProfileModal";
import DefaultProfileImage from "../components/DefaultProfileImage";

type UserType = {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  bio: string;
  imageUrl: string;
  coverImageUrl: string;
};
export default function Profile() {
  const { userId } = useParams();
  const { user, userData } = useContext(AuthContext);
  const [profileUser, setUserProfile] = useState<UserType | null>(null);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  async function fetchUserData() {
    onSnapshot(doc(db, "users", String(userId)), (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as UserType);
      }
    });

    onSnapshot(collection(db, "posts"), (snapshot) => {
      const fetchedPosts: PostType[] = [];
      snapshot.forEach((doc) => {
        if (doc.data().postedBy === String(userId)) {
          fetchedPosts.push({ id: doc.id, ...doc.data() } as PostType);
        }
      });
      setUserPosts(fetchedPosts);
    });
  }

  useEffect(() => {
    fetchUserData();
  }, []);
  console.log(userData?.bio);

  return (
    <>
      <LeftSidebar />
      <Search />
      <div className="min-h-screen md:ml-80  md:mr-[400px] pb-20 md:pb-0  bg-brand-dark text-brand-white mt-16 md:mt-0">
        <div className="flex items-center gap-4 p-4 text-brand-white">
          <ArrowLeftIcon
            className="w-5 h-5 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <h1 className="text-xl font-bold">{profileUser?.name}</h1>
        </div>
        <div className="h-40 bg-brand-brown">
          {profileUser?.coverImageUrl && (
            <img
              src={profileUser?.coverImageUrl}
              alt="cover"
              className="object-cover w-full h-full "
            />
          )}
        </div>
        {/* check if profile belongs to authenticated user */}
        {user?.uid === userId ? (
          <button
            onClick={() => setIsEditingProfile(true)}
            className="float-right m-4 button-small bg-brand-red"
          >
            Edit profile
          </button>
        ) : (
          <button className="float-right m-4 button-small bg-brand-red">
            Follow
          </button>
        )}
        {isEditingProfile && (
          <EditProfileModal setIsEditingProfile={setIsEditingProfile} />
        )}
        {profileUser?.imageUrl ? (
          <img
            src={profileUser?.imageUrl || defaultImage}
            alt="profile"
            className="z-50 object-cover object-center w-32 h-32 ml-4 -mt-16 rounded-full outline outline-4 outline-brand-dark"
          />
        ) : (
          <DefaultProfileImage
            username={profileUser?.name}
            style="w-32 h-32 !-mt-16 ml-4 outline outline-4 outline-brand-dark z-50"
          />
        )}

        <div className="flex items-center justify-between p-4 border-b border-brand-brown">
          <div>
            <h1 className="text-xl font-bold">@{profileUser?.name}</h1>
            <p>{profileUser?.bio}</p>
            <div className="flex items-center gap-1 mt-2">
              <CalendarDaysIcon className="w-5 h-5" />
              <span className="text-sm ">
                Joined {moment(profileUser?.createdAt).format("MMMM YYYY")}
              </span>
            </div>
          </div>
        </div>
        {userPosts
          ?.sort(
            (a, b) =>
              new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
          )
          .map((post: PostType) => (
            <Post post={post} setIsSigningIn={setIsSigningIn} />
          ))}
      </div>
    </>
  );
}
