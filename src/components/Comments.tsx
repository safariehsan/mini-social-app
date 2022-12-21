import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { getComments } from "../services";
import { useAuthState } from "react-firebase-hooks/auth";

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
  const [user] = useAuthState(auth);
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
          {commentsList.length === 0 ? (
            <mark>No Comment !</mark>
          ) : (
            commentsList.map((item, index) => {
              return (
                <div key={index} className="card mb-2" role="alert">
                  <div className="card-header text-secondary p-2 d-flex justify-content-between">
                    <div className="text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-emoji-smile"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                      </svg>{" "}
                      <small className="text-muted">{user?.displayName}</small>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-calendar3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      </svg>{" "}
                      <small className="text-muted">{item.datetime}</small>
                    </div>
                  </div>
                  <div className="card-body">
                    <small className="text-black">{item.body}</small>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        `(no comment!)`
      )}
    </div>
  );
};

export default Comments;
