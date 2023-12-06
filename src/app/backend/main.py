from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
from datetime import datetime
import uuid
import pyodbc

# connect to database :
server = "oopservername.database.windows.net"
database = "OOP_PROJECT_DB"
username = "sqladmin"
password = "tarek055@"

connection_string = f"DRIVER={{SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}"
connection = pyodbc.connect(connection_string)
cursor = connection.cursor()


def commit_changes():
    connection.commit()


def getDate():
    return datetime.now().timestamp() * 1000


class Question:
    questions = []

    def __init__(self, author, title, content):
        self.id = str(uuid.uuid4())
        self.author = author
        self.publish_date = getDate()
        self.title = title
        self.content = content
        self.answers = set()
        self.solved_state = False
        self.who_saved_me = set()

        Question.questions.append(self)

    def editQuestion(self, title, content, solved_state):
        self.title = title
        self.content = content
        self.solved_state = solved_state

        query = "UPDATE Questions SET Title = ?, Content = ?, IsSolved = ? WHERE QuestionID = ?"
        cursor.execute(query, (title, content, solved_state, self.id))
        commit_changes()

    def setSolvedState(self, solved_state):
        self.solved_state = solved_state

        query = "UPDATE Questions SET IsSolved = ? WHERE QuestionID = ?"
        cursor.execute(query, (solved_state, self.id))
        commit_changes()

    def addAnswer(self, author, content):
        answer_id = str(uuid.uuid4())
        answer = {
            "id": answer_id,
            "author": author,
            "date": getDate(),
            "content": content,
        }
        self.answers.add(answer)

        query = """
            INSERT INTO Answers (AnswerID, QuestionID, AuthorID, Content, PublishDate)
            VALUES (?, ?, ?, ?, ?)
        """
        cursor.execute(query, (answer_id, self.id, author, content, datetime.now()))
        commit_changes()

        question_author = User.search(self.author)
        if question_author:
            question_author.pushNotification(
                "question_answered", {"question": self.id, "answer": answer_id}
            )

    def editAnswer(self, id, new_content):
        for answer in self.answers:
            if answer["id"] == id:
                answer["content"] = new_content

                query = "UPDATE Answers SET Content = ? WHERE AnswerID = ?"
                cursor.execute(query, (new_content, id))
                commit_changes()

                break

    def removeAnswer(self, id):
        for answer in self.answers:
            if answer["id"] == id:
                self.answers.remove(answer)

                # Delete the answer from the database
                query = "DELETE FROM Answers WHERE AnswerID = ?"
                cursor.execute(query, (id,))
                commit_changes()

                break

    # Return count of answers
    def getAnswersCount(self, start_from, count):
        query = """
            SELECT COUNT(AnswerID)
            FROM Answers
            WHERE QuestionID = ?
        """
        cursor.execute(query, (self.id,))
        total_answers_count = cursor.fetchone()[0]

        return total_answers_count[start_from : start_from + count]

    def getQuestion(self, username):
        is_saved = False
        for user in self.who_saved_me:
            if user == username:
                is_saved = True

        query = """
            SELECT Q.QuestionID, Q.AuthorID, Q.Title, Q.Content, Q.PublishDate, Q.IsSolved
            FROM Questions Q
            WHERE Q.QuestionID = ?
        """
        cursor.execute(query, (self.id,))
        question_data = cursor.fetchone()

        result = {
            "id": question_data[0],
            "author": question_data[1],
            "publish_date": question_data[4],
            "title": question_data[2],
            "content": question_data[3],
            "solved_state": question_data[5],
            "is_saved": is_saved,
            "answers_count": len(
                list(self.answers)
            ),  # Assume you have a getAnswersCount method
        }

        return result

    @classmethod
    def search(cls, id):
        query = "SELECT * FROM Questions WHERE QuestionID = ?"
        cursor.execute(query, (id,))
        question_data = cursor.fetchone()

        if question_data:
            return Question(*question_data)
        return None

    @classmethod
    def remove(cls, id):
        query = "DELETE FROM Questions WHERE QuestionID = ?"
        cursor.execute(query, (id,))
        commit_changes()

        question = Question.search(id)
        if question is not None:
            # Remove Question From Users Saved Questions
            for username in question.who_saved_me:
                User.search(username).unsaveQuestion(id, False)
            # Remove Question From Author Question
            User.search(question.author).user_questions.remove(id)
            # Remove Question From questions array
            cls.questions.remove(question)


