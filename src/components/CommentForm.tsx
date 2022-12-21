import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { auth, db } from "../config/firebase";
import { IComment } from "./Comments";

const CommentForm = (props: any) => {
  const schema = yup.object().shape({
    body: yup.string().required("Comment message is required").min(2),
  });
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
        ...data,
      });
      // alert("comment sent!");
      reset({
        body: "",
      });
      props.setIsCommentUpdated(true);
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
