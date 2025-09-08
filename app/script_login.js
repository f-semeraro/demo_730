document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  fetch("config/config.json")
    .then(response => {
      if (!response.ok) throw new Error("Impossibile caricare config.json");
      return response.json();
    })
    .then(config => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const inputPassword = form.password.value;
        const correctPassword = config.password_login;
		
		const inputUser = form.username.value;
        const correctUser = config.user_login;
		
		
		if (inputUser === correctUser) {
			if (inputPassword === correctPassword) {
				console.log("Accès autorisé");
				window.location.href = "index.html";
			} else {
				alert("Identifiants incorrects");
			}
		}else {
			
			alert("Identifiants incorrects");
        }
      });
    })
    .catch(err => {
      console.error("Erreur lors du chargement de la configuration :", err);
    });
});
