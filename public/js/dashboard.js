async function loadDashboard() {

  const res = await fetch("/api/dashboard");

  if (res.status === 401) {
    window.location.href = "/login.html";
    return;
  }

  const data = await res.json();

  document.getElementById("totalNumbers").innerText =
    data.stats.totalNumbers;
}

loadDashboard();
