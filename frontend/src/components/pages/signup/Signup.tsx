import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InferType, object, string } from "yup";
import { errorHandler } from "../../../utils/errors";
import { fetcher } from "../../../utils/fetcher";
import { userSchema } from "../../../utils/schemas";
import Page from "../../layout/Page";

const formSchema = object({
  email: string().email().required(),
  username: string().required(),
  password: string().required(),
  confirmedPassword: string().required(),
});

type FormState = InferType<typeof formSchema>;

const initialState = {
  email: "",
  username: "",
  password: "",
  confirmedPassword: "",
};

const Signup: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const navigate = useNavigate();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (form.password !== form.confirmedPassword) {
      window.alert("Password was not confirmed correctly!");
      setForm({ ...form, password: "", confirmedPassword: "" });
      return;
    }

    formSchema
      .validate(form)
      .then((validatedForm) => {
        const { confirmedPassword: _, ...body } = validatedForm;
        return fetcher("/api/signup", {
          method: "POST",
          body,
          schema: userSchema,
        });
      })
      .then((user) => {
        window.alert(
          `Congrats ${user.username}! You are signed up! Please proceed to login!`
        );
        navigate("/login");
      })
      .catch((error) => errorHandler(error))
      .finally(() => setForm(initialState));
  };

  return (
    <Page title="Sign up">
      <form
        onSubmit={handleSubmit}
        className="form-card"
        style={{ width: "50%" }}
      >
        <div className="form-field">
          <label className="form-label">Email</label>
          <input
            onChange={handleChange}
            className="form-input"
            type="text"
            name="email"
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
            value={form.username}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Password</label>
          <input
            onChange={handleChange}
            className="form-input"
            type="password"
            name="password"
            value={form.password}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Confirm Password</label>
          <input
            onChange={handleChange}
            className="form-input"
            type="password"
            name="confirmedPassword"
            value={form.confirmedPassword}
          />
        </div>
        <button type="submit" className="btn btn-primary form-signup-button">
          Sign up
        </button>
      </form>
    </Page>
  );
};

export default Signup;
