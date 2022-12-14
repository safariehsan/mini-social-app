import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import PostItem from "../components/Post";
import { db } from "../config/firebase";

export interface PostType {
  id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
}

export const Posts = () => {
  const postsCollection = collection(db, "posts");
  const [postsList, setPostsList] = useState<PostType[] | null>(null);
  const getPosts = async () => {
    const data = await getDocs(postsCollection);
    const posts = data.docs.map((post) => ({ ...post.data(), id: post.id }));
    setPostsList(posts as PostType[]);
  };
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <div className="posts">
      {postsList?.map((item, index) => {
        return <PostItem key={index} post={item} />;
      })}
    </div>
  );
};
