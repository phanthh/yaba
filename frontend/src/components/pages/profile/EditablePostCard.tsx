import { useState } from "react";
import { InferType, string, object } from "yup";
import { errorHandler } from "../../../utils/errors";
import { fetcher } from "../../../utils/fetcher";
import { Post, postSchema } from "../../../utils/schemas";
import timeSince from "../../../utils/timeSince";
import useAuth from "../../auth/hooks/useAuth";

const formSchema = object({
  title: string().min(1).max(40).required(),
  content: string().min(1).required(),
});

type FormState = InferType<typeof formSchema>;

type EditablePostCardProps = {
  post: Post;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const EditablePostCard: React.FC<EditablePostCardProps> = ({
  post,
  setPosts,
}) => {
  const { token } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: post.title,
    content: post.content,
  });

  const handleChange: React.FocusEventHandler<HTMLDivElement> = (event) => {
    const { id, innerHTML } = event.currentTarget;
    setForm({ ...form, [id]: innerHTML });
  };

  const commitPost = () => {
    formSchema
      .validate(form)
      .then((validatedForm) =>
        fetcher(`/api/post/${post.id}`, {
          method: "PUT",
          token,
          body: validatedForm,
          schema: postSchema,
        })
      )
      .then((updatedPost) => {
        setPosts((posts) => {
          const index = posts.findIndex((post) => post.id === updatedPost.id);
          const updatedPosts = [...posts];
          updatedPosts[index] = updatedPost;
          return updatedPosts;
        });
      })
      .catch((error) => errorHandler(error));
  };

  const deletePost = () => {
    fetcher(`/api/post/${post.id}`, {
      method: "DELETE",
      token,
      schema: postSchema,
    }).then((deletedPost) => {
      setPosts((posts) => posts.filter((post) => post.id !== deletedPost.id));
    });
  };

  // JSX

  const postTitle = edit ? (
    <h1
      className="editing-post-title"
      id="title"
      suppressContentEditableWarning={true}
      contentEditable={true}
      onBlur={handleChange}
    >
      {form.title}
    </h1>
  ) : (
    <h1 className="post-title">{post.title}</h1>
  );

  const postContent = edit ? (
    <div
      onBlur={handleChange}
      id="content"
      suppressContentEditableWarning={true}
      contentEditable={true}
      className="editing-post-content"
    >
      {form.content}
    </div>
  ) : (
    <p className="post-content">{post.content}</p>
  );

  const postButtons = edit ? (
    <div className="editable-post-button-group">
      <button
        className="btn btn-success"
        onClick={() => {
          setEdit(!edit);
          commitPost();
        }}
      >
        Commit
      </button>
      <button className="btn btn-danger" onClick={() => setEdit(!edit)}>
        Cancel
      </button>
    </div>
  ) : (
    <div className="editable-post-button-group">
      <button
        className="btn btn-primary"
        onClick={() => {
          setEdit(!edit);
        }}
      >
        Edit
      </button>
      <button
        className="btn btn-danger"
        onClick={() => {
          window.confirm("Are you sure you want to delete this post ?");
          deletePost();
        }}
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="post-card">
      {postTitle}
      <p className="post-subtitle">
        <span>{`Created: ${post.createdAt.toDateString()}`}</span>
        {post.updatedAt && (
          <span className="post-subtitle">{` --  Edited: ${timeSince(
            post.updatedAt
          )} ago`}</span>
        )}
      </p>
      {postContent}
      {postButtons}
    </div>
  );
};

export default EditablePostCard;
