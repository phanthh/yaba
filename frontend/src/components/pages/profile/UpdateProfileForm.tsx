import { useState } from "react";
import { Link } from "react-router-dom";
import { InferType, object, string } from "yup";
import { errorHandler } from "../../../utils/errors";
import { fetcher } from "../../../utils/fetcher";
import { userSchema } from "../../../utils/schemas";
import useAuth from "../../auth/hooks/useAuth";

const formSchema = object({
  email: string().email().required(),
  username: string().required(),
  newPassword: string().required(),
  confirmedNewPassword: string().required(),
  currentPassword: string().required(),
});
type FormState = InferType<typeof formSchema>;

const UpdateProfileForm: React.FC = () => {
  const { token, username, email, logout } = useAuth();
  const initialState = {
    username,
    email,
    currentPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  };
  const [form, setForm] = useState<FormState>(initialState);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (form.newPassword !== form.confirmedNewPassword) {
      window.alert("New Password was not confirmed correctly!");
      setForm({
        ...form,
        newPassword: "",
        confirmedNewPassword: "",
        currentPassword: "",
      });
      return;
    }

    formSchema
      .validate(form)
      .then((validatedForm) => {
        const { confirmedNewPassword: _, ...body } = validatedForm;
        return fetcher("/api/profile/", {
          method: "PUT",
          schema: userSchema,
          body,
          token,
        });
      })
      .then((updatedUser) => {
        window.alert(
          `Congrats ${updatedUser.username}! Your account has been updated. Please re-login to see the changes.`
        );
        logout("/login");
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
      <h3 className="form-title">Update Profile</h3>
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
        <label className="form-label">Username</label>
        <input
          onChange={handleChange}
          className="form-input"
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
        />
      </div>
      <div className="form-field">
        <label className="form-label">New Password</label>
        <input
          onChange={handleChange}
          className="form-input"
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Confirm New Password</label>
        <input
          onChange={handleChange}
          className="form-input"
          type="password"
          name="confirmedNewPassword"
          placeholder="Confirm New Password"
          value={form.confirmedNewPassword}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Current Password</label>
        <input
          onChange={handleChange}
          className="form-input"
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <button type="submit" className="btn btn-success">
          Confirm!
        </button>
        <button
          type="reset"
          onClick={() => setForm(initialState)}
          className="btn btn-primary"
        >
          Reset
        </button>

        <Link
          type="reset"
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

export default UpdateProfileForm;
