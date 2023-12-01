import { lazy, Suspense } from "react";
import { Box, Container, Stack } from "@mui/material";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
const Sidebar = lazy(() => import("./layout/sidebar/Index"));
const Header = lazy(() => import("./layout/header/Index"));
const HomePage = lazy(() => import("./pages/homePage/Index"));
const SingleQuestionPage = lazy(() => import("./pages/singleQuestionPage/Index"));
const Login = lazy(() => import("./pages/login/Index"));
const Singup = lazy(() => import("./pages/signup/Index"));

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
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Singup /> },
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
            <Route path={path} element={<Suspense fallback={<p>Loading...</p>}>{element}</Suspense>} key={path} />
          ))}
        </Route>

        {/* Pages Without Sidebar and Header */}
        {routes.withoutSidebar.map(({ path, element }) => (
          <Route
            path={path}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <main>{element}</main>
              </Suspense>
            }
            key={path}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
