const ul = document.getElementById("my-ul");

ul.addEventListener("dragover", (event) => {
  event.preventDefault();
});

ul.addEventListener("dragenter", (e) => {
  if (e.target.classList.contains("card") && !e.target.classList.contains("dragging")) {
    const draggingCard = document.querySelector(".dragging");
    const cards = [...ul.querySelectorAll("li")];
    const currentPosition = cards.indexOf(draggingCard);
    const newPosition = cards.indexOf(e.target);

    if (currentPosition > newPosition) {
      ul.insertBefore(draggingCard, e.target);
    } else {
      ul.insertBefore(draggingCard, e.target.nextSibling);
    }
  }
});

function loadUsers() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "https://api.github.com/users");

  xhr.onload = function () {
    if (xhr.status == 200) {
      const ul = document.getElementById("my-ul");
      const users = JSON.parse(xhr.responseText);

      for (const user of users) {
        const li = document.createElement("li");
        li.classList.add("card");
        li.setAttribute("draggable", "true");
        li.innerHTML = `
          <div>
            <img src="${user.avatar_url}" draggable="false">
              <section>
                <h3>User name: ${user.login}</h3>
                <a href="${user.html_url}" target="_blank">Visit profile on Github!</a>
                <span>Followers: ${Math.ceil(Math.random() * user.login.length)}K</span>
              </section>
            </div>
          `;

        li.addEventListener("dragstart", () => {
          li.classList.add("dragging");
        });

        li.addEventListener("dragend", () => {
          li.classList.remove("dragging");
        });

        ul.append(li);
      }
    }
  };

  xhr.send();
}

loadUsers();
