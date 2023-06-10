import React, { Dispatch, useEffect } from "react";
import { Statuses, fetchPostsAsync, selectPosts, selectStatus } from "./postSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";


function Posts() {

  const posts = useAppSelector(selectPosts);
  const dispatch: Dispatch<any> = useDispatch();
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchPostsAsync());
  }, [dispatch])

  let contents;

  if (status !== Statuses.UpToDate) {
    contents = <div>{status}</div>
  } else {
      contents = <div className="card">
        <div className="card-body">
          <h3>{status}</h3>
          {posts && posts.length > 0 && posts.map(post => {
            return <div key={post.id} style={{margin:"5em"}}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          })}
        </div>
      </div>
  }

  return <div>
    <h1>{contents}</h1>
  </div>
}

export default Posts;
