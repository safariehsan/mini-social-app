import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const getComments = async (postId: string) => {
  try {
    const commentsCollection = collection(db, "comments");
    const commentsDoc = query(
      commentsCollection,
      where("postId", "==", postId)
    );
    const data = await getDocs(commentsDoc);
    const comments = data.docs.map((comment: any) => ({
      ...comment.data(),
      id: comment.id,
    }));
    return comments;
  } catch (err) {
    return err;
  }
};

export const getPosts = async () => {
  try {
    const postsCollection = collection(db, "posts");
    const data = await getDocs(postsCollection);
    const posts = data.docs.map((post) => ({ ...post.data(), id: post.id }));
    return posts;
  } catch (err) {
    return err;
  }
};

export const getLikes = async (postId: string) => {
  const likesCollection = collection(db, "likes");
  const likesDoc = query(likesCollection, where("postId", "==", postId));
  const data = await getDocs(likesDoc);
  const likes = data.docs.map((doc) => ({
    likeId: doc.id,
    userId: doc.data().userId,
  }));
  return likes;
};

export const addLike = async (user: any, postId: string) => {
  try {
    const likesCollection = collection(db, "likes");
    const newDoc = await addDoc(likesCollection, {
      userId: user?.uid,
      postId: postId,
    });
    if (user) {
      const obj = { likeId: newDoc.id, userId: user.uid };
      return obj;
    }
  } catch (err) {
    return err;
  }
};

export const removeLike = async (user: any, postId: string) => {
  try {
    const likesCollection = collection(db, "likes");
    const likeToDeleteQuery = query(
      likesCollection,
      where("postId", "==", postId),
      where("userId", "==", user?.uid)
    );
    const likeToDeleteData = await getDocs(likeToDeleteQuery);
    const likeToDelete = doc(db, "likes", likeToDeleteData.docs[0].id);
    await deleteDoc(likeToDelete);
    if (user) {
      return likeToDeleteData.docs[0].id;
    }
  } catch (err) {
    return err
  }
};
