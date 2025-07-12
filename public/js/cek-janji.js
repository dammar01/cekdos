$(document).ready(function () {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const dataUser = JSON.parse(localStorage.getItem("data_user"));

  const data_dosen_buat_janji = [
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
    [
      "3202316104",
      "Haikal Bagas Putra",
      '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>',
    ],
  ];
  $("#dosen-buat-janji").DataTable({
    data: data_dosen_buat_janji,
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

  const mahasiswaBimbingan = dataUser.filter((user) => user.role === "mahasiswa" && user.nip_dospem === auth.nip_dospem);
  const data_mahasiswa_buat_janji = [];
  mahasiswaBimbingan.forEach((mhs) => {
    const nim = mhs.username;
    const nama = mhs.nama;

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
  });

  $("#mahasiswa-buat-janji").DataTable({
    data: data_mahasiswa_buat_janji,
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
    const userIndex = dataUser.findIndex((user) => user.username === auth.username);
    const alreadyExists = dataUser[userIndex].data.jadwal_saya.some(([tanggal]) => tanggal === tanggalJanji);
    if (alreadyExists) {
      Toast.fire({
        icon: "error",
        title: `Tanggal Janji Tersebut Telah Terdaftar`,
      });
      return;
    }
    if (userIndex !== -1) {
      dataUser[userIndex].data.jadwal_saya.push([tanggalJanji, 0]);
      auth.data.jadwal_saya.push([tanggalJanji, 0]);
      localStorage.setItem("data_user", JSON.stringify(dataUser));
      localStorage.setItem("auth", JSON.stringify(auth));
      Toast.fire({
        icon: "success",
        title: "Tanggal janji " + tanggalJanji + " Berhasil disimpan",
      });
      $("#tanggal-janji").val("");
      $("#exampleModal").modal("hide");
    } else {
      alert("User tidak ditemukan di data_user.");
    }
  });
});
