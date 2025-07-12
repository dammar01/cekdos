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
    const data_table = [];
    $("#jadwal-saya-dosen").DataTable({
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
  }
});
