const overlay = document.getElementById("overlay");
const books = document.getElementById("books");
const cancelBtn = document.getElementById("cancelBtn");
const readBook = document.querySelector(".bookIsRead");
const pagesInput = document.querySelector(".bookPages");
const authorInput = document.querySelector(".bookAuthor");
const titleInput = document.querySelector(".bookTitle");
const addBtn = document.getElementById("addBtn");
const inputPopup = document.getElementById("inputPopup");
const saveBtn = document.getElementById("saveBtn");
const submitBtn = document.getElementById("submitBtn");
const registerPopup = document.getElementById("registerPopup");
const registerText = document.querySelector(".text");
const userName = document.getElementById("userName");
const password = document.querySelector(".password");
let userLibrary = [];
let logging;
if (localStorage.getItem("userName") && localStorage.getItem("password")) {
  logging = true;
  registerText.textContent = "Log in";
  const forgotPass = document.createElement("div");
  forgotPass.classList.add("absolute");
  forgotPass.setAttribute("id", "forgotPass");
  forgotPass.textContent = "Forgot password?";
  forgotPass.addEventListener("click", resetPass);
  registerPopup.insertBefore(forgotPass, submitBtn);
} else {
  logging = false;
  localStorage.clear();
}
if (localStorage.length && !localStorage.getItem("debug") && logging) {
  let i = 0;
  if (logging) {
    while (userLibrary.length != localStorage.length - 2) {
      if (localStorage.getItem("Book" + i) != null) {
        userLibrary.push(JSON.parse(localStorage.getItem("Book" + i)));
        createBookCard(i);
      }
      i++;
    }
  } else {
    while (userLibrary.length != localStorage.length) {
      if (localStorage.getItem("Book" + i) != null) {
        userLibrary.push(JSON.parse(localStorage.getItem("Book" + i)));
        createBookCard(i);
      }
      i++;
    }
  }
} else if (localStorage.getItem("debug") && logging) {
  let i = 0;
  if (logging) {
    while (userLibrary.length != localStorage.length - 3) {
      if (localStorage.getItem("Book" + i) != null) {
        userLibrary.push(JSON.parse(localStorage.getItem("Book" + i)));
        createBookCard(i);
      }
      i++;
    }
  } else {
    while (userLibrary.length != localStorage.length - 1) {
      if (localStorage.getItem("Book" + i) != null) {
        userLibrary.push(JSON.parse(localStorage.getItem("Book" + i)));
        createBookCard(i);
      }
      i++;
    }
  }
}
function BookCreate(name, author, pages, isRead, index) {
  return { name, author, pages, isRead, index };
}
function getInput() {
  inputPopup.classList.add("show");
  overlay.classList.add("show");
}
function endInput() {
  closeInput();
  let index = userLibrary.length;
  let Book = BookCreate(
    titleInput.value,
    authorInput.value,
    pagesInput.value,
    readBook.checked,
    index
  );
  userLibrary.push(Book);
  let i = userLibrary.length - 1;
  while (localStorage.getItem("Book" + i)) i++;
  localStorage.setItem("Book" + i, JSON.stringify(Book));
  createBookCard(i);
  titleInput.value = "";
  authorInput.value = "";
  pagesInput.value = "";
  readBook.checked = false;
}
function closeInput() {
  registerPopup.classList.remove("show");
  inputPopup.classList.remove("show");
  overlay.classList.remove("show");
}
function createBookCard(i) {
  let index = userLibrary.length - 1;
  let elements = [
    (title = document.createElement("div")),
    (author = document.createElement("div")),
    (pages = document.createElement("div")),
    (isRead = document.createElement("button")),
    (remove = document.createElement("button")),
  ];
  card = document.createElement("div");
  card.setAttribute("data-index-number", index);
  card.classList.add("card");
  title.textContent = "'" + userLibrary[index].name + "'";
  author.textContent = userLibrary[index].author;
  pages.textContent = userLibrary[index].pages;
  title.classList.add("output");
  author.classList.add("output");
  pages.classList.add("output");
  isRead.classList.add(userLibrary[index].isRead ? "read" : "notRead");
  isRead.textContent = userLibrary[index].isRead ? "Read" : "Not read yet";
  remove.classList.add("remove");
  isRead.addEventListener("click", function () {
    if (this.textContent === "Read") {
      this.textContent = "Not read yet";
      this.classList.add("notRead");
      this.classList.remove("read");
      userLibrary[index].isRead = false;
      localStorage.setItem("Book" + i, JSON.stringify(userLibrary[index]));
    } else {
      this.textContent = "Read";
      this.classList.add("read");
      this.classList.remove("notRead");
      userLibrary[index].isRead = true;
      localStorage.setItem("Book" + i, JSON.stringify(userLibrary[index]));
    }
  });
  remove.textContent = "Remove";
  for (let element of elements) {
    card.appendChild(element);
  }
  remove.addEventListener("click", () => {
    let _index = index;
    localStorage.removeItem("Book" + userLibrary[index].index);
    userLibrary.splice(index, 1, null);
    books.removeChild(
      document.querySelector("[data-index-number='" + _index + "']")
    );
  });
  books.appendChild(card);
}
function register() {
  let logged = true;
  if (logging) {
    if (
      userName.value != localStorage.getItem("userName") ||
      password.value != localStorage.getItem("password")
    ) {
      logged = false;
    }
    if (logged) closeInput();
    else if (!document.querySelector(".error")) {
      const error = document.createElement("div");
      error.classList.add("error");
      registerPopup.appendChild(error);
      error.textContent = "Username or password are wrong";
    }
  } else {
    if (userName.value == "" || password.value == "") {
      const error = document.createElement("div");
      error.classList.add("error");
      registerPopup.appendChild(error);
      error.textContent = "Must insert a username and a password";
    } else {
      closeInput();
      localStorage.setItem("userName", userName.value);
      localStorage.setItem("password", password.value);
    }
  }
}
function resetPass() {
  forgotPass.textContent = "Are you sure?";
  const question = document.createElement("div");
  question.textContent = "In this way you will lose everything";
  forgotPass.appendChild(question);
  const answer1 = document.createElement("button");
  answer1.textContent = "Yes";
  answer1.setAttribute("id", "answer1");
  answer1.addEventListener("click", () => {
    localStorage.clear();
    window.location.reload();
  });
  forgotPass.appendChild(answer1);
  const answer2 = document.createElement("button");
  answer2.textContent = "No";
  answer2.setAttribute("id", "answer2");
  answer2.addEventListener("click", () => {
    window.location.reload();
  });
  forgotPass.appendChild(answer2);
  forgotPass.classList.remove("absolute");
  registerPopup.style.height = "360px";
  registerPopup.style.gap = "30px";
}
addBtn.addEventListener("click", getInput);
saveBtn.addEventListener("click", endInput);
cancelBtn.addEventListener("click", closeInput);
submitBtn.addEventListener("click", register);
