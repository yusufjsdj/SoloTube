let currentUser = null;

function register() {
  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
    .then(r => r.json())
    .then(d => alert(d.success ? "Kayıt başarıyla oluşturuldu" : d.error));
}

function login() {
  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
    .then(r => r.json())
    .then(d => {
      if (!d.success) return alert(d.error);

      currentUser = d.user;

      loginBox.style.display = "none";
      player.style.display = "block";

      if (d.user.isAdmin === 1) adminPanel.style.display = "block";

      loadMusic();
    });
}

function loadMusic() {
  fetch("/music")
    .then(r => r.json())
    .then(list => {
      musicList.innerHTML = "";
      list.forEach(m => {
        const div = document.createElement("div");
        div.innerHTML = `<button onclick="play('${m.file}')">${m.title}</button>`;
        musicList.appendChild(div);
      });
    });
}

function play(file) {
  audio.src = `/uploads/${file}`;
  audio.play();
}

function uploadMusic() {
  const fd = new FormData();
  fd.append("title", musicTitle.value);
  fd.append("music", musicFile.files[0]);

  fetch("/upload", {
    method: "POST",
    body: fd
  })
    .then(r => r.json())
    .then(() => {
      alert("Yüklendi!");
      loadMusic();
    });
}
