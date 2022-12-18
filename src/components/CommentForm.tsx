import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

interface IComment {
  body: string;
  datetime: string;
  userId: string;
  postId: string;
}

const CommentForm = (props: any) => {
  const schema = yup.object().shape({
    body: yup.string().required("Body Comment Is Required").min(2),
  });
  // const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IComment>({
    resolver: yupResolver(schema),
  });
  const [user] = useAuthState(auth);
  const commentsCollection = collection(db, "comments");
  const onFormSubmit = async (values: IComment) => {
    const data = {
      ...values,
      postId: props.postId,
      userId: user?.uid,
      datetime: Timestamp.now().toDate().toDateString(),
    };
    try {
      await addDoc(commentsCollection, {
        data,
      });
      alert("comment sent!");
      reset({
        body: "",
      });
      // navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="comment-form">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <textarea
          placeholder="Enter your comment..."
          rows={3}
          {...register("body")}
          className="form-control"
        />
        <p className="invalid-feedback d-block">{errors.body?.message}</p>
        <button className="btn btn-info" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
