import { Avatar, CardHeader, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import AuthorActions from "../authorActions/Index";
import { useSelector } from "react-redux";

const QuestionHeader = ({ id, moreActions }) => {
  const { avatar, username, displayName, date } = useSelector((state) => state.questions.savedQuestions[id]);
  const currentUser = useSelector((state) => state.user.username);
  return (
    <>
      <CardHeader
        avatar={<Avatar src={avatar} aria-label="recipe" />}
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
            {currentUser === username ? <AuthorActions id={id} /> : null}
            {moreActions ? moreActions : null}
          </>
        }
      />

      <Divider />
    </>
  );
};

// {...(modal || currentUser === username
//   ? {
//       action: (
//         <>
//           {currentUser === username ? <AuthorActions questionId={id} isSolved={isSolved} /> : null}
//           {modal ? (
//             <IconButton aria-label="close question" onClick={() => setOpen(false)}>
//               <Close />
//             </IconButton>
//           ) : null}
//         </>
//       ),
//     }
//   : null)}

export default QuestionHeader;
