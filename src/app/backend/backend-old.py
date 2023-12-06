from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
from datetime import datetime
import uuid
import pyodbc
from werkzeug.security import check_password_hash

# connect to database :
server = "oopservername.database.windows.net"  # Replace with your SQL Server instance or Azure SQL Database server name
database = "OOP_PROJECT_DB"  # Replace with your database name
username = "sqladmin"  # Replace with your SQL Server username
password = "tarek055@"  # Replace with your SQL Server password

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

        # Save the answer to the database
        query = """
            INSERT INTO Answers (AnswerID, QuestionID, AuthorID, Content, PublishDate)
            VALUES (?, ?, ?, ?, ?)
        """
        cursor.execute(query, (answer_id, self.id, author, content, datetime.now()))
        commit_changes()

        # Notify the question author
        question_author = User.search(self.author)
        if question_author:
            question_author.pushNotification(
                "question_answered", {"question": self.id, "answer": answer_id}
            )

    def editAnswer(self, id, new_content):
        for answer in self.answers:
            if answer["id"] == id:
                answer["content"] = new_content

                # Update the answer in the database
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
        # Fetch the total count of answers from the database
        query = """
            SELECT COUNT(AnswerID)
            FROM Answers
            WHERE QuestionID = ?
        """
        cursor.execute(query, (self.id,))
        total_answers_count = cursor.fetchone()[0]

        # Return the count within the specified range
        return total_answers_count[start_from : start_from + count]

    # Return Question Data And If A Spicific User Saved It
    def getQuestion(self, username):
        is_saved = False
        for user in self.who_saved_me:
            if user == username:
                is_saved = True

        # Fetch question data from the database
        query = """
            SELECT Q.QuestionID, Q.AuthorID, Q.Title, Q.Content, Q.PublishDate, Q.IsSolved
            FROM Questions Q
            WHERE Q.QuestionID = ?
        """
        cursor.execute(query, (self.id,))
        question_data = cursor.fetchone()

        # Format the result as a dictionary
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


# *********************************