class User:
    users = []

    def __init__(self, username, password):
        self.username = username
        self.display_name = (
            username  # ==============================================================
        )
        self.password = hashlib.sha256(password.encode()).hexdigest()
        self.old_passwords = []
        self.brief = ""
        self.state = "online"
        self.user_questions = set()
        self.saved_questions = set()
        self.friends = set()
        self.sentRequests = set()
        self.recievedRequests = set()
        self.notifications = set()

        User.users.append(self)

    def getUserInfo(self):
        query = """
            SELECT Display_Name,State, Brief
            FROM Users
            WHERE Username = ?
        """
        cursor.execute(query, (self.username,))
        user_data = cursor.fetchone()

        # Fetch counts from the database
        friends_count_query = "SELECT COUNT(*) FROM Friends WHERE Username = ?"
        cursor.execute(friends_count_query, (self.username,))
        friends_count = cursor.fetchone()[0]

        user_questions_count_query = (
            "SELECT COUNT(*) FROM UserQuestions WHERE Username = ?"
        )
        cursor.execute(user_questions_count_query, (self.username,))
        user_questions_count = cursor.fetchone()[0]

        saved_questions_count_query = (
            "SELECT COUNT(*) FROM SavedQuestions WHERE Username = ?"
        )
        cursor.execute(saved_questions_count_query, (self.username,))
        saved_questions_count = cursor.fetchone()[0]

        notifications_count_query = (
            "SELECT COUNT(*) FROM Notifications WHERE Username = ?"
        )
        cursor.execute(notifications_count_query, (self.username,))
        notifications_count = cursor.fetchone()[0]

        return {
            "display_name": user_data[0] if user_data else "",
            "state": user_data[2] if user_data else "",
            "brief": user_data[3] if user_data else "",
            "friends_count": friends_count,
            "questions_count": user_questions_count,
            "saved_questions_count": saved_questions_count,
            "notifications_count": notifications_count,
        }

    def getFriendsInfo(self, start_from, count):
        query = """
            SELECT U.Username, U.Display_Name, U.State
            FROM Users U
            INNER JOIN Friends F ON U.Username = F.FriendUsername
            WHERE F.Username = ?
            ORDER BY U.Username
            OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
        """
        cursor.execute(query, (self.username, start_from, count))
        friends_data = cursor.fetchall()

        needed_info = []
        for friend_data in friends_data:
            needed_info.append(
                {
                    "username": friend_data[0],
                    "display_name": friend_data[1],
                    "state": friend_data[3],
                }
            )

        return needed_info

    def getNotifications(self, start_from, count):
        query = "SELECT * FROM Notifications WHERE Username = ? ORDER BY Date OFFSET ? ROWS FETCH NEXT ? ROWS ONLY"
        cursor.execute(query, (self.username, start_from, count))
        notifications = cursor.fetchall()

        return notifications

    def getUserQuestions(self, start_from, count):
        query = """
            SELECT Q.QuestionID
            FROM Questions Q
            WHERE Q.AuthorID = ?
            ORDER BY Q.PublishDate DESC
            OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
        """
        cursor.execute(query, (self.username, start_from, count))
        question_ids = cursor.fetchall()

        needed_questions = []
        for question_id in question_ids:
            question_data = Question.search(question_id[0]).getQuestion(self.username)
            needed_questions.append(question_data)

        return needed_questions

    def getSavedQuestions(self, start_from, count):
        query = """
            SELECT Q.QuestionID
            FROM SavedQuestions S
            INNER JOIN Questions Q ON S.QuestionID = Q.QuestionID
            WHERE S.Username = ?
            ORDER BY Q.PublishDate DESC
            OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
        """
        cursor.execute(query, (self.username, start_from, count))
        question_ids = cursor.fetchall()

        needed_questions = []
        for question_id in question_ids:
            question_data = Question.search(question_id[0]).getQuestion(self.username)
            needed_questions.append(question_data)

        return needed_questions

    def changeUsername(self, new_username):
        if self.username != new_username and User.search(new_username) is None:
            query = "UPDATE Users SET Username = ? WHERE Username = ?"
            cursor.execute(query, (new_username, self.username))
            commit_changes()

            self.username = new_username
            return True
        return False

    def changeDisplayName(self, new_display_name):
        query = "UPDATE Users SET Display_Name = ? WHERE Username = ?"
        cursor.execute(query, (new_display_name, self.username))
        commit_changes()

        self.display_name = new_display_name

    def changeBrief(self, new_brief):
        query = "UPDATE Users SET Brief = ? WHERE Username = ?"
        cursor.execute(query, (new_brief, self.username))
        commit_changes()

        self.user_brief = new_brief

    def changeState(self, new_state):
        states = ["online", "offline", "busy"]
        if new_state.lower() in states:
            query = "UPDATE Users SET State = ? WHERE Username = ?"
            cursor.execute(query, (new_state.lower(), self.username))
            commit_changes()

            self.state = new_state.lower()

    def changePassword(self, new_password):
        hashed_new_password = hashlib.sha256(new_password.encode()).hexdigest()

        if self.password == hashed_new_password:
            return "The new password cannot be the current password"

        if hashed_new_password in self.old_passwords:
            return "The password has been used recently"

        query = "UPDATE Users SET PasswordHash = ? WHERE Username = ?"
        cursor.execute(query, (hashed_new_password, self.username))
        commit_changes()

        self.old_passwords = self.old_passwords[1:]
        self.old_passwords.append(self.password)
        self.password = hashed_new_password

        return True

    def pushNotification(self, not_type, info):
        notification_id = str(uuid.uuid4())
        notification_date = getDate()

        query = """
            INSERT INTO Notifications (NotificationID, Username, Type, Date, Info)
            VALUES (?, ?, ?, ?, ?)
        """
        cursor.execute(
            query, (notification_id, self.username, not_type, notification_date, info)
        )
        commit_changes()

        notification = {
            "id": notification_id,
            "type": not_type,
            "date": notification_date,
            "info": info,
        }
        self.notifications = notification | self.notifications

    def newQuestion(self, title, content):
        new_question = Question(self.username, title, content)

        query = """
            INSERT INTO Questions (QuestionID, AuthorID, Title, Content, PublishDate, IsSolved)
            VALUES (?, (SELECT UserID FROM Users WHERE Username = ?), ?, ?, ?, 0)
        """
        cursor.execute(
            query,
            (
                new_question.id,
                self.username,
                title,
                content,
                datetime.fromtimestamp(new_question.publish_date / 1000.0),
            ),
        )
        commit_changes()

        self.user_questions = {new_question.id} | self.user_questions

        for friend_username in self.friends:
            User.search(friend_username).pushNotification(
                "friend_question", self.username
            )

    def saveQuestion(self, id):
        self.saved_questions = {id} | self.saved_questions

        query = """
            INSERT INTO SavedQuestions (Username, QuestionID)
            VALUES (?, ?)
        """
        cursor.execute(query, (self.username, id))
        commit_changes()

        Question.search(id).who_saved_me.add(self.username)

    def unsaveQuestion(self, id, modifiy_who_saved_me):
        if id in self.saved_questions:
            self.saved_questions.remove(id)

            query = """
                DELETE FROM SavedQuestions
                WHERE Username = ? AND QuestionID = ?
            """
            cursor.execute(query, (self.username, id))
            commit_changes()

            if modifiy_who_saved_me:
                Question.search(id).who_saved_me.remove(self.username)

    def recieveRequest(self, username):
        self.recievedRequests.add(username)

        query = """
            INSERT INTO FriendshipRequests (SenderID, ReceiverID)
            VALUES ((SELECT UserID FROM Users WHERE Username = ?), (SELECT UserID FROM Users WHERE Username = ?))
        """
        cursor.execute(query, (username, self.username))
        commit_changes()

        self.pushNotification("friend_request", username)

    def sendRequest(self, username):
        user = User.search(username)
        if user is not None:
            user.recievedRequests.add(self.username)

            query = """
                INSERT INTO FriendshipRequests (SenderID, ReceiverID)
                VALUES ((SELECT UserID FROM Users WHERE Username = ?), (SELECT UserID FROM Users WHERE Username = ?))
            """
            cursor.execute(query, (self.username, username))
            commit_changes()

            self.sentRequests.add(username)

    def searchRecievedRequest(self, username):
        for request in self.recievedRequests:
            if request == username:
                return True
        return False

    def searchSentRequest(self, username):
        for request in self.sentRequests:
            if request == username:
                return True
        return False

    def searchFriend(self, username):
        query = """
            SELECT COUNT(*)
            FROM FriendshipRequests
            WHERE (
                (SenderID = (SELECT UserID FROM Users WHERE Username = ?) AND ReceiverID = (SELECT UserID FROM Users WHERE Username = ?))
                OR
                (SenderID = (SELECT UserID FROM Users WHERE Username = ?) AND ReceiverID = (SELECT UserID FROM Users WHERE Username = ?))
            ) AND ReceiverID IS NOT NULL
        """
        cursor.execute(query, (self.username, username, username, self.username))
        count = cursor.fetchone()[0]
        return count > 0

    def removeRequest(self, username):
        if self.searchSentRequest(username):
            query = """
                DELETE FROM FriendshipRequests
                WHERE SenderID = (SELECT UserID FROM Users WHERE Username = ?)
                AND ReceiverID = (SELECT UserID FROM Users WHERE Username = ?)
            """
            cursor.execute(query, (self.username, username))
            commit_changes()

            self.sentRequests.remove(username)

            User.search(username).recievedRequests.remove(self.username)

    def response2Request(self, username, accept_state):
        if self.searchRecievedRequest(username):
            user = User.search(username)

            query = """
                DELETE FROM FriendshipRequests
                WHERE SenderID = (SELECT UserID FROM Users WHERE Username = ?)
                AND ReceiverID = (SELECT UserID FROM Users WHERE Username = ?)
            """
            cursor.execute(query, (username, self.username))
            commit_changes()

            self.recievedRequests.remove(username)

            user.sentRequests.remove(self.username)

            if accept_state:
                self.friends.add(username)
                user.friends.add(self.username)
                user.pushNotification("request_accepted", self.username)

    def removeFriend(self, username):
        if self.searchFriend(username):
            query = """
                DELETE FROM FriendshipRequests
                WHERE (
                    (SenderID = (SELECT UserID FROM Users WHERE Username = ?) AND ReceiverID = (SELECT UserID FROM Users WHERE Username = ?))
                    OR
                    (SenderID = (SELECT UserID FROM Users WHERE Username = ?) AND ReceiverID = (SELECT UserID FROM Users WHERE Username = ?))
                ) AND ReceiverID IS NOT NULL
            """
            cursor.execute(query, (self.username, username, username, self.username))
            commit_changes()

            self.friends.remove(username)
            User.search(username).friends.remove(self.username)

    @classmethod
    def search(cls, username):
        query = "SELECT * FROM Users WHERE Username = ?"
        cursor.execute(query, (username,))
        user_data = cursor.fetchone()

        if user_data:
            user = cls(user_data.Username, user_data.PasswordHash)
            return user
        else:
            return None

    @classmethod
    def login(cls, username, password):
        query = "SELECT PasswordHash FROM Users WHERE Username = ?"
        cursor.execute(query, (username,))
        result = cursor.fetchone()

        if result:
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            if result.PasswordHash == hashed_password:
                return True
            else:
                return False
        else:
            return False

    def signup(username, password):
        existing_user = User.search(username)
        if existing_user is None:
            new_user = User(username, password)
            query = "INSERT INTO Users (Username, PasswordHash) VALUES (?, ?)"
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            cursor.execute(query, (username, hashed_password))
            commit_changes()
            return True
        return False


