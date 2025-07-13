$(document).ready(function () {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const all_data = JSON.parse(localStorage.getItem("data_user"));
  const data_mahasiswa = auth.nim_mahasiswa;
  const data_table = [];

  data_mahasiswa.map((nim) => {
    const mahasiswa = all_data.filter((user) => user.username === nim)[0];
    data_table.push([mahasiswa.username, mahasiswa.nama, ""]);
  });
  $("#dosen-buat-janji").DataTable({
    data: data_table,
    columnDefs: [
      {
        targets: 2,
        render: function (data, type, row) {
          return `<button class='button-aksi buat-jadwal' data-username='${row[0]}' data-nama='${row[1]}'>Buat Jadwal</button>`;
        },
      },
    ],
    dom:
      "<'row align-items-center'" +
      "<'col-auto'<'row d-flex flex-row align-items-center justify-content-start' <'col-auto showdata 'l><'col-auto mb-0'B>>>" +
      "<'col d-flex align-items-center justify-content-end searchdata mb-2'f>" +
      ">" +
      "<'table-responsive mb-2'tr>" +
      "<'row justify-content-between'" +
      "<'col-md-6 ps-2'i>" +
      "<'col-md-6 pe-2'p>" +
      ">",
    language: {
      lengthMenu: "_MENU_",
      processing: `
                <div class="container-spinner">
                    <div class="spinner"></div>
                    <p class="pt-3">Loading ...</p>
                </div>`,
      zeroRecords: `
                <p style="font-size: 15px; font-weight: 500; margin-top:10px; margin-bottom: 5%;">Data Belum Tersedia</p>`,
      search: "",
      searchPlaceholder: "Search",
    },
    destroy: true,
    responsive: true,
    pageLength: 10,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "All"],
    ],
  });

  $(".buat-jadwal").on("click", function () {
    const rawUsername = $(this).data("username");
    const username = typeof rawUsername === "string" ? rawUsername : rawUsername?.toString();

    const rawNama = $(this).data("username");
    const nama = typeof rawNama === "string" ? rawNama : rawNama?.toString();
    $("#exampleModalLabel").text("Buat Jadwal Dengan " + nama);
    $("#exampleModal").modal("show");
    $("#save-janji").data("target-username", username);
  });

  $("#save-janji").on("click", function () {
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

    const tanggalJanji = $("#tanggal-janji").val();
    const targetUsername = $(this).data("target-username");

    if (!tanggalJanji) {
      Toast.fire({
        icon: "error",
        title: `Harap Pilih Tanggal Terlebih Dahulu`,
      });
      return;
    }
    const auth = JSON.parse(localStorage.getItem("auth"));
    const dataUser = JSON.parse(localStorage.getItem("data_user"));

    if (targetUsername === "semua") {
      const data_mahasiswa = auth.nim_mahasiswa;
      let successCount = 0;
      let alreadyExistsCount = 0;

      data_mahasiswa.forEach((nim) => {
        const userIndex = dataUser.findIndex((user) => user.username === nim);

        if (userIndex !== -1) {
          if (!dataUser[userIndex].data) {
            dataUser[userIndex].data = {};
          }
          if (!dataUser[userIndex].data.jadwal_saya) {
            dataUser[userIndex].data.jadwal_saya = [];
          }
          const alreadyExists = dataUser[userIndex].data.jadwal_saya.some(([tanggal]) => tanggal === tanggalJanji);

          if (!alreadyExists) {
            dataUser[userIndex].data.jadwal_saya.push([tanggalJanji, 1]);
            successCount++;
          } else {
            alreadyExistsCount++;
          }
        }
      });
      localStorage.setItem("data_user", JSON.stringify(dataUser));

      if (successCount > 0) {
        Toast.fire({
          icon: "success",
          title: `Jadwal berhasil ditambahkan untuk ${successCount} mahasiswa`,
        });
      }

      if (alreadyExistsCount > 0) {
        Toast.fire({
          icon: "warning",
          title: `${alreadyExistsCount} mahasiswa sudah memiliki jadwal pada tanggal tersebut`,
        });
      }
    } else {
      const userIndex = dataUser.findIndex((user) => user.username === targetUsername);

      if (userIndex === -1) {
        Toast.fire({
          icon: "error",
          title: "User tidak ditemukan di data_user.",
        });
        return;
      }

      if (!dataUser[userIndex].data) {
        dataUser[userIndex].data = {};
      }
      if (!dataUser[userIndex].data.jadwal_saya) {
        dataUser[userIndex].data.jadwal_saya = [];
      }

      const alreadyExists = dataUser[userIndex].data.jadwal_saya.some(([tanggal]) => tanggal === tanggalJanji);
      if (alreadyExists) {
        Toast.fire({
          icon: "error",
          title: `Tanggal Janji Tersebut Telah Terdaftar`,
        });
        return;
      }

      dataUser[userIndex].data.jadwal_saya.push([tanggalJanji, 1]);
      localStorage.setItem("data_user", JSON.stringify(dataUser));
      Toast.fire({
        icon: "success",
        title: "Tanggal janji " + tanggalJanji + " Berhasil disimpan untuk " + dataUser[userIndex].nama,
      });
    }
    $("#tanggal-janji").val("");
    $("#exampleModal").modal("hide");
  });
});
