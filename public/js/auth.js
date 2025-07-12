if (!localStorage.getItem("data_user")) {
  const data_user = [
    {
      nama: "Dammar Syaputra",
      username: "3202316085",
      nip_dospem: "0001",
      password: "asda",
      role: "mahasiswa",
      data: {
        jadwal_saya: [
          ["2025-07-12", 1],
          ["2025-08-05", 0],
          ["2025-07-11", 2],
          ["2025-07-11", -1],
        ],
      },
    },
    {
      nama: "Adzan Fadhel",
      username: "3202316563",
      nip_dospem: "0001",
      password: "asda",
      role: "mahasiswa",
      data: {
        jadwal_saya: [
          ["2025-07-03", 1],
          ["2025-10-05", 0],
          ["2025-07-29", 2],
          ["2025-02-11", -1],
        ],
      },
    },
    {
      nama: "Haikal Bagas Putra",
      username: "3202316104",
      nip_dospem: "0002",
      password: "asda",
      role: "mahasiswa",
      data: {
        jadwal_saya: [],
      },
    },
    {
      nama: "Suharsono",
      username: "0001",
      password: "asda",
      nim_mahasiswa: ["3202316085"],
      role: "dosen",
      data: {
        jadwal_saya: [],
      },
    },
    {
      nama: "Satriyo",
      username: "0002",
      password: "asda",
      nim_mahasiswa: ["3202316104"],
      role: "dosen",
      data: {
        jadwal_saya: [],
      },
    },
  ];
  localStorage.setItem("data_user", JSON.stringify(data_user));
}

const auth = localStorage.getItem("auth");
if (auth) {
  const parsed_user = JSON.parse(auth);
  const path = window.location.pathname;

  if (parsed_user.role === "mahasiswa") {
    if (!path.startsWith("/mahasiswa/")) {
      window.location.href = "/mahasiswa/dashboard.html";
    }
  } else if (parsed_user.role === "dosen") {
    if (!path.startsWith("/dosen/")) {
      window.location.href = "/dosen/dashboard.html";
    }
  }
} else {
  const path = window.location.pathname;
  if (!path.startsWith("/login") && !path.startsWith("/register")) {
    window.location.href = "/login.html";
  }
}

$(document).ready(function () {
  if (auth) {
    const parsed_user = JSON.parse(auth);
    $("#navbar-username").html(parsed_user.nama);
    $("#logout").on("click", function (e) {
      e.stopPropagation();
      $("#logout-dropdown").toggleClass("d-none");
    });
  }

  $("#logout-dropdown").on("click", function () {
    localStorage.removeItem("auth");
    window.location.href = "/login.html";
  });
  $(document).on("click", function () {
    $("#logout-dropdown").addClass("d-none");
  });
});
