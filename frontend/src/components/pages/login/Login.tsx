import { useState } from "react";
import { object, string, InferType } from "yup";
import { errorHandler } from "../../../utils/errors";
import useAuth from "../../auth/hooks/useAuth";
import Page from "../../layout/Page";

const formSchema = object({
  email: string().email().required(),
  password: string().required(),
});

type FormState = InferType<typeof formSchema>;

const initialState = { email: "", password: "" };

const Login: React.FC = () => {
  const { login } = useAuth();
  const [form, setForm] = useState<FormState>(initialState);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    formSchema
      .validate(form)
      .then((validatedForm) => login(validatedForm))
      .catch((error) => errorHandler(error))
      .finally(() => setForm(initialState));
  };

  return (
    <Page title="Log in">
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
          <label className="form-label">Password</label>
          <input
            onChange={handleChange}
            className="form-input"
            type="password"
            name="password"
            value={form.password}
          />
        </div>
        <button type="submit" className="btn btn-primary form-login-button">
          Log in
        </button>
      </form>
    </Page>
  );
};

export default Login;
