$(document).ready(function () {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const dataUser = JSON.parse(localStorage.getItem("data_user"));

  // Fungsi untuk membangun data mahasiswa
  function buildMahasiswaData() {
    const mahasiswaBimbingan = dataUser.filter((user) => user.role === "mahasiswa" && user.nip_dospem === auth.nip_dospem);
    const data_mahasiswa_buat_janji = [];

    mahasiswaBimbingan.forEach((mhs) => {
      const nim = mhs.username;
      const nama = mhs.nama;

      // Pastikan data.jadwal_saya ada dan berupa array
      if (mhs.data && mhs.data.jadwal_saya && Array.isArray(mhs.data.jadwal_saya)) {
        mhs.data.jadwal_saya.forEach(([tanggalStr, statusCode]) => {
          const statusHTML =
            statusCode === 0
              ? "<span class='stat-pending'>Pending</span>"
              : statusCode === 1
              ? "<span class='stat-disetujui'>Disetujui</span>"
              : statusCode === 2
              ? "<span class='stat-selesai'>Selesai</span>"
              : "<span class='stat-ditolak'>Ditolak</span>";

          data_mahasiswa_buat_janji.push([nim, nama, tanggalStr, statusHTML]);
        });
      }
    });

    return data_mahasiswa_buat_janji;
  }

  // Inisialisasi data mahasiswa
  const data_mahasiswa_buat_janji = buildMahasiswaData();

  // Inisialisasi DataTable mahasiswa
  const table_mahasiswa = $("#mahasiswa-buat-janji").DataTable({
    data: data_mahasiswa_buat_janji,
    columns: [
      { title: "NIM", data: 0 },
      { title: "Nama", data: 1 },
      { title: "Tanggal", data: 2 },
      { title: "Status", data: 3 },
    ],
    columnDefs: [
      {
        targets: 2,
        render: function (data) {
          const date = new Date(data);
          return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
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

  // Event handler untuk save janji
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

    if (!tanggalJanji) {
      Toast.fire({
        icon: "error",
        title: `Harap Pilih Tanggal Terlebih Dahulu`,
      });
      return;
    }

    // Cari user berdasarkan username
    const userIndex = dataUser.findIndex((user) => user.username === auth.username);

    if (userIndex === -1) {
      Toast.fire({
        icon: "error",
        title: "User tidak ditemukan di data_user.",
      });
      return;
    }

    // Pastikan struktur data ada
    if (!dataUser[userIndex].data) {
      dataUser[userIndex].data = {};
    }
    if (!dataUser[userIndex].data.jadwal_saya) {
      dataUser[userIndex].data.jadwal_saya = [];
    }
    if (!auth.data) {
      auth.data = {};
    }
    if (!auth.data.jadwal_saya) {
      auth.data.jadwal_saya = [];
    }

    // Cek apakah tanggal sudah ada
    const alreadyExists = dataUser[userIndex].data.jadwal_saya.some(([tanggal]) => tanggal === tanggalJanji);
    if (alreadyExists) {
      Toast.fire({
        icon: "error",
        title: `Tanggal Janji Tersebut Telah Terdaftar`,
      });
      return;
    }

    // Tambahkan data baru
    dataUser[userIndex].data.jadwal_saya.push([tanggalJanji, 0]);
    auth.data.jadwal_saya.push([tanggalJanji, 0]);

    // Update localStorage
    localStorage.setItem("data_user", JSON.stringify(dataUser));
    localStorage.setItem("auth", JSON.stringify(auth));

    // Tambahkan baris baru ke tabel
    const newRowData = [
      auth.username, // NIM
      auth.nama, // Nama
      tanggalJanji, // Tanggal
      "<span class='stat-pending'>Pending</span>", // Status
    ];

    table_mahasiswa.row.add(newRowData).draw();

    // Tampilkan pesan sukses
    Toast.fire({
      icon: "success",
      title: "Tanggal janji " + tanggalJanji + " Berhasil disimpan",
    });

    // Reset form
    $("#tanggal-janji").val("");
    $("#exampleModal").modal("hide");
  });
});
