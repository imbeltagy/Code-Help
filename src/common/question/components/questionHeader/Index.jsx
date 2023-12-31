import { CardHeader, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Fragment, Suspense, lazy } from "react";
import AvatarPic from "/src/common/avatarPic/Index";
const AuthorActions = lazy(() => import("/src/common/question/components/authorActions/Index"));

const QuestionHeader = ({ id, moreActions = [] }) => {
  const { username, displayName, date } = useSelector((state) => state.questions.savedQuestions[id]);
  const currentUser = useSelector((state) => state.user.username);
  return (
    <>
      <CardHeader
        avatar={<AvatarPic displayName={displayName} />}
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
        subheader={date}
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