# ******************************************************************

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) # for local front end


@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        signup_result = User.signup(username, password)

        if signup_result:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"message": "Username is not valid"}), 400
    except Exception as e:
        print(f"Error in signup route: {e}")
        return jsonify({"error": "Internal server error"}), 500


# *****************************************************************
def authenticate_user(username, password):
    cursor.execute("SELECT PasswordHash FROM Users WHERE Username = ?", (username,))
    result = cursor.fetchone()
    if result and result[0] == hashlib.sha256(password.encode()).hexdigest():
        return True
    return False


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    login_result = User.login(username, password)

    if login_result:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"message": "Username or password is not correct"}), 401


# *****************************************************************
@app.route("/change_display_name", methods=["POST"])
def change_display_name():
    data = request.get_json()

    username = data.get("username")
    new_display_name = data.get("newDisplayName")

    if not username or not new_display_name:
        return jsonify({"error": "Username and new display name are required"}), 400

    user = User.search(username)

    if user:
        change_display_name_result = user.changeDisplayName(new_display_name)

        if change_display_name_result:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"error": "Failed to change display name"}), 500
    else:
        return jsonify({"error": "User not found"}), 404


# *****************************************************************
@app.route("/change_brief", methods=["POST"])
def change_brief():
    data = request.get_json()

    username = data.get("username")
    new_brief = data.get("newBrief")

    if not username or not new_brief:
        return jsonify({"error": "Username and new brief are required"}), 400

    user = User.search(username)

    if user:
        change_brief_result = user.changeBrief(new_brief)

        if change_brief_result:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"error": "Failed to change brief"}), 500
    else:
        return jsonify({"error": "User not found"}), 404


