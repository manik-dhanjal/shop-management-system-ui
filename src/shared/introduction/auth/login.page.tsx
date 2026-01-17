import Button from "@shared/components/form/button.component";
import TextBox from "@shared/components/form/text-box.component";
import React, { useEffect, useMemo, useState } from "react";
import loginImg from "@media/images/login.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@shared/hooks/auth.hooks";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { useYupValidationResolver } from "@shared/hooks/yup.hook";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { TextFieldControlled } from "@shared/components/form/text-field-controlled.component";

interface LoginFormValues {
  email: string;
  password: string;
}

export const INITIAL_LOGIN_FORM_VALUES: LoginFormValues = {
  email: "",
  password: "",
};
const LoginPage: React.FC = () => {
  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .required("Email is required")
          .matches(
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
            "Email is not valid"
          ),
        password: yup
          .string()
          .required("Password is required")
          .min(6, "Password must be at least 6 characters"),
      }),
    []
  );
  const resolver = useYupValidationResolver(validationSchema);
  const { control, handleSubmit, setValue } = useForm<LoginFormValues>({
    resolver,
    defaultValues: INITIAL_LOGIN_FORM_VALUES,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const globalAlert = useAlert();

  const onFormSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const user = await auth.login(data);
      globalAlert.addAlert(
        `Welcome back ${user.firstName} 🙏`,
        AlertSeverity.SUCCESS
      );
      navigate("/dashboard/analytics");
    } catch (error) {
      console.log(error);
      globalAlert.addAlert((error as Error).message, AlertSeverity.ERROR);
    }

    setIsSubmitting(false);
  };
  useEffect(() => {
    if (auth.user) {
      navigate("/dashboard/analytics");
    }
  }, [auth.user]);
  return (
    <div className="min-h-screen flex items-stretch justify-center bg-white dark:bg-gray-900">
      <div className="w-[60%] py-20 px-10 flex items-center justify-end">
        <div className="max-w-2xl">
          <img
            src={loginImg}
            className="w-full h-full object-contain object-center"
          />
        </div>
      </div>
      <div className="w-[40%] flex  items-center justify-start px-10">
        <div className=" dark:bg-gray-800/50 shadow-xl rounded-lg w-full max-w-md px-8 py-12 border border-gray-100">
          <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-gray-100">
            Login to Your Account
          </h2>
          <p className="text-sm text-gray-500  text-center mb-8">
            Welcome back! Please enter your details.
          </p>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            {/* Email */}
            <TextFieldControlled
              label="Email"
              name="email"
              required={true}
              control={control}
              placeholder="Enter your email"
              className="w-full"
            />
            {/* Password */}
            <TextFieldControlled
              label="Password"
              name="password"
              type="password"
              control={control}
              placeholder="Enter your password"
              className="w-full"
            />
            {/* Submit Button */}
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full text-md btn-lg "
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="text-sm text-center text-gray-500 mt-9">
            Don’t have an account?
            <Link to="/signup" className="text-violet-500 hover:underline ml-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
