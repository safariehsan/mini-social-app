import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";

interface IComment {
  id: string;
  body: string;
  datetime: string;
  userId: string;
  postId: string;
}

const Comments = (props: any) => {
  const commentsCollection = collection(db, "comments");
  const commentsDoc = query(
    commentsCollection,
    where("postId", "==", props.postId)
  );
  const [commentsList, setCommentsList] = useState<IComment[] | null>(null);
  const [error, setError] = useState("");
  const getComments = async () => {
    try {
      const data = await getDocs(commentsDoc);
      const comments = data.docs.map((comment) => ({
        ...comment.data(),
        id: comment.id,
      }));
      setCommentsList(comments as IComment[]);
    } catch (err) {
      setError("Please login to your account, in order to view comments");
    }
  };
  useEffect(() => {
    getComments();
  }, []);
  console.log(commentsList)

  return (
    <div>
      {commentsList
        ? commentsList.map((item, index) => {
            return <p key={index}>{item.body}</p>;
          })
        : `${error} (no comment!)`}
    </div>
  );
};

export default Comments;