# *****************************************************************
@app.route("/change_password", methods=["POST"])
def change_password():
    data = request.get_json()

    username = data.get("username")
    new_password = data.get("newPassword")

    if not username or not new_password:
        return jsonify({"error": "Username and new password are required"}), 400

    user = User.search(username)

    if user:
        change_password_result = user.changePassword(new_password)

        if change_password_result:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"error": "Failed to change password"}), 500
    else:
        return jsonify({"error": "User not found"}), 404


# ************************************************
@app.route("/get_user_info", methods=["GET"])
def get_user_info():
    username = request.args.get("username")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = User.search(username)

    if user:
        user_info = user.getUserInfo()
        return jsonify(user_info), 200
    else:
        return jsonify({"error": "User not found"}), 404


# ************************************************
@app.route("/get_friends_info", methods=["GET"])
def get_friends_info():
    username = request.args.get("username")
    start_from = int(request.args.get("start_from", 0))
    count = int(request.args.get("count", 10))

    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = User.search(username)

    if user:
        friends_info = user.getFriendsInfo(start_from, count)
        return jsonify(friends_info), 200
    else:
        return jsonify({"error": "User not found"}), 404


# ************************************************
@app.route("/get_user_questions", methods=["GET"])
def get_user_questions():
    username = request.args.get("username")
    start_from = int(request.args.get("start_from", 0))
    count = int(request.args.get("count", 10))

    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = User.search(username)

    if user:
        user_questions = user.getUserQuestions(start_from, count)
        return jsonify(user_questions), 200
    else:
        return jsonify({"error": "User not found"}), 404


