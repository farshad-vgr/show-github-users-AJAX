function loadUsers() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "https://api.github.com/users");

  xhr.onload = function () {
    if (xhr.status == 200) {
      const ul = document.getElementById("my-ul");
      const users = JSON.parse(xhr.responseText);

      for (const user of users) {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${user.avatar_url}">
                <section>
                    <h3>User name: ${user.login}</h3>
                    <a href="${
                      user.html_url
                    }" target="_blank">Visit profile on Github!</a>
                    <span>Followers: ${Math.ceil(
                      Math.random() * user.login.length
                    )}K</span>
                </section>
          `;

        ul.append(li);
      }
    }
  };

  xhr.send();
}

loadUsers();
