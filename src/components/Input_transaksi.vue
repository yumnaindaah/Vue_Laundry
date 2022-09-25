<template>
  <div>
    <main>
      <h1 class="h3 mb-0 text-gray-800">Tambah Transaksi</h1>
      <div class="row mt-4 mb-4">
        <div class="col-lg-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h1 class="h5 mb-4 text-gray-800 font-weight-bold">
                Data Pribadi
              </h1>
              <div class="table-responsive">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">
                      <i class="fas fa-user"></i>
                    </span>
                  </div>
                  <b-form-select
                    class="form-control"
                    v-model="id_member"
                    :options="data_member"
                  ></b-form-select>
                </div>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">
                      <i class="fas fa-calendar"></i>
                    </span>
                  </div>
                  <input
                    type="date"
                    class="form-control"
                    placeholder="Tanggal"
                    v-model="tgl"
                  />
                </div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">
                      <i class="fas fa-clock"></i>
                    </span>
                  </div>
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Lama Pembayaran"
                    v-model="lama_pengerjaan"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 grid-margin">
          <div class="card">
            <div class="card-body">
              <div>
                <a
                  href="#"
                  class="btn bg-gradient-warning btn-icon-split text-light"
                  @click="addItem"
                >
                  <b class="icon text-white">
                    <i class="fas fa-plus"></i>
                  </b>
                  <b class="text text-white">Tambah</b>
                </a>
                <br /><br />
                <div
                  class="row"
                  v-for="(detail, counter) in detail_transaksi"
                  v-bind:key="counter"
                >
                  <br /><br />
                  <div class="col-md-2">
                    <a
                      href="#"
                      class="btn btn-outline-danger"
                      @click="deleteItem(counter)"
                    >
                      <span class="icon">
                        <i class="fas fa-trash"></i>
                      </span>
                    </a>
                  </div>
                  <div class="col-md-5">
                    <div class="form-group">
                      <b-form-select
                        class="form-control"
                        v-model="detail.id_paket"
                        :options="data_paket"
                      ></b-form-select>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="form-group">
                      <input
                        class="form-control"
                        placeholder="Berat"
                        type="number"
                        v-model="detail.berat"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <a
                href="#"
                class="btn bg-gradient-primary text-light btn-block text-center"
                @click="Save"
              >
                <span class="icon text-white mr-2">
                  <i class="fas fa-plus"></i>
                </span>
                
                <b class="text text-white ">Buat Transaksi</b>
                
              </a>
                 
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      id_user: "",
      id_member: "",
      tgl: "",
      lama_pengerjaan: "",
      detail_transaksi: [
        {
          id_paket: "",
          berat: "",
        },
      ],
      action: "",
      message: "",
      key: "",
      data_paket: [],
      data_member: [],
    };
  },
  methods: {
    addItem() {
      this.detail_transaksi.push({
        id_paket: "",
        berat: "",
      });
    },
    deleteItem(counter) {
      this.detail_transaksi.splice(counter, 1);
    },
    getPaketDropdown: function () {
      //ambil data paket untuk dropdown
      let config = { headers: { Authorization: "Bearer " + this.key } };
      axios.get(base_url + "/paket", config).then((response) => {
        let json_paket = response.data.data.paket;
        let list_paket = [{ value: "", text: "-- Pilih Paket --" }];
        json_paket.forEach((element) => {
          list_paket.push({
            value: element.id_paket,
            text: element.jenis + " - " + element.harga,
          });
        });
        this.data_paket = list_paket;
      });
    },
    getMemberDropdown: function () {
      //ambil data member untuk dropdown
      let config = { headers: { Authorization: "Bearer " + this.key } };
      axios.get(base_url + "/member", config).then((response) => {
        let json_member = response.data.data.member;
        let list_member = [{ value: "", text: "-- Pilih Member --" }];
        json_member.forEach((element) => {
          list_member.push({ value: element.id_member, text: element.nama });
        });
        this.data_member = list_member;
      });
    },
    Save: function () {
      let config = { headers: { Authorization: "Bearer " + this.key } };
      //get id user
      axios.get(base_url + "/login/check", config).then((response) => {
        if (response.data.success == false) {
          this.componentName = "login";
          window.location = front_url;
        } else {
          this.id_user = response.data.data.id;
          //insert data transaksi
          let form = {
            id_member: this.id_member,
            tgl: this.tgl,
            lama_pengerjaan: this.lama_pengerjaan,
            id_user: this.id_user,
            detail: this.detail_transaksi,
          };
          axios
            .post(base_url + "/transaksi", form, config)
            .then((response2) => {
              if (response2.data.success == true) {
                this.message = response2.data.message;
                this.id_user = "";
                this.id_member = "";
                this.tgl = "";
                this.lama_pengerjaan = "";
                this.detail_transaksi = [];
                this.$router.push('/transaksi')
                Swal.fire(
                'Good job!',
                'Transaksi baru berhasil ditambahkan!',
                'success');//alert
              } else {
                this.message = "Pastikan data terisi lengkap!.";
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
  },
  mounted() {
    this.key = this.$cookies.get("Authorization");
    this.getMemberDropdown();
    this.getPaketDropdown();
  },
};
</script>
