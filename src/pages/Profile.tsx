import { useNavigate, useParams } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import db from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
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
import RightSidebar from "../components/RightSidebar";
import SignIn from "../components/SignIn";
import { useOutsideClick } from "../helpers/useOutsideClick";

type UserType = {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  bio: string;
  imageUrl: string;
  coverImageUrl: string;
  following: string[];
  followers: string[];
};
export default function Profile() {
  const { userId } = useParams();
  const { user, userData } = useContext(AuthContext);
  const [profileUser, setUserProfile] = useState<UserType | null>(null);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isHoveringFollowButton, setIsHoveringFollowButton] = useState(false);
  const [profileFollowers, setProfileFollowers] = useState<UserType[]>([]);
  const [profileFollowing, setProfileFollowing] = useState<UserType[]>([]);
  const [clickedTab, setClickedTab] = useState<
    "followers" | "following" | null
  >(null);
  const refr = useRef(null);
  useOutsideClick(refr, () => {
    setClickedTab(null);
  });

  const isSignedInUserFollowing = userData?.following?.includes(
    String(profileUser?.uid)
  );

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

  async function handleClickFollow() {
    if (!user) {
      setIsSigningIn(true);
      return;
    }

    const userUid = String(user.uid);
    const profileUserUid = String(profileUser?.uid);
    const userRef = doc(db, "users", userUid);
    const profileUserRef = doc(db, "users", profileUserUid);

    const batch = writeBatch(db);

    if (!isSignedInUserFollowing) {
      const updatedUserData = {
        ...userData,
        following: [...(userData?.following ?? []), profileUserUid],
      };

      const updatedProfileUser = {
        ...profileUser,
        followers: [...(profileUser?.followers ?? []), userUid],
      };

      batch.set(userRef, updatedUserData);
      batch.set(profileUserRef, updatedProfileUser);
    } else {
      const updatedUserData = {
        ...userData,
        following: userData?.following?.filter(
          (followingId) => followingId !== profileUserUid
        ),
      };

      const updatedProfileUser = {
        ...profileUser,
        followers: profileUser?.followers?.filter(
          (followerId) => followerId !== userUid
        ),
      };

      batch.set(userRef, updatedUserData);
      batch.set(profileUserRef, updatedProfileUser);
    }

    await batch.commit();
  }

  // fetch users that the profile follows with profileUser.following
  async function fetchProfileFollowingUsers() {
    const followingUsersSnapshot = await getDocs(
      query(
        collection(db, "users"),
        where("uid", "in", profileUser?.following ?? [])
      )
    );

    const followingUsers = followingUsersSnapshot.docs.map(
      (doc) => doc.data() as UserType
    );

    setProfileFollowing(followingUsers);
  }

  async function fetchProfileFollowersUsers() {
    const followersUsersSnapshot = await getDocs(
      query(
        collection(db, "users"),
        where("uid", "in", profileUser?.followers ?? [])
      )
    );

    const followersUsers = followersUsersSnapshot.docs.map(
      (doc) => doc.data() as UserType
    );

    setProfileFollowers(followersUsers);
  }

  async function fetchProfileUsers() {
    await Promise.all([
      fetchProfileFollowingUsers(),
      fetchProfileFollowersUsers(),
    ]);
  }

  useEffect(() => {
    fetchUserData();
    fetchProfileUsers();
  }, [userData]);

  return (
    <>
      <LeftSidebar />
      {isSigningIn && (
        <SignIn
          setIsSigningIn={setIsSigningIn}
          isCreatingAccount={isCreatingAccount}
          setIsCreatingAccount={setIsCreatingAccount}
        />
      )}
      {!user ? <RightSidebar setIsSigningIn={setIsSigningIn} /> : <Search />}
      <div className="min-h-screen md:ml-80  md:mr-[400px] pb-20 md:pb-0  bg-brand-dark text-brand-white mt-20  md:mt-0">
        <div className="flex items-center gap-4 p-4 text-brand-white">
          <ArrowLeftIcon
            className="w-5 h-5 cursor-pointer"
            onClick={() => navigate(-1)}
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
          <button
            onClick={handleClickFollow}
            onMouseOver={() => setIsHoveringFollowButton(true)}
            onMouseLeave={() => setIsHoveringFollowButton(false)}
            className={`float-right m-4 border button-small transition-all duration-75 ${
              isSignedInUserFollowing
                ? " border-brand-white bg-brand-dark text-brand-white hover:bg-brand-red hover:bg-opacity-10 hover:text-brand-red hover:border-brand-red"
                : "bg-brand-red border-brand-red"
            } `}
          >
            {isSignedInUserFollowing ? (
              isHoveringFollowButton ? (
                <span>Unfollow</span>
              ) : (
                <span>Following</span>
              )
            ) : (
              <span>Follow</span>
            )}
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

        <div className="flex items-center justify-between w-full p-4 border-b border-brand-brown">
          <div>
            <h1 className="text-xl font-bold">@{profileUser?.name}</h1>
            <p>{profileUser?.bio}</p>
            <div className="flex items-center gap-1 mt-2">
              <CalendarDaysIcon className="w-5 h-5" />
              <span className="text-sm ">
                Joined {moment(profileUser?.createdAt).format("MMMM YYYY")}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center justify-center gap-1">
                <span className="font-bold">
                  {profileUser?.following?.length ?? 0}
                </span>
                <p
                  onClick={() => setClickedTab("following")}
                  className="text-sm cursor-pointer hover:underline"
                >
                  Following
                </p>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="font-bold">
                  {profileUser?.followers?.length ?? 0}
                </span>
                <p
                  onClick={() => setClickedTab("followers")}
                  className="text-sm cursor-pointer hover:underline"
                >
                  Followers
                </p>
              </div>
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
        {clickedTab && (
          <ProfileFollowingAndFollowersModal
            profileFollowing={profileFollowing}
            profileFollowers={profileFollowers}
            clickedTab={clickedTab}
            setClickedTab={setClickedTab}
            refr={refr}
          />
        )}
      </div>
    </>
  );
}

