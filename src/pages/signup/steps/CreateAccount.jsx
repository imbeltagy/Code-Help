import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Link,
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup
  .object()
  .shape({
    username: yup
      .string()
      .min(4, "Username must be 4 or more characters")
      .lowercase("Username must be all in lowercase")
      .required("Username is required"),
    password: yup.string().min(6, "Password must be 6 or more characters").required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();

const CreateAccount = ({ handleNext, setUserInfo }) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitDisabled(true);

    // get only needed values from inputs
    const { username, password } = data;

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/signup",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUserInfo((prev) => ({ ...prev, username: username }));
      setIsSubmitDisabled(false);
      handleNext();
    } catch (err) {
      const message = err.response.data.message;
      setError(typeof message == "string" ? message : "There is a problem please try again later");
      setIsSubmitDisabled(false);
    }
  };

  return (
    <form action="/" method="POST" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={3}>
        {/* Inputs */}
        <TextField
          error={Boolean(error)}
          helperText={error ? error : null}
          {...register("username")}
          label="username"
          fullWidth
        />
        {[
          { name: "password", label: "password" },
          { name: "confirmPassword", label: "confirm password" },
        ].map(({ name, label }) => (
          <TextField
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={togglePasswordVisibility} edge="start">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register(name)}
            label={label}
            fullWidth
            key={name}
          />
        ))}
        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          sx={{ paddingBlock: 1.2, fontWeight: 600, fontSize: "1.2rem" }}
          variant="contained"
        >
          Sign In
        </Button>
        {/* Go to Login Page */}
        <Typography color="text.secondary" textAlign="center">
          Already have account?{" "}
          <Link component={NavLink} to="/login" fontSize=".9rem">
            Login
          </Link>
        </Typography>
      </Stack>
    </form>
  );
};

export default CreateAccount;
