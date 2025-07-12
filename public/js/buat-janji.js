$(document).ready(function () {
  const data_buat_janji = [["3202316104", "Haikal Bagas Putra", '<button class="button-aksi" data-bs-toggle="modal" data-bs-target="#exampleModal">Buat Janji</button>']];
  $("#buat-janji").DataTable({
    data: data_buat_janji,
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
});
