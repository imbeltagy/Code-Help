import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { login } from "/src/features/user/userSlice";
import { useDispatch } from "react-redux";

// Temp API Data
const users = [
  { displayName: "Khalid Amir", username: "khalid", password: "khalid", state: "online" },
  { displayName: "Mohammed Beltagy", username: "beltagy", password: "beltagy", state: "online" },
  { displayName: "Ali657", username: "ali", password: "ali", state: "online" },
  { displayName: "Unknown Yasser", username: "yasser", password: "yasser", state: "online" },
];

const Login = () => {
  const [error, setError] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMeState, setRememberMeState] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleRememberMeState = useCallback(
    (e) => {
      setRememberMeState(e.target.checked);
    },
    [rememberMeState]
  );

  const { register, handleSubmit } = useForm();

  const onSubmit = useCallback((data) => {
    setIsSubmitDisabled(true);
    // Request From API
    setTimeout(() => {
      if (users.some((user) => user.username === data.username && user.password === data.password)) {
        setError("");
        const { displayName, username, state: userState } = users.filter((user) => user.username === data.username)[0];
        dispatch(login({ displayName, username, userState, rememberMe: rememberMeState }));
        navigate("/");
      } else {
        setError("Username or password is wrong");
      }
      setIsSubmitDisabled(false);
    }, 600);
  }, []);

  return (
    <>
      <Card
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(30rem, 90%)",
          padding: 2,
        }}
      >
        <CardContent>
          {/* Title */}
          <Typography
            textAlign="center"
            mb={4}
            fontWeight="600"
            color="primary"
            letterSpacing=".05em"
            variant="h3"
            component="h1"
          >
            Login
          </Typography>

          <form action="/" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={3}>
              {/* Error Message */}
              {error ? <Alert severity="error">{error}</Alert> : null}

              {/* Inputs */}
              <TextField {...register("username", { required: true })} label="username" fullWidth />
              <TextField
                {...register("password", { required: true })}
                label="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="start"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Remember Me & Forgot Password */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={<Checkbox />}
                  defaultChecked={rememberMeState}
                  onChange={toggleRememberMeState}
                  label={
                    <Typography variant="h6" fontSize="1rem" color="primary">
                      Remember Me
                    </Typography>
                  }
                />
                <Link component={NavLink} to="/reset-password" fontSize=".9rem">
                  Forgot your password
                </Link>
              </Stack>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                sx={{ paddingBlock: 1.2, fontWeight: 600, fontSize: "1.2rem" }}
                variant="contained"
              >
                Login
              </Button>

              {/* Sign In */}
              <Typography color="text.secondary" textAlign="center">
                Not a member yet?{" "}
                <Link component={NavLink} to="/signin" fontSize=".9rem">
                  Create your account
                </Link>
              </Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Login;
