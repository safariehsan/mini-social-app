import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface NewPost {
  title: string;
  description: string;
}

export const PostForm = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
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
    });
    navigate("/");
  };
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <input
        type="text"
        placeholder="Enter Post Title"
        {...register("title")}
      />
      <br />
      <p>{errors.title?.message}</p>
      <textarea
        placeholder="Enter Post Body"
        rows={4}
        {...register("description")}
      />
      <br />
      <p>{errors.description?.message}</p>
      <input type="submit" value="Send" />
    </form>
  );
};
