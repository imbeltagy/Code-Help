import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateAccount from "./steps/CreateAccount";
import OptionalInformation from "./steps/OptionalInformation";
import Confirm from "./steps/Confirm";
import { login, getUserInfo } from "/src/features/user/userSlice";

const steps = ["Create new account", "Add optional infomation"];

const Signup = () => {
  const [userInfo, setUserInfo] = useState({}); // save data from all steps
  const navigate = useNavigate();
  const isLogged = useSelector((state) => state.user.isLogged);
  const dispatch = useDispatch();

  const handleFinish = () => {
    dispatch(login({ username: userInfo.username, remember: true }));
    getUserInfo(userInfo.username);
  };

  // Redirect to Home page when logged in
  useEffect(() => {
    isLogged && navigate("/");
  }, [isLogged]);

  if (isLogged) {
    return <>Redirecting To Home...</>;
  }

  // Stepper
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
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
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <CardContent sx={{ pt: 4, pb: 2 }}>
        {activeStep === 0 ? <CreateAccount handleNext={handleNext} setUserInfo={setUserInfo} /> : null}
        {activeStep === 1 ? (
          <OptionalInformation handleNext={handleNext} userInfo={userInfo} setUserInfo={setUserInfo} />
        ) : null}
        {activeStep === steps.length ? (
          <Confirm handleBack={handleBack} userInfo={userInfo} handleFinish={handleFinish} />
        ) : null}
      </CardContent>
    </Card>
  );
};

export default Signup;
