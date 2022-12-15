import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface NewPost {
  title: string;
  description: string;
  datetime: string;
}

export const PostForm = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const schema = yup.object().shape({
    title: yup.string().required("*Title is required"),
    description: yup.string().required("*Description is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPost>({
    resolver: yupResolver(schema),
  });
  const postsCollection = collection(db, "posts");
  const onFormSubmit = async (values: NewPost) => {
    await addDoc(postsCollection, {
      // title: values.title,
      // description: values.description,
      ...values,
      username: user?.displayName,
      userId: user?.uid,
      datetime: Timestamp.now().toDate().toDateString(),
    });
    navigate("/");
  };
  return (
    <div className="card text-white bg-dark">
      <div className="card-header bg-dark text-light h5">Add new post</div>
      <div className="card-body">
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="needs-validation"
        >
          <div className="form-group row">
            <label htmlFor="title" className="col-sm-2 col-form-label">
              Title
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Post Title"
                {...register("title")}
              />
              <p className="invalid-feedback d-block">
                {errors.title?.message}
              </p>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Description
            </label>
            <div className="col-sm-10">
              <textarea
                className="form-control"
                placeholder="Enter Post Body"
                rows={4}
                {...register("description")}
              />
              <p className="invalid-feedback d-block">
                {errors.description?.message}
              </p>
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-send"
              viewBox="0 0 16 16"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
            </svg>{" "}
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
