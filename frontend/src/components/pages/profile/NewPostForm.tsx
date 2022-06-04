import { useState } from "react";
import { InferType, object, string } from "yup";
import { errorHandler } from "../../../utils/errors";
import { fetcher } from "../../../utils/fetcher";
import { Post, postSchema } from "../../../utils/schemas";
import useAuth from "../../auth/hooks/useAuth";

const formSchema = object({
  title: string().min(1).max(40).required(),
  content: string().min(1).required(),
});

type FormState = InferType<typeof formSchema>;

type NewPostFormProps = {
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const initialState = { title: "", content: "" };

const NewPostForm: React.FC<NewPostFormProps> = ({ setPosts }) => {
  const { token } = useAuth();
  const [form, setForm] = useState<FormState>(initialState);
  const [show, setShow] = useState(false);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    formSchema
      .validate(form)
      .then((validatedForm) =>
        fetcher("/api/post/", {
          method: "POST",
          body: validatedForm,
          token,
          schema: postSchema,
        })
      )
      .then((newPost) => setPosts((posts) => [...posts, newPost]))
      .catch((error) => errorHandler(error))
      .finally(() => setForm(initialState));
  };

  if (!show) {
    return (
      <button
        className="btn btn-success"
        onClick={() => setShow(!show)}
        style={{ marginLeft: 0 }}
      >
        <strong>+ New Post</strong>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="form-card"
      style={{ width: "90%" }}
    >
      <h3 className="form-title">+ New Post</h3>
      <div className="form-field">
        <label className="form-label">Title</label>
        <input
          onChange={handleChange}
          className="form-input"
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Content</label>
        <textarea
          onChange={handleChange}
          className="form-textarea"
          name="content"
          placeholder="Content"
          value={form.content}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <button type="submit" className="btn btn-success">
          Post!
        </button>
        <button
          type="reset"
          onClick={() => setForm(initialState)}
          className="btn btn-primary"
        >
          Clear all
        </button>
        <button
          type="reset"
          onClick={() => setShow(!show)}
          className="btn btn-danger"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewPostForm;
