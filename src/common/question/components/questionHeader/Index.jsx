import { Avatar, CardHeader, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Fragment, Suspense, lazy } from "react";
import AvatarCircle from "/src/common/avatarCircle/Index";
const AuthorActions = lazy(() => import("/src/common/question/components/authorActions/Index"));

const QuestionHeader = ({ id, moreActions = [] }) => {
  const { username, displayName, publishDate } = useSelector((state) => state.questions.savedQuestions[id]);
  const currentUser = useSelector((state) => state.user.username);
  return (
    <>
      <CardHeader
        avatar={<AvatarCircle displayName={displayName} />}
        title={
          <Link
            to={`/users/${username}`}
            onClick={() => dispatch(closeModal())}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {displayName}
          </Link>
        }
        titleTypographyProps={{ fontWeight: "500" }}
        subheader={publishDate}
        action={
          <>
            {currentUser === username ? (
              <Suspense>
                <AuthorActions id={id} />
              </Suspense>
            ) : null}
            {moreActions.map((action, i) => (
              <Fragment key={i}>{action}</Fragment>
            ))}
          </>
        }
      />

      <Divider />
    </>
  );
};

export default QuestionHeader;
