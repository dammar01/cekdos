if (!localStorage.getItem("data_user")) {
  const data_user = [
    {
      nama: "Dammar Syaputra",
      username: "3202316085",
      password: "asda",
      role: "mahasiswa",
    },
    {
      nama: "Haikal Bagas Putra",
      username: "3202316104",
      password: "asda",
      role: "mahasiswa",
    },
    {
      nama: "Suharsono",
      username: "0001",
      password: "asda",
      role: "dosen",
    },
    {
      nama: "Satriyo",
      username: "0002",
      password: "asda",
      role: "dosen",
    },
  ];
  localStorage.setItem("data_user", JSON.stringify(data_user));
}

if (localStorage.getItem("auth")) {
  const parsed_user = JSON.parse(localStorage.getItem("auth"));
  if (parsed_user.role === "mahasiswa") {
    if (window.location.pathname != "/mahasiswa/dashboard.html") window.location.href = "../../mahasiswa/dashboard.html";
  } else {
    if (window.location.pathname != "/dosen/dashboard.html") window.location.href = "../../dosen/dashboard.html";
  }
} else {
  if (window.location.pathname != "/login.html") window.location.href = "../../login.html";
}