function ProfileFollowingAndFollowersModal({
  profileFollowing,
  profileFollowers,
  clickedTab,
  setClickedTab,
  refr,
}: {
  profileFollowing: UserType[];
  profileFollowers: UserType[];
  clickedTab: string;
  setClickedTab: React.Dispatch<
    React.SetStateAction<"followers" | "following" | null>
  >;
  refr: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center w-full max-h-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 md:inset-0">
      <div ref={refr} className="relative w-full max-w-md max-h-full ">
        <div className="relative rounded-lg shadow bg-brand-dark">
          <div className="flex items-center justify-center">
            <button
              onClick={() => setClickedTab("following")}
              className={`${
                clickedTab === "following" && "border-brand-red"
              } border-b-4 rounded-tl-lg  border-brand-dark w-full p-5 hover:bg-brand-brown transition-all duration-100`}
            >
              Following
            </button>
            <button
              onClick={() => setClickedTab("followers")}
              className={`${
                clickedTab === "followers" && "border-brand-red"
              } border-b-4 rounded-tr-lg  border-brand-dark w-full p-5 transition-all duration-100 hover:bg-brand-brown`}
            >
              Followers
            </button>
          </div>
          <div className="flex flex-col">
            {clickedTab === "following" ? (
              <>
                {profileFollowing.length === 0 && (
                  <div className="flex items-center justify-center w-full h-32">
                    <p className="text-lg text-center text-brand-white">
                      No following yet
                    </p>
                  </div>
                )}
                {profileFollowing?.map((user: any) => (
                  <div>
                    <div className="flex items-center justify-between p-4 border-b border-brand-brown">
                      <div className="flex items-center gap-2">
                        {user?.imageUrl ? (
                          <img
                            src={user?.imageUrl}
                            alt="profile"
                            className="object-cover object-center w-12 h-12 rounded-full"
                          />
                        ) : (
                          <DefaultProfileImage
                            username={user?.name}
                            style="w-12 h-12 rounded-full"
                          />
                        )}
                        <div>
                          <a
                            href={`/profile/${user?.uid}`}
                            className="text-lg font-bold hover:underline"
                          >
                            {user?.name}
                          </a>
                          <p>{user?.bio}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {profileFollowers.length === 0 && (
                  <div className="flex items-center justify-center w-full h-32">
                    <p className="text-lg text-center text-brand-white">
                      No following yet
                    </p>
                  </div>
                )}
                {profileFollowers?.map((user: any) => (
                  <div>
                    <div className="flex items-center justify-between p-4 border-b border-brand-brown">
                      <div className="flex items-center gap-2">
                        {user?.imageUrl ? (
                          <img
                            src={user?.imageUrl}
                            alt="profile"
                            className="object-cover object-center w-12 h-12 rounded-full"
                          />
                        ) : (
                          <DefaultProfileImage
                            username={user?.name}
                            style="w-12 h-12 rounded-full"
                          />
                        )}
                        <div>
                          <a
                            href={`/profile/${user?.uid}`}
                            className="text-lg font-bold hover:underline"
                          >
                            {user?.name}
                          </a>
                          <p>{user?.bio}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