class User:
    users = []

    def __init__(self, username, password):
        self.username = username
        self.display_name = (
            username  # ==============================================================
        )
        self.password = hashlib.sha256(password.encode()).hexdigest()
        self.old_passwords = []
        # self.picture = ""
        # self.picture_sm = ""
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
        # Fetch user data from the database
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

        # Format the result as a list of dictionaries
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

    # edit this again ******************************
    def getNotifications(self, start_from, count):
        query = "SELECT * FROM Notifications WHERE Username = ? ORDER BY Date OFFSET ? ROWS FETCH NEXT ? ROWS ONLY"
        cursor.execute(query, (self.username, start_from, count))
        notifications = cursor.fetchall()

        return notifications

    # ******************************

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

        # Format the result as a list of dictionaries
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

        # Format the result as a list of dictionaries
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

            # Update the instance's username
            self.username = new_username
            return True
        return False

    def changeDisplayName(self, new_display_name):
        query = "UPDATE Users SET Display_Name = ? WHERE Username = ?"
        cursor.execute(query, (new_display_name, self.username))
        commit_changes()

        # Update the instance's display name
        self.display_name = new_display_name

    def changeBrief(self, new_brief):
        query = "UPDATE Users SET Brief = ? WHERE Username = ?"
        cursor.execute(query, (new_brief, self.username))
        commit_changes()

        # Update the instance's brief
        self.user_brief = new_brief

    # def changePic(self, pic_url, sm_pic_url):
    #     self.picture = pic_url
    #     self.picture_sm = sm_pic_url

    def changeState(self, new_state):
        states = ["online", "offline", "busy"]
        if new_state.lower() in states:
            query = "UPDATE Users SET State = ? WHERE Username = ?"
            cursor.execute(query, (new_state.lower(), self.username))
            commit_changes()

            # Update the instance's state
            self.state = new_state.lower()

    def changePassword(self, new_password):
        hashed_new_password = hashlib.sha256(new_password.encode()).hexdigest()

        # Check if the new password is the current password
        if self.password == hashed_new_password:
            return "The new password cannot be the current password"

        # Check if the new password has been used recently
        if hashed_new_password in self.old_passwords:
            return "The password has been used recently"

        # Update the password in the database
        query = "UPDATE Users SET PasswordHash = ? WHERE Username = ?"
        cursor.execute(query, (hashed_new_password, self.username))
        commit_changes()

        # Update the instance's password and old passwords
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

        # Update the instance's notifications
        notification = {
            "id": notification_id,
            "type": not_type,
            "date": notification_date,
            "info": info,
        }
        self.notifications = notification | self.notifications

    def newQuestion(self, title, content):
        # Create a new question instance
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

        # Update the instance's user_questions
        self.user_questions = {new_question.id} | self.user_questions

        # Push Notification
        for friend_username in self.friends:
            User.search(friend_username).pushNotification(
                "friend_question", self.username
            )

    def saveQuestion(self, id):
        # Update the instance's saved_questions
        self.saved_questions = {id} | self.saved_questions

        query = """
            INSERT INTO SavedQuestions (Username, QuestionID)
            VALUES (?, ?)
        """
        cursor.execute(query, (self.username, id))
        commit_changes()

        # Update the who_saved_me in the Question class
        Question.search(id).who_saved_me.add(self.username)

    def unsaveQuestion(self, id, modifiy_who_saved_me):
        # Check if the question is saved
        if id in self.saved_questions:
            # Remove the saved question from the instance's saved_questions
            self.saved_questions.remove(id)

            # Delete the corresponding row from the SavedQuestions table
            query = """
                DELETE FROM SavedQuestions
                WHERE Username = ? AND QuestionID = ?
            """
            cursor.execute(query, (self.username, id))
            commit_changes()

            # Update who_saved_me in the Question class if needed
            if modifiy_who_saved_me:
                Question.search(id).who_saved_me.remove(self.username)

    def recieveRequest(self, username):
        # Update the instance's receivedRequests
        self.recievedRequests.add(username)

        query = """
            INSERT INTO FriendshipRequests (SenderID, ReceiverID)
            VALUES ((SELECT UserID FROM Users WHERE Username = ?), (SELECT UserID FROM Users WHERE Username = ?))
        """
        cursor.execute(query, (username, self.username))
        commit_changes()

        # Push Notification
        self.pushNotification("friend_request", username)

    def sendRequest(self, username):
        user = User.search(username)
        if user is not None:
            # Update the receivedRequests for the recipient
            user.recievedRequests.add(self.username)

            query = """
                INSERT INTO FriendshipRequests (SenderID, ReceiverID)
                VALUES ((SELECT UserID FROM Users WHERE Username = ?), (SELECT UserID FROM Users WHERE Username = ?))
            """
            cursor.execute(query, (self.username, username))
            commit_changes()

            # Update the sentRequests for the sender
            self.sentRequests.add(username)

    # Edit it agian ********************************
    # Search If A Spicific User Requested Me
    def searchRecievedRequest(self, username):
        for request in self.recievedRequests:
            if request == username:
                return True
        return False

    # Search If The User Requested A Spicific One
    def searchSentRequest(self, username):
        for request in self.sentRequests:
            if request == username:
                return True
        return False

    # ****************************************************************
    # Check If He Is My Friend
    def searchFriend(self, username):
        # Check if the specified user is a friend of the current user
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
        # Check if the current user has sent a friend request to the specified user
        if self.searchSentRequest(username):
            query = """
                DELETE FROM FriendshipRequests
                WHERE SenderID = (SELECT UserID FROM Users WHERE Username = ?)
                AND ReceiverID = (SELECT UserID FROM Users WHERE Username = ?)
            """
            cursor.execute(query, (self.username, username))
            commit_changes()

            # Update the sentRequests for the current user
            self.sentRequests.remove(username)

            # Update the receivedRequests for the specified user
            User.search(username).recievedRequests.remove(self.username)

    def response2Request(self, username, accept_state):
        # Check if the current user has received a friend request from the specified user
        if self.searchRecievedRequest(username):
            user = User.search(username)

            query = """
                DELETE FROM FriendshipRequests
                WHERE SenderID = (SELECT UserID FROM Users WHERE Username = ?)
                AND ReceiverID = (SELECT UserID FROM Users WHERE Username = ?)
            """
            cursor.execute(query, (username, self.username))
            commit_changes()

            # Update the receivedRequests for the current user
            self.recievedRequests.remove(username)

            # Update the sentRequests for the specified user
            user.sentRequests.remove(self.username)

            if accept_state:
                # If the request is accepted, update the friends list for both users
                self.friends.add(username)
                user.friends.add(self.username)
                user.pushNotification("request_accepted", self.username)

    def removeFriend(self, username):
        # Check if the specified user is a friend of the current user
        if self.searchFriend(username):
            # Remove the friendship from the database
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

            # Update the friends list for both users
            self.friends.remove(username)
            User.search(username).friends.remove(self.username)

    @classmethod
    def search(cls, username):
        for user in cls.users:
            if user.username == username:
                return user
        return None

    @classmethod
    def login(cls, username, password):
        user = cls.search(username)
        if user != None:
            if user.password == password:
                return True
        else:
            return False


