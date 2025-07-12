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

const auth = localStorage.getItem("auth");
if (auth) {
  const parsed_user = JSON.parse(auth);
  if (parsed_user.role === "mahasiswa") window.location.href = "../../mahasiswa/dashboard.html";
  else window.location.href = "../../dosen/dashboard.html";
} else {
  window.location.href = "../../login.html";
}
