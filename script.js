//TODO:
//Add encryption for user data
const ApiUrl =
  "https://script.google.com/macros/s/AKfycby1GnO8jifLaTR6BcQYkQs5h_DgsjDzLRoeGbGT4UUkpCTCpw2pWvW4LJZlil5ZMD5uTQ/exec";
const ApiKey = "https://api.apispreadsheets.com/data/cykJQp2spsJ2WCVu/";

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
const form = document.getElementById("registerForm");
const logBtn = document.getElementById("first");
const signBtn = document.getElementById("second");
const signUp = document.getElementById("signUp");
const error = document.createElement("div");
error.classList.add("error");
registerPopup.appendChild(error);

let logged = true;
let logging = false;
let userLibrary = [];

const forgotPass = document.createElement("div");
forgotPass.classList.add("absolute");
forgotPass.setAttribute("id", "forgotPass");
forgotPass.textContent = ""; //Forgot password?
registerPopup.insertBefore(forgotPass, submitBtn);

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
  updateData();
  createBookCard(userLibrary[i]);
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
function createBookCard(book) {
  let title = document.createElement("div");
  let author = document.createElement("div");
  let pages = document.createElement("div");
  let isRead = document.createElement("button");
  let remove = document.createElement("button");
  let elements = [title, author, pages, isRead, remove];
  let card = document.createElement("div");
  card.setAttribute("data-index-number", book.index);
  card.classList.add("card");
  title.textContent = "'" + book.name + "'";
  author.textContent = book.author;
  pages.textContent = book.pages;
  title.classList.add("output");
  author.classList.add("output");
  pages.classList.add("output");
  isRead.classList.add(book.isRead ? "read" : "notRead");
  isRead.textContent = book.isRead ? "Read" : "Not read yet";
  remove.classList.add("remove");
  isRead.addEventListener("click", function () {
    if (this.textContent === "Read") {
      this.textContent = "Not read yet";
      this.classList.add("notRead");
      this.classList.remove("read");
      book.isRead = false;
      updateData();
    } else {
      this.textContent = "Read";
      this.classList.add("read");
      this.classList.remove("notRead");
      book.isRead = true;
      updateData();
    }
  });
  remove.textContent = "Remove";
  for (let element of elements) {
    card.appendChild(element);
  }
  remove.addEventListener("click", () => {
    userLibrary.splice(book.index, 1);
    for (let i = book.index; i < userLibrary.length; i++) {
      userLibrary[i].index--;
    }
    updateData();
    books.removeChild(
      document.querySelector("[data-index-number='" + book.index + "']")
    );
  });
  books.appendChild(card);
}
function register() {
  let data;
  fetch(ApiKey, {
    method: "POST",
    body: JSON.stringify({
      data: {
        UserName: userName.value,
        Password: password.value,
        Books: "request",
      },
    }),
  }).then(() =>
    setTimeout(
      fetch(ApiUrl).then((d) => {
        d.json().then((d) => {
          data = d;
          console.log(data);
          if (logging) {
            if (data.data !== "null") {
              handleData(data);
              closeInput();
            } else if (data.data === "null") {
              if (!document.querySelector(".error")) {
                const error = document.createElement("div");
                error.classList.add("error");
                registerPopup.appendChild(error);
              }
              error.textContent = "Username or Password are wrong";
            }
          } else if (!logging) {
            checkName(data);
          }
        });
      }),
      200
    )
  );
}

function endRegister(nameExist) {
  if (nameExist) error.textContent = "Username already existing";
  else if (!nameExist) {
    closeInput();
    form.parentNode.removeChild(form);
    updateData();
  }
}
// function checkCredentials(data) {
//   logged = false;
//   for (let i = 0; i < data.data.length; i++) {
//     if (
//       userName.value == data.data[i].UserName &&
//       password.value == data.data[i].Password
//     ) {
//       logged = true;
//       closeInput();
//       form.parentNode.removeChild(form);
//       handleData(data);
//     }
//   }
//   if (!logged) error.textContent = "Username or Password are wrong";
// }
function checkName(data) {
  let nameExist = false;
  for (let i = 0; i < data.data.length; i++) {
    if (userName.value == data.data[i].UserName) {
      nameExist = true;
    }
  }
  endRegister(nameExist);
}
function subFor() {
  if (userName.value !== "" && password.value !== "") register();
}
function updateData() {
  fetch(ApiKey, {
    method: "POST",
    body: JSON.stringify({
      data: {
        UserName: userName.value,
        Password: password.value,
        Books: JSON.stringify(userLibrary),
      },
    }),
  }).then((res) => {
    if (res.status === 201) {
      // SUCCESS
    } else {
      alert("Something went wrong :(");
      window.location.reload();
    }
  });
}
function handleData(data) {
  userLibrary = JSON.parse(data.data.Books);
  for (let book of userLibrary) {
    createBookCard(book);
  }
}
function activeLog() {
  if (logBtn.classList.contains("show")) return;
  logBtn.classList.add("show");
  signBtn.classList.remove("show");
  signUp.textContent = "Log in";
  logging = true;
}
function activeSign() {
  if (signBtn.classList.contains("show")) return;
  signBtn.classList.add("show");
  logBtn.classList.remove("show");
  signUp.textContent = "Sign up";
  logging = false;
}
addBtn.addEventListener("click", getInput);
saveBtn.addEventListener("click", endInput);
cancelBtn.addEventListener("click", closeInput);
submitBtn.addEventListener("click", subFor);
form.addEventListener("submit", (e) => e.preventDefault());
logBtn.addEventListener("click", activeLog);
signBtn.addEventListener("click", activeSign);