def signup(username, password):  # ===================================================
    if User.search(username) == None:
        User(username, password)
        return True
    return False


# ******************************************************************

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) # for local front end


@app.route("/signin", methods=["POST"])
def sign_in():
    data = request.get_json()

    if "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password are required"}), 400

    username = data["username"]
    password = data["password"]

    query = f"SELECT * FROM Users WHERE Username = ?"
    cursor.execute(query, (username,))
    user = cursor.fetchone()

    if user and check_password_hash(user.PasswordHash, password):
        return jsonify({"message": "Sign-in successful"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


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
        return jsonify({"error": "Invalid credentials"}), 401

    if authenticate_user(username, password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


# *****************************************************************
@app.route("/change_display_name", methods=["PUT"])
def change_display_name():
    data = request.get_json()
    username = data.get("username")
    new_display_name = data.get("new_display_name")

    if not username or not new_display_name:
        return jsonify({"error": "Invalid input"}), 400

    cursor.execute(
        "UPDATE Users SET Display_Name = ? WHERE Username = ?",
        (new_display_name, username),
    )
    commit_changes()

    return jsonify({"message": "Display name changed successfully"}), 200


# *****************************************************************
@app.route("/change_brief", methods=["PUT"])
def change_brief():
    data = request.get_json()
    username = data.get("username")
    new_brief = data.get("new_brief")

    if not username or not new_brief:
        return jsonify({"error": "Invalid input"}), 400

    cursor.execute(
        "UPDATE Users SET Brief = ? WHERE Username = ?", (new_brief, username)
    )
    commit_changes()

    return jsonify({"message": "Brief changed successfully"}), 200


# *****************************************************************
@app.route("/change_state", methods=["PUT"])
def change_state():
    data = request.get_json()
    username = data.get("username")
    new_state = data.get("new_state")

    if not username or not new_state:
        return jsonify({"error": "Invalid input"}), 400

    # Validate new_state to be one of 'online', 'offline', 'busy'
    if new_state.lower() not in ["online", "offline", "busy"]:
        return jsonify({"error": "Invalid state"}), 400

    cursor.execute(
        "UPDATE Users SET State = ? WHERE Username = ?", (new_state, username)
    )
    commit_changes()

    return jsonify({"message": "User state changed successfully"}), 200


# *****************************************************************
@app.route("/change_password", methods=["PUT"])
def change_password():
    data = request.get_json()
    username = data.get("username")
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not username or not old_password or not new_password:
        return jsonify({"error": "Invalid input"}), 400

    # Authenticate the user
    if not authenticate_user(username, old_password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Change the password
    hashed_new_password = hashlib.sha256(new_password.encode()).hexdigest()
    cursor.execute(
        "UPDATE Users SET PasswordHash = ? WHERE Username = ?",
        (hashed_new_password, username),
    )
    commit_changes()

    return jsonify({"message": "Password changed successfully"}), 200


if __name__ == "__main__":
    app.run(debug=True)
