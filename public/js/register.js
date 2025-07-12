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

  // Redirect jika sudah login
  const auth = localStorage.getItem("auth");
  if (auth) {
    const parsed_user = JSON.parse(auth);
    if (parsed_user.role === "mahasiswa") {
      window.location.href = "../../mahasiswa/dashboard.html";
    } else if (parsed_user.role === "dosen") {
      window.location.href = "../../dosen/dashboard.html";
    }
  }

  // Fungsi untuk validasi NIM/NIP
  function validateUsername(username) {
    // NIM mahasiswa biasanya 10 digit, NIP dosen biasanya 4 digit (berdasarkan data sample)
    if (username.length === 10 && /^\d+$/.test(username)) {
      return "mahasiswa";
    } else if (username.length === 4 && /^\d+$/.test(username)) {
      return "dosen";
    }
    return null;
  }

  // Fungsi untuk mengecek apakah username sudah ada
  function isUsernameExists(username) {
    const data_user = JSON.parse(localStorage.getItem("data_user") || "[]");
    return data_user.some(user => user.username === username);
  }

  // Event handler untuk form registrasi
  $("#btn-register").on("click", function (e) {
    e.preventDefault();
    
    const nama = $("#name").val().trim();
    const username = $("#username").val().trim();
    const dosenPembimbing = $("#dosen-pembimbing").val().trim();
    const password = $("#password").val();
    const confirmPassword = $("#confirm_password").val();

    // Validasi input kosong
    if (!nama || !username || !password || !confirmPassword) {
      Toast.fire({
        icon: "error",
        title: "Semua field wajib diisi",
      });
      return;
    }

    // Validasi password confirmation
    if (password !== confirmPassword) {
      Toast.fire({
        icon: "error",
        title: "Password dan konfirmasi password tidak cocok",
      });
      return;
    }

    // Validasi panjang password
    if (password.length < 4) {
      Toast.fire({
        icon: "error",
        title: "Password minimal 4 karakter",
      });
      return;
    }

    // Validasi format username (NIM/NIP)
    const role = validateUsername(username);
    if (!role) {
      Toast.fire({
        icon: "error",
        title: "Format username tidak valid. Gunakan NIM (10 digit) atau NIP (4 digit)",
      });
      return;
    }

    // Validasi dosen pembimbing hanya untuk mahasiswa
    if (role === "mahasiswa" && !dosenPembimbing) {
      Toast.fire({
        icon: "error",
        title: "Dosen pembimbing wajib diisi untuk mahasiswa",
      });
      return;
    }

    // Cek apakah username sudah terdaftar
    if (isUsernameExists(username)) {
      Toast.fire({
        icon: "error",
        title: "Username sudah terdaftar",
      });
      return;
    }

    // Buat objek user baru
    const newUser = {
      nama: nama,
      username: username,
      password: password,
      role: role,
      data: {
        jadwal_saya: [],
      },
    };

    // Tambahkan dosen pembimbing jika role adalah mahasiswa
    if (role === "mahasiswa") {
      newUser.data.dosen_pembimbing = dosenPembimbing;
    }

    // Ambil data user yang sudah ada
    const data_user = JSON.parse(localStorage.getItem("data_user") || "[]");
    
    // Tambahkan user baru
    data_user.push(newUser);
    
    // Simpan kembali ke localStorage
    localStorage.setItem("data_user", JSON.stringify(data_user));

    // Tampilkan pesan sukses
    Toast.fire({
      icon: "success",
      title: `Berhasil mendaftar sebagai ${role}`,
    });

    // Auto login setelah registrasi
    localStorage.setItem("auth", JSON.stringify(newUser));

    // Redirect ke dashboard sesuai role
    setTimeout(() => {
      if (role === "mahasiswa") {
        window.location.href = "../../mahasiswa/dashboard.html";
      } else if (role === "dosen") {
        window.location.href = "../../dosen/dashboard.html";
      }
    }, 1000);
  });

  // Event handler untuk tombol Enter
  $("#registerForm").on("keypress", function (e) {
    if (e.which === 13) {
      $("#btn-register").click();
    }
  });
});