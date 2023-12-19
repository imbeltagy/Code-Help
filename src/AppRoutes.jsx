import { lazy, Suspense } from "react";
import { Alert, Box, Container, Stack, Link as MuiLink } from "@mui/material";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import Settings from "./pages/settings/Index";
import { useSelector } from "react-redux";
import Login from "./pages/login/Index";
import Signup from "./pages/signup/Index";
import Users from "./pages/users/Index";
import SingleUserPage from "./pages/singleUserPage/Index";
const Sidebar = lazy(() => import("./layout/sidebar/Index"));
const Header = lazy(() => import("./layout/header/Index"));
const HomePage = lazy(() => import("./pages/homePage/Index"));
const SingleQuestionPage = lazy(() => import("./pages/singleQuestionPage/Index"));

const Login2AcessPage = ({ children }) => {
  const isLogged = useSelector((state) => state.user.isLogged);

  if (isLogged) return children;

  return (
    <Alert severity="error">
      <p style={{ margin: 0 }}>
        You need to{" "}
        <MuiLink fontWeight="600" underline="none" component={Link} to="/login">
          login
        </MuiLink>{" "}
        or{" "}
        <MuiLink fontWeight="600" underline="none" component={Link} to="/signup">
          sign up
        </MuiLink>{" "}
        to access this page.
      </p>
    </Alert>
  );
};

const CustomRouteElement = ({ element, loginRequired, suspense }) => {
  if (loginRequired && suspense)
    return (
      <Login2AcessPage>
        <Suspense fallback={<p>Loading...</p>}>{element}</Suspense>
      </Login2AcessPage>
    );

  if (loginRequired) return <Login2AcessPage>{element}</Login2AcessPage>;

  if (suspense) return <Suspense fallback={<p>Loading...</p>}>{element}</Suspense>;

  return { element };
};

const routes = {
  withSidebar: [
    {
      path: "/",
      element: <HomePage />,
      suspense: true,
      loginRequired: false,
    },
    {
      path: "question/:questionID",
      element: <SingleQuestionPage />,
      suspense: true,
      loginRequired: false,
    },
    {
      path: "friends-asks",
      element: "Comming Soon",
      suspense: true,
      loginRequired: true,
    },
    {
      path: "users",
      element: <Users />,
      suspense: true,
      loginRequired: false,
    },
    {
      path: "users/:userID",
      element: <SingleUserPage />,
      suspense: true,
      loginRequired: false,
    },
    {
      path: "settings",
      element: <Settings />,
      suspense: true,
      loginRequired: true,
    },
    {
      path: "profile",
      element: "Profile",
      suspense: true,
      loginRequired: true,
    },
    {
      path: "friends",
      element: "Friends",
      suspense: true,
      loginRequired: true,
    },
    {
      path: "notifications",
      element: "Notifications",
      suspense: true,
      loginRequired: true,
    },
  ],
  withoutSidebar: [
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
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
          {routes.withSidebar.map(({ path, element, suspense, loginRequired }) => (
            <Route
              path={path}
              element={<CustomRouteElement element={element} suspense={suspense} loginRequired={loginRequired} />}
              key={path}
            />
          ))}
        </Route>

        {/* Pages Without Sidebar and Header */}
        {routes.withoutSidebar.map(({ path, element }) => (
          <Route path={path} element={<main>{element}</main>} key={path} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
