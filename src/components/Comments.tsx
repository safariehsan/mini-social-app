import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { getComments } from "../services";

export interface IComment {
  id?: string;
  body: string;
  datetime: string;
  userId: string;
  postId: string;
}

const Comments = (props: any) => {
  const [commentsList, setCommentsList] = useState<IComment[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getComments(props.postId)
      .then((res: any) => {
        setCommentsList(res);
      })
      .catch((err) => setError(err));
  }, [props.isCommentsUpdated]);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : commentsList ? (
        <div className="card p-3 mt-2 border-info bg-light">
          <b className="pb-2">Comments:</b>
          {commentsList.map((item, index) => {
            return (
              <div
                key={index}
                className="alert alert-secondary p-2 my-1 border-secondary d-flex align-items-center gap-2"
                role="alert"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="blue"
                  className="bi bi-chat-right-text"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
                  <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                </svg>
                <div className="text-secondary text-sm"><small>{item.body}</small></div>
              </div>
            );
          })}
        </div>
      ) : (
        `(no comment!)`
      )}
    </div>
  );
};

export default Comments;
