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
let userLibrary = [];
if (localStorage.length && !localStorage.getItem("debug")) {
  let i = 0;
  while (userLibrary.length != localStorage.length) {
    if (localStorage.getItem("Book" + i) != null) {
      userLibrary.push(JSON.parse(localStorage.getItem("Book" + i)));
      createBookCard();
    }
    i++;
  }
} else if (localStorage.getItem("debug")) {
  let i = 0;
  while (userLibrary.length != localStorage.length - 1) {
    if (localStorage.getItem("Book" + i) != null) {
      userLibrary.push(JSON.parse(localStorage.getItem("Book" + i)));
      createBookCard(i);
    }
    i++;
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
    localStorage.removeItem("Book" + userLibrary[index].index);
    userLibrary.splice(index, 1);
    books.removeChild(
      document.querySelector("[data-index-number='" + index + "']")
    );
  });
  books.appendChild(card);
}
addBtn.addEventListener("click", getInput);
saveBtn.addEventListener("click", endInput);
cancelBtn.addEventListener("click", closeInput);