# ****************************************************
@app.route("/get_user_saved_questions", methods=["GET"])
def get_user_saved_questions():
    username = request.args.get("username")
    start_from = int(request.args.get("start_from", 0))
    count = int(request.args.get("count", 10))

    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = User.search(username)

    if user:
        saved_questions = user.getSavedQuestions(start_from, count)
        return jsonify(saved_questions), 200
    else:
        return jsonify({"error": "User not found"}), 404


# ****************************************************
@app.route("/get_notifications", methods=["GET"])
def get_notifications():
    username = request.args.get("username")
    start_from = int(request.args.get("start_from", 0))
    count = int(request.args.get("count", 10))

    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = User.search(username)

    if user:
        notifications = user.getNotifications(start_from, count)
        return jsonify(notifications), 200
    else:
        return jsonify({"error": "User not found"}), 404


# ****************************************************
@app.route("/change_username", methods=["PUT"])
def change_username():
    data = request.get_json()
    old_username = data.get("oldUsername")
    new_username = data.get("newUsername")

    if not old_username or not new_username:
        return jsonify({"error": "Invalid input"}), 400

    user = User.search(old_username)

    if user is None:
        return jsonify({"message": "User doesn't exist"}), 404

    result = user.changeUsername(new_username)

    if result is True:
        return jsonify({"message": "Username changed successfully"}), 200
    else:
        return jsonify({"error": "Username is not available"}), 409


# ****************************************************
@app.route("/change_state", methods=["PUT"])
def change_state():
    data = request.get_json()
    username = data.get("username")
    new_state = data.get("newState")

    if not username or not new_state:
        return jsonify({"error": "Invalid input"}), 400

    user = User.search(username)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    user.changeState(new_state)

    return jsonify({"message": "User state changed successfully", "success": True}), 200


# *******************************************************************
@app.route("/new_question", methods=["POST"])
def new_question():
    data = request.get_json()
    author = data.get("author")
    title = data.get("title")
    content = data.get("content")

    if not author or not title or not content:
        return jsonify({"error": "Invalid input"}), 400

    user = User.search(author)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    user.newQuestion(title, content)
    return jsonify({"message": "Question created successfully", "success": True}), 200


# *******************************************************************
@app.route("/del_question", methods=["DELETE"])
def del_question():
    question_id = request.args.get("question_id")

    if not question_id:
        return jsonify({"error": "Question ID is required"}), 400

    question = Question.search(question_id)

    if question is None:
        return jsonify({"error": "Question not found"}), 404

    Question.remove(question_id)
    return jsonify({"message": "Question deleted successfully", "success": True}), 200


