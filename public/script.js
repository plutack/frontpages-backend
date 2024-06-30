document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/today")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("newspapers-container");
      data.newspapers.forEach((newspaper) => {
        const newspaperDiv = document.createElement("div");
        newspaperDiv.className = "newspaper";

        const img = document.createElement("img");
        img.src = newspaper.link;
        img.alt = newspaper.name;

        const nameDiv = document.createElement("div");
        nameDiv.className = "name";
        nameDiv.textContent = newspaper.name;

        newspaperDiv.appendChild(img);
        newspaperDiv.appendChild(nameDiv);
        container.appendChild(newspaperDiv);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});
