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
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { login, getUserInfo } from "/src/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import fetchApi from "/src/app/fetchApi/Index";

const Login = () => {
  const [error, setError] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMeState, setRememberMeState] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogged = useSelector((state) => state.user.isLogged);

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

  const onSubmit = useCallback(async (data) => {
    // Disable Submit Button
    setIsSubmitDisabled(true);

    // Check User Account
    const res = await fetchApi("login", "POST", { username: data.username, password: data.password });
    if (res.success) {
      setIsSubmitDisabled(false);
      dispatch(login({ username: data.username, remember: rememberMeState }));
      navigate("/");
    } else {
      setError(res.message);
      setIsSubmitDisabled(false);
    }
  }, []);

  // Redirect to Home page when logged in
  useEffect(() => {
    isLogged && navigate("/");
  }, [isLogged]);

  if (isLogged) {
    return <>Redirecting To Home...</>;
  }

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
                <Link component={NavLink} to="/signup" fontSize=".9rem">
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
