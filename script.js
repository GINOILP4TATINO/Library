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
function BookCreate(name, author, pages, isRead) {
  return { name, author, pages, isRead };
}
function getInput() {
  inputPopup.classList.add("show");
}
function endInput() {
  closeInput();
  let Book = BookCreate(
    titleInput.value,
    authorInput.value,
    pagesInput.value,
    readBook.checked
  );
  userLibrary.push(Book);
  createBookCard();
  titleInput.value = "";
  authorInput.value = "";
  pagesInput.value = "";
  readBook.checked = false;
}
function closeInput() {
  inputPopup.classList.remove("show");
}
function createBookCard() {
  let elements = [
    (title = document.createElement("div")),
    (author = document.createElement("div")),
    (pages = document.createElement("div")),
    (isRead = document.createElement("button")),
    (remove = document.createElement("button")),
  ];
  card = document.createElement("div");
  card.setAttribute("data-index-number", userLibrary.length - 1);
  card.classList.add("card");
  let index = card.getAttribute("data-index-number");
  title.textContent = userLibrary[index].name;
  author.textContent = userLibrary[index].author;
  pages.textContent = userLibrary[index].pages;
  isRead.textContent = userLibrary[index].isRead ? "Read" : "Not read yet";
  isRead.addEventListener("click", toggleRead);
  remove.textContent = "Remove";
  for (let element of elements) {
    card.appendChild(element);
  }
  remove.addEventListener("click", () => {
    console.log(index);
    userLibrary.splice(index, 1);
    books.removeChild(
      document.querySelector("[data-index-number='" + index + "']")
    );
  });
  books.appendChild(card);
}
function toggleRead() {
  this.textContent === "Read"
    ? (this.textContent = "Not read yet")
    : (this.textContent = "Read");
}
addBtn.addEventListener("click", getInput);
saveBtn.addEventListener("click", endInput);
cancelBtn.addEventListener("click", closeInput);
