import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { getPosts, PostCard, usePosts } from "../posts";
import { useProfile } from "../profile";
import { getExploreFeed } from "./utils";
import {
  CircularLoader,
  useScrollToTop,
  useDocumentTitle,
  useInfiniteScroll,
} from "../../common";

export const Explore = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { posts, isLoading } = usePosts();
  const { loggedInUserfollowings } = useProfile();
  const exploreFeed = getExploreFeed(user, posts, loggedInUserfollowings);
  const { feed, hasMorePosts, setObserverRef } = useInfiniteScroll(exploreFeed);

  useScrollToTop();
  useDocumentTitle("Explore");

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <main className="main pb-12 px-2 md:px-0">
      <h4 className="font-semibold text-blue-500 my-6 md:mt-0 max-w-xl mx-auto text-center">
        Explore Feed
      </h4>
      {isLoading ? (
        <CircularLoader size="2rem" customStyle="mt-8 text-blue-500" />
      ) : feed.length > 0 ? (
        <>
          {feed.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
          {hasMorePosts ? (
            <span ref={setObserverRef}>
              <CircularLoader size="2rem" customStyle="mt-8 text-blue-500" />
            </span>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm">
              You have reached the end.
            </p>
          )}
        </>
      ) : (
        <p className="text-center font-semibold mt-8">
          No post to show.
          <Link to="/" className="text-blue-500 hover:underline ml-1">
            Feed
          </Link>
        </p>
      )}
    </main>
  );
};