# *******************************************************************
@app.route("/save_question", methods=["POST"])
def save_question():
    data = request.get_json()

    username = data.get("username")
    question_id = data.get("question_id")

    if not username or not question_id:
        return jsonify({"error": "Username and question ID are required"}), 400

    user = User.search(username)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    question = Question.search(question_id)

    if question is None:
        return jsonify({"error": "Question not found"}), 404

    user.saveQuestion(question_id)
    return jsonify({"message": "Question saved successfully", "success": True}), 200


# *******************************************************************
@app.route("/unsave_question", methods=["POST"])
def unsave_question():
    data = request.get_json()

    username = data.get("username")
    question_id = data.get("question_id")

    if not username or not question_id:
        return jsonify({"error": "Username and question ID are required"}), 400

    user = User.search(username)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    question = Question.search(question_id)

    if question is None:
        return jsonify({"error": "Question not found"}), 404

    user.unsaveQuestion(
        question_id, True
    )  # Assuming the second parameter is to modify who_saved_me

    return jsonify({"message": "Question unsaved successfully", "success": True}), 200


# *******************************************************************
@app.route("/get_question", methods=["GET"])
def get_question():
    question_id = request.args.get("question_id")
    current_user_username = request.args.get("current_user_username")

    if not question_id or not current_user_username:
        return (
            jsonify({"error": "Question ID and current user username are required"}),
            400,
        )

    question = Question.search(question_id)

    if question is None:
        return jsonify({"error": "Question not found"}), 404

    result = question.getQuestion(current_user_username)

    return jsonify(result), 200


# *******************************************************************
@app.route("/edit_question", methods=["PUT"])
def edit_question():
    data = request.get_json()

    question_id = data.get("question_id")
    new_title = data.get("new_title")
    new_content = data.get("new_content")
    new_solved_state = data.get("new_solved_state")

    if not question_id or not new_title or new_solved_state is None:
        return (
            jsonify(
                {"error": "Question ID, new title, and new solved state are required"}
            ),
            400,
        )

    question = Question.search(question_id)

    if question is None:
        return jsonify({"error": "Question not found"}), 404

    question.editQuestion(new_title, new_content, new_solved_state)

    return jsonify({"message": "Question edited successfully", "success": True}), 200


# *******************************************************************
@app.route("/set_question_solved_state", methods=["PUT"])
def set_question_solved_state():
    data = request.get_json()

    question_id = data.get("question_id")
    new_solved_state = data.get("new_solved_state")

    if not question_id or new_solved_state is None:
        return jsonify({"error": "Question ID and new solved state are required"}), 400

    question = Question.search(question_id)

    if question is None:
        return jsonify({"error": "Question not found"}), 404

    question.setSolvedState(new_solved_state)

    return (
        jsonify({"message": "Question solved state set successfully", "success": True}),
        200,
    )


# *******************************************************************
@app.route("/answer_question", methods=["POST"])
def answer_question():
    data = request.get_json()

    question_id = data.get("question_id")
    answer_author = data.get("answer_author")
    content = data.get("content")

    if not question_id or not answer_author or not content:
        return (
            jsonify({"error": "Question ID, answer author, and content are required"}),
            400,
        )

    question = Question.search(question_id)

    if question is None:
        return jsonify({"error": "Question not found"}), 404

    question.addAnswer(answer_author, content)

    return jsonify({"message": "Answer added successfully", "success": True}), 200


# *******************************************************************
@app.route("/get_question_answers", methods=["GET"])
def get_question_answers():
    question_id = request.args.get("question_id")
    start_from = int(request.args.get("start_from", 0))
    count = int(request.args.get("count", 10))

    if not question_id:
        return jsonify({"error": "Question ID is required"}), 400

    question = Question.search(question_id)

    if question is None:
        return jsonify({"error": "Question not found"}), 404

    answers = question.getAnswers(start_from, count)

    return jsonify({"answers": answers, "success": True}), 200


