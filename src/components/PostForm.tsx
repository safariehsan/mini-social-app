import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { storage } from "../config/firebase";
import {
  listAll,
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Spinner } from "./Spinner";

interface NewPost {
  title: string;
  description: string;
  datetime: string;
  photo: string;
}

export const PostForm = () => {
  const [uploadImage, setUploadImage] = useState<any>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const schema = yup.object().shape({
    title: yup.string().required("*Title is required"),
    description: yup.string().required("*Description is required"),
    photo: yup.mixed().test("file", "*Image is required", (value) => {
      if (value.length > 0) {
        return true;
      }
      return false;
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPost>({
    resolver: yupResolver(schema),
  });
  const postsCollection = collection(db, "posts");
  const imgFolderRef = ref(storage, "images/");

  const onFormSubmit = async (values: NewPost) => {
    try {
      if (isUploaded) {
        await addDoc(postsCollection, {
          // title: values.title,
          // description: values.description,
          ...values,
          photo: uploadedUrl,
          username: user?.displayName,
          userId: user?.uid,
          datetime: Timestamp.now().toDate().toDateString(),
        });
        navigate("/");
      } else {
        alert("please upload image first");
      }
    } catch (err) {
      alert("Error!");
    }
  };
  const renameUploadedFile = (name: string) => {
    const fileExtension = "." + name?.split(".").pop()!.toLowerCase();
    const newFileName = uploadImage?.name.replace(
      fileExtension,
      "-" + uuidv4() + fileExtension
    );
    return newFileName;
  };
  const uploadImageHandler = () => {
    try {
      setIsUploading(true);
      const imgRef = ref(
        storage,
        `images/${renameUploadedFile(uploadImage?.name)}`
      );
      uploadBytes(imgRef, uploadImage!).then((snapshot) => {
        listAll(imgFolderRef).then((res) => {
          res.items.forEach((item) => {
            if (item.fullPath === snapshot.metadata.fullPath)
              getDownloadURL(item).then((url) => {
                setUploadedUrl(url);
                setIsUploaded(true);
                setIsUploading(false);
                // alert("image uploaded!");
              });
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
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
            <label htmlFor="description" className="col-sm-2 col-form-label">
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
          <div className="form-group row">
            <label htmlFor="photo" className="col-sm-2 col-form-label">
              Photo
            </label>
            <div className="col-sm-10">
              <input
                {...register("photo")}
                type="file"
                onChange={(e: any) => setUploadImage(e.target.files[0])}
              />
              <button
                onClick={uploadImageHandler}
                type="button"
                className="btn btn-sm btn-info"
              >
                {isUploading ? <Spinner /> : "Upload"}
              </button>
              <p className="invalid-feedback d-block">
                {errors.photo?.message}
              </p>
            </div>
          </div>
          {isUploaded ? <img width="300" src={uploadedUrl} alt="test" /> : ""}
          <br />
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
