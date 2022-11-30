const scrollLine = document.getElementById("scroll-line");
const scrollText = document.querySelector("#scroll-line span");
const ul = document.getElementById("my-ul");
let arrayOfLi; // after recieving xhr response, we should assigne all li of users in an array by arrayUpdater function

scrollLine.style.width = "0%";

//---------------- update arrayOfLi a change happen in list of users -----------
function arrayUpdater() {
  arrayOfLi = Array.from(document.querySelector("#my-ul").children);
}

//------------ a horizontal line at top of page to show scrolled percentage -----------
window.addEventListener("scroll", function () {
  const windowHeight = window.innerHeight;
  const fullHeight = document.body.clientHeight;
  const scrolled = window.scrollY;
  percentScrolled = (scrolled / (fullHeight - windowHeight)) * 100;

  scrollLine.style.width = percentScrolled + "%";
  if (percentScrolled.toFixed(0) >= 5) {
    scrollText.style.visibility = "visible";
    scrollText.innerText = percentScrolled.toFixed(0) + " %";
  } else {
    scrollText.style.visibility = "hidden";
  }
});

//------------ change mouse icon when drag and drop happed -----------------------
ul.addEventListener("dragover", (event) => {
  event.preventDefault();
});

//------------ loading list of users with a smooth fading animation ------------------
function loadingAnimation() {
  const items = document.getElementsByClassName("fade-item");

  for (let i = 0; i < items.length; ++i) {
    setTimeout(() => {
      items[i].classList.add("fadein");
    }, i * 1000);
  }
}

//--------------- drag and drop listener -----------------------
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

//-------------------- loading user by AJAX request ---------------------
function loadUsers() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "https://api.github.com/users");

  xhr.onload = function () {
    if (xhr.status == 200) {
      const ul = document.getElementById("my-ul");
      const users = JSON.parse(xhr.responseText);

      for (const user of users) {
        const li = document.createElement("li");
        li.classList.add("card", "fade-item");
        li.setAttribute("draggable", "true");
        li.innerHTML = `
          <div>
            <img src="${user.avatar_url}" draggable="false">
              <section>
                <h3>Name: ${user.login}</h3>
                <a href="${user.html_url}" target="_blank" draggable="false">Visit profile on Github!</a>
                <span>Followers: ${Math.ceil(Math.random() * user.login.length)}K</span>
              </section>
              <article><b>About user:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</article>
            </div>
          `;

        const deleterSpan = document.createElement("span");
        deleterSpan.setAttribute("title", "Delete user!");
        deleterSpan.setAttribute("class", "delete-icon");
        deleterSpan.innerText = "X";
        deleterSpan.addEventListener("click", () => {
          if (confirm(`Are you sure you want to delete "${user.login}" from list??`)) {
            arrayUpdater(); // before delete items from list we should update our list of users then loop on updated array
            for (const eachLi of arrayOfLi) {
              if (eachLi.querySelector("h3").innerText === `Name: ${user.login}`) {
                arrayOfLi[arrayOfLi.indexOf(eachLi)].style.display = "none";
              }
            }
          }
        });
        li.appendChild(deleterSpan);

        li.addEventListener("dragstart", () => {
          li.classList.add("dragging");
        });

        li.addEventListener("dragend", () => {
          li.classList.remove("dragging");
        });

        ul.append(li);

        loadingAnimation();
      }
      arrayUpdater();
    }
  };

  xhr.send();
}

loadUsers();
