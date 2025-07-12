$(document).ready(function () {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  if (localStorage.getItem("auth")) {
    const parsed_user = JSON.parse(auth);
    if (parsed_user.role === "mahasiswa") {
      if (window.location.pathname != "/mahasiswa/dashboard.html") window.location.href = "../../mahasiswa/dashboard.html";
    } else {
      if (window.location.pathname != "/dosen/dashboard.html") window.location.href = "../../dosen/dashboard.html";
    }
  }

  $("#btn-login").on("click", function (e) {
    e.preventDefault();
    const data_user = JSON.parse(localStorage.getItem("data_user"));
    const result = data_user.find((item) => item.username === $("#username").val());
    if (!result) {
      Toast.fire({
        icon: "error",
        title: `Username atau Password salah`,
      });
      return;
    }
    if (result.password === $("#password").val()) {
      Toast.fire({
        icon: "success",
        title: `Berhasil Login Sebagai ${result.role}`,
      });
      localStorage.setItem("auth", JSON.stringify(result));
      if (result.role === "dosen")
        setTimeout(() => {
          window.location.href = "../../dosen/dashboard.html";
        }, 1000);
      else {
        setTimeout(() => {
          window.location.href = "../../mahasiswa/dashboard.html";
        }, 1000);
      }
    } else {
      Toast.fire({
        icon: "error",
        title: `Username atau Password salah`,
      });
      return;
    }
  });
});