# *******************************************************************
@app.route("/edit_question_answer", methods=["PUT"])
def edit_question_answer():
    data = request.get_json()

    question_id = data.get("question_id")
    answer_id = data.get("answer_id")
    new_content = data.get("new_content")

    if not question_id or not answer_id or not new_content:
        return (
            jsonify({"error": "Question ID, answer ID, and new content are required"}),
            400,
        )

    question = Question.search(question_id)

    if question is None:
        return jsonify({"error": "Question not found"}), 404

    success = question.editAnswer(answer_id, new_content)

    if success:
        return jsonify({"message": "Answer edited successfully", "success": True}), 200
    else:
        return jsonify({"error": "Answer not found or could not be edited"}), 404


# *******************************************************************
@app.route("/remove_question_answer", methods=["DELETE"])
def remove_question_answer():
    data = request.get_json()

    question_id = data.get("question_id")
    answer_id = data.get("answer_id")

    if not question_id or not answer_id:
        return jsonify({"error": "Question ID and Answer ID are required"}), 400

    question = Question.search(question_id)

    if question is None:
        return jsonify({"error": "Question not found"}), 404

    question.removeAnswer(answer_id)

    return jsonify({"message": "Answer removed successfully", "success": True}), 200


# *******************************************************************
@app.route("/remove_request", methods=["DELETE"])
def remove_request():
    data = request.get_json()

    sender_username = data.get("sender_username")
    receiver_username = data.get("receiver_username")

    if not sender_username or not receiver_username:
        return jsonify({"error": "Sender and receiver usernames are required"}), 400

    sender_user = User.search(sender_username)

    if sender_user is None:
        return jsonify({"error": "Sender user not found"}), 404

    sender_user.removeRequest(receiver_username)

    return (
        jsonify({"message": "Friend request removed successfully", "success": True}),
        200,
    )


# *******************************************************************
@app.route("/response_to_request", methods=["POST"])
def response_to_request():
    data = request.get_json()

    receiver_username = data.get("receiver_username")
    sender_username = data.get("sender_username")
    accept_state = data.get("accept_state")

    if not receiver_username or not sender_username or accept_state is None:
        return (
            jsonify(
                {
                    "error": "Receiver username, sender username, and accept state are required"
                }
            ),
            400,
        )

    receiver_user = User.search(receiver_username)

    if receiver_user is None:
        return jsonify({"error": "Receiver user not found"}), 404

    success = receiver_user.response2Request(sender_username, accept_state)

    if success:
        return (
            jsonify(
                {
                    "message": "Friend request response processed successfully",
                    "success": True,
                }
            ),
            200,
        )
    else:
        return jsonify({"error": "Failed to process friend request response"}), 500


# *******************************************************************
@app.route("/remove_friend", methods=["DELETE"])
def remove_friend():
    data = request.get_json()

    self_username = data.get("self_username")
    friend_username = data.get("friend_username")

    # Check if required data is provided
    if not self_username or not friend_username:
        return jsonify({"error": "Self username and friend username are required"}), 400

    user = User.search(self_username)
    friend = User.search(friend_username)

    if user is None or friend is None:
        return jsonify({"error": "User or friend not found"}), 404

    success = user.removeFriend(friend_username)

    if success:
        return jsonify({"message": "Friend removed successfully", "success": True}), 200
    else:
        return jsonify({"error": "Failed to remove friend"}), 500


# *******************************************************************
@app.route("/check_if_friend", methods=["GET"])
def check_if_friend():
    self_username = request.args.get("self_username")
    friend_username = request.args.get("friend_username")

    if not self_username or not friend_username:
        return jsonify({"error": "Self username and friend username are required"}), 400

    user = User.search(self_username)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    is_friend = user.searchFriend(friend_username)

    return jsonify({"is_friend": is_friend}), 200


# *******************************************************************
@app.route("/check_if_requested_me", methods=["GET"])
def check_if_requested_me():
    self_username = request.args.get("self_username")
    friend_username = request.args.get("friend_username")

    if not self_username or not friend_username:
        return jsonify({"error": "Self username and friend username are required"}), 400

    user = User.search(self_username)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    requested_me = user.searchRecievedRequest(friend_username)

    return jsonify({"requested_me": requested_me}), 200


# *******************************************************************
@app.route("/check_if_i_requested", methods=["GET"])
def check_if_i_requested():
    self_username = request.args.get("self_username")
    friend_username = request.args.get("friend_username")

    if not self_username or not friend_username:
        return jsonify({"error": "Self username and friend username are required"}), 400

    user = User.search(self_username)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    i_requested = user.searchSentRequest(friend_username)

    return jsonify({"i_requested": i_requested}), 200


# *******************************************************************
if __name__ == "__main__":
    app.run(debug=True)
