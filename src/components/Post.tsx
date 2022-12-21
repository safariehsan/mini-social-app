import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { PostType } from "../components/Posts";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import { getComments } from "../services";

interface IPost {
  post: PostType;
}

interface ILike {
  likeId: string;
  userId: string;
}

export const PostItem = (props: IPost) => {
  const likesCollection = collection(db, "likes");
  const likesDoc = query(likesCollection, where("postId", "==", props.post.id));
  const [likes, setLikes] = useState<ILike[] | null>(null);
  const [displayComments, setDisplayComments] = useState<boolean>(false);
  const [commentsNumber, setCommentsNumber] = useState<number>(0);
  const [isCommentsUpdated, setIsCommentUpdated] = useState<boolean>(false);
  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    const likess = data.docs.map((doc) => ({
      likeId: doc.id,
      userId: doc.data().userId,
    }));
    setLikes(likess);
  };
  const [user] = useAuthState(auth);
  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesCollection, {
        userId: user?.uid,
        postId: props.post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { likeId: newDoc.id, userId: user.uid }]
            : [{ likeId: newDoc.id, userId: user.uid }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesCollection,
        where("postId", "==", props.post.id),
        where("userId", "==", user?.uid)
      );
      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeToDelete = doc(db, "likes", likeToDeleteData.docs[0].id);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes(
          (prev) =>
            prev &&
            prev.filter((like) => like.likeId !== likeToDeleteData.docs[0].id)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const isUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
  }, []);

  useEffect(() => {
    getComments(props.post.id)
      .then((res: any) => {
        setCommentsNumber(res.length);
      })
      .catch((err) => console.log(err));
  }, [isCommentsUpdated]);
  return (
    <div className="card post-item mb-3">
      <div className="card-header bg-dark text-white">
        <h3 className="h5">{props.post.title}</h3>
      </div>
      <div className="card-body">
        <img width={300} alt="post-image" src={props.post.photo} />
        <br />
        {props.post.description}
      </div>
      <div className="card-footer">
        <div className="d-flex justify-content-between align-items-center align-self-center">
          <small className="post-meta text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-person-bounding-box"
              viewBox="0 0 16 16"
            >
              <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z" />
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>{" "}
            {props.post.username}
            {"  "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-calendar-week-fill"
              viewBox="0 0 16 16"
            >
              <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
            </svg>{" "}
            {props.post.datetime}
          </small>
          <div>
            <button
              className="btn btn-default btn-sm"
              onClick={() => setDisplayComments(!displayComments)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-chat-square-dots"
                viewBox="0 0 16 16"
              >
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>{" "}
              {commentsNumber} Comment(s)
            </button>
            <button
              className="btn btn-sm btn-default p-0 mb-1"
              onClick={isUserLiked ? removeLike : addLike}
            >
              {isUserLiked ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="red"
                    className="bi bi-suit-heart-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
                  </svg>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-suit-heart"
                    viewBox="0 0 16 16"
                  >
                    <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                  </svg>
                </>
              )}
            </button>
            <span className="like-count">{likes && likes.length}</span>
          </div>
        </div>
      </div>
      <div className={`${displayComments ? "d-block" : "d-none"}`}>
        <div className="card card-body">
          <CommentForm
            postId={props.post.id}
            setIsCommentUpdated={setIsCommentUpdated}
          />
          <Comments
            postId={props.post.id}
            isCommentsUpdated={isCommentsUpdated}
          />
        </div>
      </div>
    </div>
  );
};
