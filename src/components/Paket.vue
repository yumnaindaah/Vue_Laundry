<template>
  <div>
    <main>
      <div class="container-fluid px-4">
        <h1 class="mt-4">Data Paket</h1>
        <br>
        <div class="card mb-4">
          <div class="card-body">
            <!--<a class="btn btn-badge badge-sm bg-gradient-info" v-b-modal.modal_paket @click="Add()"><i class="fas fa-plus-circle"></i> Tambah Paket</a>-->
            <table class="table text-center">
              <tr>
                <th>ID Paket</th>
                <th>Jenis Paket</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
              <tr v-for="ket in paket" :key="ket">
                <td>{{ ket.id_paket }}</td>
                <td>{{ ket.jenis }}</td>
                <td>{{ ket.harga }}</td>
                <td>
                  <a
                    v-b-modal.modal_paket
                    href="#"
                    class="btn btn-badge badge-sm bg-gradient-success"
                    @click="Edit(ket)"
                    ><i class="fas fa-pen-alt"></i
                  ></a>
                  
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </main>

    <b-modal
      id="modal_paket"
      ref="modal"
      title="Form Paket Laundry"
      size="md"
      @ok="Save"
    >
      <form>
        <div class="form-group">
          <label for="nama" class="col-form-label">Jenis Paket</label>
          <input
            type="text"
            class="form-control"
            placeholder="Jenis Paket"
            v-model="jenis"
          />
        </div>
        <div class="form-group">
          <label for="nama" class="col-form-label">Harga Paket</label>
          <input
            type="numeric"
            class="form-control"
            placeholder="Harga Paket"
            v-model="harga"
          />
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      jenis: "",
      harga: "",
      paket: [],
      action: "",
    };
  },
  methods: {
    getData: function () {
      let config = {
        headers: {
          Authorization: "Bearer " + this.$cookies.get("Authorization"),
        },
      };
      axios.get(base_url + "/paket", config).then((response) => {
        console.log(response);
        if (response.data.success == true) {
          this.paket = response = response.data.data.paket;
        }
      });
    },
    // Add: function(){
    //     this.action = "insert";
    //     this.id_paket = "";
    //     this.jenis = "";
    //     this.harga = "";
    // },
    Edit: function (item) {
      this.action = "update";
      this.id_paket = item.id_paket;
      this.jenis = item.jenis;
      this.harga = item.harga;
    },

    Save: function () {
      let config = {
        headers: {
          Authorization: "Bearer " + this.$cookies.get("Authorization"),
        },
      };

      let form = {
        jenis: this.jenis,
        harga: this.harga,
      };
      if (this.action == "insert") {
        axios.post(base_url + "/paket", form, config).then((response) => {
          Swal.fire({
            icon: "success",
            title: "Paket baru berhasil ditambahkan!",
            showConfirmButton: false,
            timer: 10000,
          }); //alert
        });
      } else {
        axios
          .put(base_url + "/paket/" + this.id_paket, form, config)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Data paket berhasil diubah!",
              showConfirmButton: false,
              timer: 10000,
            }); //alert
          });
      }
      this.getData();
    },
    Delete: function (id) {
      Swal.fire({
        title: "Apakah anda yakin? ",
        text: "Data akan hilang secara permanen!!!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus!",
      }).then((result) => {
        if (result.isConfirmed) {
          let config = {
            headers: {
              Authorization: "bearer " + this.$cookies.get("Authorization"),
            },
          };
          axios.delete(base_url + "/paket/" + id, config).then((response) => {
            Swal.fire(response.data.message);
          });
          this.getData();
        }
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
