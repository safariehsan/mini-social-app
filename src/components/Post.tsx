import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { PostType } from "../components/Posts";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import { getComments } from "../services";
import PostLike from "./PostLike";
import { useContext } from "react";
import { ThemeContext } from "../App";

export interface IPost {
  post: PostType;
}

export const PostItem = (props: IPost) => {
  const { darkMode } = useContext(ThemeContext);
  const [displayComments, setDisplayComments] = useState<boolean>(false);
  const [commentsNumber, setCommentsNumber] = useState<number>(0);
  const [isCommentsUpdated, setIsCommentUpdated] = useState<boolean>(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    getComments(props.post.id)
      .then((res: any) => {
        setCommentsNumber(res.length);
      })
      .catch((err) => console.log(err));
  }, [isCommentsUpdated]);

  return (
    <div className="card post-item mb-3">
      <div className={`card-header py-1 ${darkMode ? 'text-bg-secondary' : 'text-bg-info'}`}>
        <h3 className="h5">{props.post.title}</h3>
      </div>
      <div className={`card-body p-0 ${darkMode ? 'bg-dark' : 'bg-light'}`}>
        <img width={300} alt={props.post.title} src={props.post.photo} className="w-100" />
        <div className="content p-2">
        {props.post.description}
        </div>
      </div>
      <div className={`card-footer ${darkMode ? 'text-bg-secondary' : 'text-bg-light'}`}>
        <div className="d-flex justify-content-between align-items-center align-self-center">
          <small className="post-meta">
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
              className="bi bi-calendar2"
              viewBox="0 0 16 16"
            >
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
              <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z" />
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
            <PostLike user={user} postId={props.post.id} />
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
