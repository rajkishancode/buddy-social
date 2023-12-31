import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { followUser, unfollowUser, useProfile } from "../../profile";
import { useAuth } from "../../auth";
import { getFollowingStatus } from "../utils";
import { CircularLoader } from "../../../common";

export const UserCard = ({
  _id,
  bio,
  firstName,
  lastName,
  username,
  profileImage,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { loggedInUserfollowings } = useProfile();
  const [isFollowLoader, setIsFollowLoader] = useState(false);
  const isFollowing = getFollowingStatus(loggedInUserfollowings, _id);

  const handleFollowClick = (userId) => {
    let followClickDispatchPromise;
    setIsFollowLoader(true);

    if (!isFollowing) {
      followClickDispatchPromise = dispatch(followUser(userId));
    } else {
      followClickDispatchPromise = dispatch(unfollowUser(userId));
    }

    followClickDispatchPromise.finally(() => {
      setIsFollowLoader(false);
    });
  };

  return (
    <article className="p-2 pt-3 mb-4 rounded-lg shadow-md flex items-center border dark:border-gray-700 dark:bg-gray-800">
      <Link to={`/profile/${_id}`} className="flex items-center">
        {profileImage ? (
          <img
            loading="lazy"
            src={profileImage.url}
            alt={profileImage.original_filename}
            className="w-10 h-10 mr-4 object-cover object-top flex-shrink-0 rounded-full bg-gray-200"
          />
        ) : (
          <div className="w-10 h-10 mr-4 text-lg flex flex-shrink-0 items-center justify-center font-semibold rounded-full bg-blue-500 text-white">
            {firstName[0].toUpperCase()}
          </div>
        )}

        <div>
          <p className="mr-1 text-sm sm:text-base font-semibold flex items-center line-clamp-1">
            {firstName} {lastName}
            <span className="hidden sm:inline text-gray-500 dark:text-gray-400 text-sm font-normal ml-2">
              @{username}
            </span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {bio}
          </p>
        </div>
      </Link>
      {username !== user.username && (
        <button
          disabled={isFollowLoader}
          onClick={() => handleFollowClick(_id)}
          className="btn btn-primary ml-auto relative self-start text-xs md:text-sm py-1 px-3"
        >
          {isFollowLoader && <CircularLoader size="1rem" position="center" />}
          <span className={isFollowLoader ? "invisible" : ""}>
            {isFollowing ? "Following" : "Follow"}
          </span>
        </button>
      )}
    </article>
  );
};

UserCard.defaultProps = {
  _id: "",
  bio: "",
  firstName: "",
  lastName: "",
  username: "",
  profileImage: null,
};
