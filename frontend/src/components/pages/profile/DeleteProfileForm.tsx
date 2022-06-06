import { useState } from "react";
import { Link } from "react-router-dom";
import { InferType, object, string } from "yup";
import { errorHandler } from "../../../utils/errors";
import { fetcher } from "../../../utils/fetcher";
import { userSchema } from "../../../utils/schemas";
import useAuth from "../../auth/hooks/useAuth";

const formSchema = object({
  email: string().email().required(),
  password: string().required(),
});

type FormState = InferType<typeof formSchema>;

const initialState = { email: "", password: "" };

const DeleteProfileForm: React.FC = () => {
  const { token, logout } = useAuth();
  const [form, setForm] = useState<FormState>(initialState);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to PERMANENTLY delete your account ?"
      )
    ) {
      return;
    }
    formSchema
      .validate(form)
      .then((validatedForm) =>
        fetcher("/api/profile/", {
          method: "DELETE",
          body: validatedForm,
          schema: userSchema,
          token,
        })
      )
      .then((_) => {
        window.alert(
          "Your account has been deleted. You will be redirected..."
        );
        logout("/");
      })
      .catch((error) => errorHandler(error))
      .finally(() => setForm(initialState));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form-card"
      style={{ width: "50%" }}
    >
      <h3 className="form-title">Delete Account</h3>
      <div className="form-field">
        <label className="form-label">Email</label>
        <input
          onChange={handleChange}
          className="form-input"
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Password</label>
        <input
          onChange={handleChange}
          className="form-input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <button type="submit" className="btn btn-success">
          Confirm!
        </button>
        <Link
          type="reset"
          onClick={() => setForm(initialState)}
          to="/profile"
          className="btn btn-danger"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};

export default DeleteProfileForm;
