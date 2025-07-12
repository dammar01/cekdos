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
  if (auth) {
    const parsed_user = JSON.parse(auth);
    if (parsed_user.role === "mahasiswa") {
      window.location.href = "../../mahasiswa/dashboard.html";
    } else {
      window.location.href = "../../dosen/dashboard.html";
    }
  }

  $("#btn-register").on("click", function (e) {
    e.preventDefault();
    
    // Ambil data dari form
    const nama = $("#name").val().trim();
    const username = $("#username").val().trim();
    const dosenPembimbing = $("#dosen-pembimbing").val().trim();
    const password = $("#password").val();
    const confirmPassword = $("#confirm_password").val();

    // Validasi form
    if (!nama || !username || !dosenPembimbing || !password || !confirmPassword) {
      Toast.fire({
        icon: "error",
        title: "Semua field harus diisi!",
      });
      return;
    }

    // Validasi password
    if (password !== confirmPassword) {
      Toast.fire({
        icon: "error",
        title: "Password dan Konfirmasi Password tidak cocok!",
      });
      return;
    }

    // Validasi panjang password
    if (password.length < 4) {
      Toast.fire({
        icon: "error",
        title: "Password minimal 4 karakter!",
      });
      return;
    }

    // Ambil data user dari localStorage
    const data_user = JSON.parse(localStorage.getItem("data_user"));
    
    // Cek apakah username sudah ada
    const existingUser = data_user.find((item) => item.username === username);
    if (existingUser) {
      Toast.fire({
        icon: "error",
        title: "Username sudah terdaftar!",
      });
      return;
    }

    // Cek apakah dosen pembimbing ada (berdasarkan username dosen)
    const dosenExists = data_user.find((item) => item.role === "dosen" && item.username === dosenPembimbing);
    if (!dosenExists) {
      Toast.fire({
        icon: "error",
        title: "Dosen pembimbing tidak ditemukan!",
      });
      return;
    }

    // Buat user baru
    const newUser = {
      nama: nama,
      username: username,
      nip_dospem: dosenPembimbing,
      password: password,
      role: "mahasiswa",
      data: {
        jadwal_saya: [],
      },
    };

    // Tambahkan user baru ke data_user
    data_user.push(newUser);

    // Update data dosen pembimbing (tambahkan NIM mahasiswa baru)
    const dosenIndex = data_user.findIndex((item) => item.username === dosenPembimbing && item.role === "dosen");
    if (dosenIndex !== -1) {
      if (!data_user[dosenIndex].nim_mahasiswa) {
        data_user[dosenIndex].nim_mahasiswa = [];
      }
      data_user[dosenIndex].nim_mahasiswa.push(username);
    }

    // Simpan data yang sudah diupdate ke localStorage
    localStorage.setItem("data_user", JSON.stringify(data_user));

    // Tampilkan pesan sukses
    Toast.fire({
      icon: "success",
      title: "Registrasi berhasil! Silakan login.",
    });

    // Reset form
    $("#registerForm")[0].reset();

    // Redirect ke halaman login setelah 2 detik
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  });

  // Validasi real-time untuk konfirmasi password
  $("#confirm_password").on("input", function () {
    const password = $("#password").val();
    const confirmPassword = $(this).val();
    
    if (confirmPassword && password !== confirmPassword) {
      $(this).addClass("border-red-500");
      $(this).removeClass("border-gray-600");
    } else {
      $(this).removeClass("border-red-500");
      $(this).addClass("border-gray-600");
    }
  });

  // Validasi real-time untuk username (cek ketersediaan)
  $("#username").on("blur", function () {
    const username = $(this).val().trim();
    if (username) {
      const data_user = JSON.parse(localStorage.getItem("data_user"));
      const existingUser = data_user.find((item) => item.username === username);
      
      if (existingUser) {
        $(this).addClass("border-red-500");
        $(this).removeClass("border-gray-600");
        Toast.fire({
          icon: "warning",
          title: "Username sudah terdaftar!",
        });
      } else {
        $(this).removeClass("border-red-500");
        $(this).addClass("border-gray-600");
      }
    }
  });

  // Validasi real-time untuk dosen pembimbing
  $("#dosen-pembimbing").on("blur", function () {
    const dosenPembimbing = $(this).val().trim();
    if (dosenPembimbing) {
      const data_user = JSON.parse(localStorage.getItem("data_user"));
      const dosenExists = data_user.find((item) => item.role === "dosen" && item.username === dosenPembimbing);
      
      if (!dosenExists) {
        $(this).addClass("border-red-500");
        $(this).removeClass("border-gray-600");
        Toast.fire({
          icon: "warning",
          title: "Dosen pembimbing tidak ditemukan!",
        });
      } else {
        $(this).removeClass("border-red-500");
        $(this).addClass("border-gray-600");
      }
    }
  });
});