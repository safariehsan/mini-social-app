import { useEffect, useState } from "react";
import { PostItem } from "../components/Post";
import { getPosts } from "../services";

export interface PostType {
  id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  datetime: string;
  photo: string;
}

export const Posts = () => {
  const [postsList, setPostsList] = useState<PostType[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getPosts()
      .then((res: any) => {
        setPostsList(res);
      })
      .catch((err) => setError(err));
  }, []);
  return (
    <div className="d-flex justify-content-center flex-column">
      {postsList ? (
        postsList.map((item, index) => {
          // console.log(item);
          return <PostItem key={index} post={item} />;
        })
      ) : (
        <div className="alert alert-warning" role="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-lock-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          </svg>{" "}
          {error}
        </div>
      )}
    </div>
  );
};
