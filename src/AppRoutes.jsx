import { Box, Container, Stack } from "@mui/material";
import React from "react";
import Sidebar from "./layout/sidebar/Index";
import Header from "./layout/header/Index";
import HomePage from "./pages/homePage/Index";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import QuestionModal from "./common/question/QuestionModal";
import SingleQuestionPage from "./pages/singleQuestionPage/Index";

const routes = {
  withSidebar: [
    { path: "/", element: <HomePage /> },
    { path: "question/:questionID", element: <SingleQuestionPage /> },
    { path: "friends-asks", element: "Friends Asks" },
    { path: "settings", element: "Settings" },
    { path: "profile", element: "Profile" },
    { path: "friends", element: "Friends" },
    { path: "notifications", element: "Notifications" },
  ],
  withoutSidebar: [
    { path: "/login", element: "login" },
    { path: "/signin", element: "signin" },
    { path: "/*", element: "error" },
  ],
};

const Layout = () => {
  return (
    <Stack direction="row">
      <Sidebar />
      <Container>
        <Header />
        <Box pt={2} component="main">
          <Outlet />
        </Box>
      </Container>
    </Stack>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages With Sidebar and Header */}
        <Route path="/" element={<Layout />}>
          {routes.withSidebar.map(({ path, element }) => (
            <Route path={path} element={element} key={path} />
          ))}
        </Route>
        {/* Pages Without Sidebar and Header */}
        {routes.withoutSidebar.map(({ path, element }) => (
          <Route path={path} element={<main>{element}</main>} key={path} />
        ))}
      </Routes>
      <QuestionModal />
    </BrowserRouter>
  );
};

export default AppRoutes;
