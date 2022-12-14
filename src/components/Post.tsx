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

interface IPost {
  post: PostType;
}

interface ILike {
  likeId: string;
  userId: string;
}

const PostItem = (props: IPost) => {
  const likesCollection = collection(db, "likes");
  const likesDoc = query(likesCollection, where("postId", "==", props.post.id));
  const [likes, setLikes] = useState<ILike[] | null>(null);
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
      const newDoc = await deleteDoc(likeToDelete);
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
  return (
    <div className="post-item">
      <div className="post-title">
        <h3>{props.post.title}</h3>
      </div>
      <div className="post-body">{props.post.description}</div>
      <div className="post-author">@{props.post.username}</div>
      <div className="post-like">
        <button onClick={isUserLiked ? removeLike : addLike}>
          {isUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        <b> {likes && likes.length}</b>
      </div>
      <hr />
    </div>
  );
};

export default PostItem;
