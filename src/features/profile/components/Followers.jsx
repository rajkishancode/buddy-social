import React from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../profileSlice";
import { UserCard } from "../../users";

export const Followers = () => {
  const { currentUser } = useProfile();
  const { followers } = currentUser;

  return (
    <div className="p-4">
      {followers?.length > 0 ? (
        followers.map((user) => <UserCard key={user._id} {...user} />)
      ) : (
        <p className="text-center font-semibold mt-8">
          You don't have any follower, please connect with people.
          <Link to="/explore" className="text-blue-500 hover:underline ml-1">
            Explore
          </Link>
        </p>
      )}
    </div>
  );
};
