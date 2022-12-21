import { collection, getDocs, query, where } from "firebase/firestore";
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
