$(document).ready(function () {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth.role === "mahasiswa") {
    const data_table = auth.data.jadwal_saya;
    $("#jadwal-saya-mahasiswa").DataTable({
      data: data_table,
      columnDefs: [
        {
          targets: 0,
          render: function (data) {
            const date = new Date(data);
            return date.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          },
        },
        {
          targets: 1,
          render: function (data) {
            if (data == 0) {
              return "<span class='stat-pending'>Pending</span>";
            } else if (data == 1) {
              return "<span class='stat-disetujui'>Disetujui</span>";
            } else if (data == 2) {
              return "<span class='stat-selesai'>Selesai</span>";
            } else {
              return "<span class='stat-ditolak'>Ditolak</span>";
            }
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
  } else {
    const all_data = JSON.parse(localStorage.getItem("data_user"));
    const data_mahasiswa = auth.nim_mahasiswa;
    const data_table = [];

    data_mahasiswa.map((nim) => {
      const mahasiswa = all_data.filter((user) => user.username === nim)[0];
      if (mahasiswa && mahasiswa.data.jadwal_saya) {
        mahasiswa.data.jadwal_saya.map((jadwal_user, index) => {
          data_table.push([
            mahasiswa.username,
            mahasiswa.nama,
            jadwal_user[0],
            jadwal_user[1],
            index, // index untuk tracking jadwal
          ]);
        });
      }
    });

    const table = $("#jadwal-saya-dosen").DataTable({
      data: data_table,
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
      columns: [
        { title: "NIM" },
        { title: "Nama Mahasiswa" },
        { title: "Tanggal" },
        { title: "Status" },
        { title: "Index", visible: false },
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
        {
          targets: 3,
          render: function (data, type, row) {
            const nim = row[0];
            const jadwalIndex = row[4];

            if (data == 0) {
              return `<span class='stat-pending stat-action' data-nim='${nim}' data-index='${jadwalIndex}'>Konfirmasi</span>`;
            } else if (data == 1) {
              return "<span class='stat-disetujui'>Disetujui</span>";
            } else if (data == 2) {
              return "<span class='stat-selesai'>Selesai</span>";
            } else if (data == -1) {
              return "<span class='stat-ditolak'>Ditolak</span>";
            } else {
              return "<span class='stat-unknown'>Status Tidak Diketahui</span>";
            }
          },
        },
      ],
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

    $(document).on("click", ".stat-action", function () {
      const nim = $(this).data("nim").toString();
      const jadwalIndex = $(this).data("index");
      const clickedElement = $(this);

      const mahasiswa = all_data.find((user) => user.username === nim);
      const jadwalData = mahasiswa.data.jadwal_saya[jadwalIndex];
      const tanggalJadwal = new Date(jadwalData[0]).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "button-aksi mx-1",
          denyButton: "button-tolak mx-1",
          cancelButton: "button-tutup mx-1",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Konfirmasi Jadwal?",
          icon: "question",
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: "Terima",
          denyButtonText: "Tolak",
          cancelButtonText: "Tutup",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            konfirmasiJadwal(nim, jadwalIndex, clickedElement);
          } else if (result.isDenied) {
            tolakJadwal(nim, jadwalIndex, clickedElement);
          }
        });
    });

    function konfirmasiJadwal(nim, jadwalIndex, element) {
      try {
        const all_data = JSON.parse(localStorage.getItem("data_user"));
        const mahasiswaIndex = all_data.findIndex((user) => user.username === nim && user.role === "mahasiswa");
        if (mahasiswaIndex !== -1) {
          all_data[mahasiswaIndex].data.jadwal_saya[jadwalIndex][1] = 1;
          localStorage.setItem("data_user", JSON.stringify(all_data));
          element
            .removeClass("stat-pending stat-action")
            .addClass("stat-disetujui")
            .text("Disetujui")
            .removeAttr("data-nim")
            .removeAttr("data-index");

          Swal.fire({
            title: "Berhasil!",
            text: "Jadwal berhasil dikonfirmasi",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          console.log(`Jadwal mahasiswa ${nim} pada index ${jadwalIndex} berhasil dikonfirmasi`);
        } else {
          throw new Error("Mahasiswa tidak ditemukan");
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat mengkonfirmasi jadwal",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    function tolakJadwal(nim, jadwalIndex, element) {
      try {
        const all_data = JSON.parse(localStorage.getItem("data_user"));
        const mahasiswaIndex = all_data.findIndex((user) => user.username === nim && user.role === "mahasiswa");

        if (mahasiswaIndex !== -1) {
          all_data[mahasiswaIndex].data.jadwal_saya[jadwalIndex][1] = -1;
          localStorage.setItem("data_user", JSON.stringify(all_data));
          element
            .removeClass("stat-pending stat-action")
            .addClass("stat-ditolak")
            .text("Ditolak")
            .removeAttr("data-nim")
            .removeAttr("data-index");

          Swal.fire({
            title: "Berhasil!",
            text: "Jadwal berhasil ditolak",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error saat menolak jadwal:", error);
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat menolak jadwal",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    function refreshDataTable() {
      const all_data = JSON.parse(localStorage.getItem("data_user"));
      const data_mahasiswa = auth.nim_mahasiswa;
      const new_data_table = [];

      data_mahasiswa.map((nim) => {
        const mahasiswa = all_data.filter((user) => user.username === nim)[0];
        if (mahasiswa && mahasiswa.data.jadwal_saya) {
          mahasiswa.data.jadwal_saya.map((jadwal_user, index) => {
            new_data_table.push([mahasiswa.username, mahasiswa.nama, jadwal_user[0], jadwal_user[1], index]);
          });
        }
      });

      table.clear().rows.add(new_data_table).draw();
    }
  }
});
