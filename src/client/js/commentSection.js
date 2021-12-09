const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const delBtn = document.querySelectorAll(".video__delete-comment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const button = document.createElement("button");
  button.innerText = "❌";
  button.addEventListener("click", handleDelete);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(button);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const res = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (res.status === 201) {
    textarea.value = "";
    const { newCommentId } = await res.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  const parent = event.target.parentElement;
  const commentId = parent.dataset.id;
  const res = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  if (res.status === 200) {
    parent.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
for (let i = 0; i < delBtn.length; i++) {
  delBtn[i].addEventListener("click", handleDelete);
}
