<template>
  <div id="input-palanggaran">
    <div class="content-wrapper">
      <div class="row">
        <div class="col-lg-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h3 class="mt-4">Input Transaksi</h3>
              <div class="table-responsive">
                  <div class="form-group">
                      <label class="col-form-label">Member</label>
                      <b-form-select class="form-control" v-model="id_member" :options="data_member"></b-form-select>
                  </div>
                  <div class="form-group">
                    <label for="tgl" class="col-form-label">Tanggal Transaksi</label>
                    <input type="date" class="form-control" placeholder="Tanggal" v-model="tgl">
                  </div>
                  <div class="form-group">
                    <label for="lama_pengerjaan" class="col-form-label">Lama Pengerjaan</label>
                    <input type="number" class="form-control" placeholder="Lama Pengerjaan" v-model="lama_pengerjaan">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br>
        <div class="col-lg-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                  <b-button @click="addItem" size="sm" variant="warning"><i class="mdi mdi-plus btn-icon-prepend"></i> Tambah Item</b-button>
                  <br><br>
                  <div class="row" v-for="(detail, counter) in detail_transaksi"
                  v-bind:key="counter">
                  <br><br>
                    <div class="col-md-2">
                      <b-button variant="danger" size="sm" @click="deleteItem(counter)">Hapus</b-button>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <b-form-select class="form-control" v-model="detail.id_paket" :options="data_paket"></b-form-select>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <input class="form-control" placeholder="Berat" type="number" v-model="detail.berat"> 
                      </div>
                    </div>
                  </div>
                  <br><br>
                  <router-link to="/transaksi">
                  <center><b-button @click="Save" size="sm" variant="success" >Submit</b-button></center>
                  </router-link>
                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>
                
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  </div>      
</template>

<script>
module.exports = {
  data : function(){
    return {
      id: "",
      id_member: "",
      tgl: "",
      lama_pengerjaan: "",
      detail_transaksi: [{
      id_paket: '',
      berat: '',
      }],
      
      action: "",
      message: "",
      key: "",
      data_paket: [],
      data_member: [],
    }
  },
  methods: {
    addItem(){
      this.detail_transaksi.push({
        id_paket: '',
        berat: '',
      })
    },
    deleteItem(counter){
      this.detail_transaksi.splice(counter,1);
    },
    getPaketDropdown: function(){
        //ambil data paket untuk dropdown
        let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
        axios.get(base_url + "/paket", conf)
        .then(response => {
            let json_paket = response.data.data.paket;
            let list_paket = [{value: "", text: "-- Pilih Paket --"}]
            json_paket.forEach(element => {
                list_paket.push({value: element.id_paket, text: element.jenis+" - "+element.harga})
            });
            this.data_paket = list_paket
        })
    },
    getMemberDropdown: function(){
        //ambil data member untuk dropdown
        let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
        axios.get(base_url + "/member", conf)
        .then(response => {
            let json_member = response.data.data.member;
            let list_member = []
            json_member.forEach(element => {
                list_member.push({value: element.id_member, text: element.nama})
            });
            this.data_member = list_member
        })
    },
    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      //get id user
      axios.get(base_url + "/login/check", conf)
      .then(response => {
        if(response.data.success == false){
          this.componentName = 'login';
          window.location = front_url;
        } else {
          this.id = response.data.data.id;
          //insert data transaksi
          let form = {
            "id_member": this.id_member,
            "tgl": this.tgl,
            "lama_pengerjaan": this.lama_pengerjaan,
            "id": this.id,
            "detail": this.detail_transaksi,
          }
          axios.post(base_url + "/transaksi", form, conf)
          .then(response2 => {
            if(response2.data.success == true){
                this.message = response2.data.message;
                this.$bvToast.show("message");
                this.id = "";
                this.id_member = "";
                this.tgl = "";
                this.lama_pengerjaan = "";
                this.detail_transaksi = [];
            } else {
              this.message = "Pastikan data terisi lengkap!.";
              this.$bvToast.show("message");
            }
           
          })
          .catch(error => {
            console.log(error);
          });
        }
      })
    },
  },
  mounted(){
    this.key = this.$cookies.get("Authorization");
    this.getMemberDropdown();
    this.getPaketDropdown();
  }
}
</script>

Swal.fire({
            icon: "success",
            title: "Data outlet berhasil diubah!",
            showConfirmButton: false,
            timer: 10000,
          }); //alert


transaksi

<template>
    <div id="poin">
        <div class="content-wrapper px-4">
            <div class="row">
              <h1 class="mt-4">Data Transaksi</h1>
                <br>
                <div class="col-lg-12 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                           <router-link to="/input_transaksi" v-if="role !== 'owner'" class="btn btn-badge badge-sm bg-gradient-success">
                             <i class="fas fa-cart-plus"></i>
                             Tambah Transaksi
                           </router-link>
                            </p>
                            <br />
                            <form>
                                <div class="row">
                                    <div class="col-lg-6 col-md-6">
                                        <div class="form-group">
                                            <label for="tahun" class="col-form-label">Tahun</label>
                                            <b-form-select class="form-control" @change="getData($event)" v-model="tahun" :options="list_years"></b-form-select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <div class="form-group">
                                            <label for="tahun" class="col-form-label">Bulan</label>
                                            <b-form-select class="form-control" @change="getData($event)" v-model="bulan" :options="list_months"></b-form-select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div class="table-responsive">
                                <b-table striped hover :items="transaksi" :fields="fields_transaksi">
                                    <template v-slot:cell(status)="data">
                                        <select :disabled="role === 'owner'" class="form-control" @change="changeStatus(data.item.id_transaksi, $event)">
                                            <option value="baru" :selected="data.item.status === 'baru'">
                                                Baru
                                            </option>
                                            <option value="proses" :selected="data.item.status === 'proses'">
                                                Proses
                                            </option>
                                            <option value="selesai" :selected="data.item.status === 'selesai'">
                                                Selesai
                                            </option>
                                            <option value="diambil" :selected="data.item.status === 'diambil'">
                                                Diambil
                                            </option>
                                        </select>
                                    </template>

                                    <template v-slot:cell(dibayar)="data">
                                        <select :disabled="role === 'owner'" class="form-control" @change="changeBayar(data.item.id_transaksi, $event)">
                                            <option value="dibayar" :selected="data.item.dibayar === 'dibayar'">
                                                Dibayar
                                            </option>
                                            <option value="belum_dibayar" :selected="data.item.dibayar === 'belum_dibayar'">
                                                Belum Dibayar
                                            </option>
                                        </select>
                                    </template>

                                    <template v-slot:cell(Aksi)="data">
                                        <b-button size="sm" class="nav-link btn btn-badge badge-sm btn bg-gradient-warning btn-icon-text" v-on:click="
                                          Detail(data.item.detail_transaksi, data.item.total)
                                        " v-b-modal.modal-detail>
                                            <i class="mdi mdi-file-document-box-outline btn-icon-prepend"></i><i class="fas fa-info-circle"></i>
                                            Detail
                                        </b-button>
                                    </template>
                                </b-table>

                                <!-- toast untuk tampilan message box -->
                                <b-toast id="message" title="Message">
                                    <strong class="text-success">{{ message }}</strong>
                                </b-toast>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <b-modal id="modal-detail" ref="modal" title="Detail Transaksi" size="md" hide-footer="true">

      <div class="table-responsive table table-stripped" id="print">
        
        <table class="table table-responsive">
          <tr>
            <td rowspan="3"><img src="src/assets/img/png-clipart-washing-machines-graphics-laundry-detergent-symbol-on-washing-machine-clothes-dryer-cleaning-thumbnail-removebg-preview.png" width="150"></td>
            <td>ID ORDER</td>
            <td>:</td>
            <td>{{ detail_transaksi.id_transaksi }}</td>
            <td>Nama Member</td>
            <td>:</td>
            <td>{{ detail_transaksi.nama_member }}</td>
          </tr>
          <tr>
            <td>Nama Kasir</td>
            <td>:</td>
            <td>{{ detail_transaksi.kasir }}</td>
            <td>PEMBAYARAN</td>
            <td>:</td>
            <td>{{ detail_transaksi.dibayar }}</td>
          </tr>
          <tr>
            <td>Tanggal Transaksi</td>
            <td>:</td>
            <td>{{ detail_transaksi.tgl }}</td>
            <td>Tanggal Pembayaran</td>
            <td>:</td>
            <td>{{ detail_transaksi.tgl_bayar }}</td>
          </tr>
        </table>
        <hr>
        <br>
        <b-table striped hover :items="detail_transaksi.detail_transaksi" :fields="fields_detail_transaksi">
        </b-table>
        <div class="text-right"><h4>Total: Rp{{ total }}</h4></div>
      </div>
      <br>
      <a href="#" class="btn btn-primary btn-sm" @click="Prints()">Cetak Nota</a>

    </b-modal>
    </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      tahun: "",
      role: "",
      bulan: "",
      tgl: "",
      action: "",
      message: "",
      key: "",
      total: "",
      kasir:"",
      transaksi: [],
      detail_transaksi: [],
      fields_transaksi: [
        "id_transaksi",
        "nama_member",
        "tgl",
        "status",
        "dibayar",
        "tgl_bayar",
        "kasir",
        "total",
        "Aksi",
      ],
      fields_detail_transaksi: ["jenis", "berat", "sub_total"],
      list_years: [2020, 2021, 2022, 2023],
      list_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    };
  },
  methods: {
    getData: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      let form = {
        tahun: this.tahun,
        bulan: this.bulan,
        // tgl: this.tgl,
      };
      axios
        .post(base_url + "/transaksi/report", form, conf)
        .then((response) => {
          this.transaksi = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getInfo: function () {
      let config = {
        headers: {
          Authorization: "Bearer " + this.$cookies.get("Authorization"),
        },
      };

      axios.get(base_url + "/login/check", config).then((response) => {
        if (response.data.success == true) {
          this.role = response.data.data.role;
          this.kasir = response.data.data.kasir;
        }
      });
    },

    changeStatus: function (id_transaksi, event) {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      let form = {
        id_transaksi: id_transaksi,
        status: event.target.value,
      };
      axios
        .put(base_url + "/transaksi/status", form, conf)
        .then((response) => {
          this.getData();
          alert(response.data.message);
          // this.$bvToast.show("message");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeBayar: function (id_transaksi, event) {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      let form = {
        id_transaksi: id_transaksi,
        status: event.target.value,
      };
      axios
        .put(base_url + "/transaksi/bayar", form, conf)
        .then((response) => {
          this.getData();
          alert(response.data.message);
          // this.$bvToast.show("message");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    Detail: function (detail_transaksi, total) {
      this.total = total;
      this.detail_transaksi = detail_transaksi;
    },
    Prints: function () {
      const prtHtml = document.getElementById("print").innerHTML;
      console.log(prtHtml);
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style'),
      ]) {
        stylesHtml += node.outerHTML;
      }
      const WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
      );
      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
        <link rel="stylesheet" href="src/assets/css/bootstrap.min.css">
  
        </head>
        <body>
        <tb>
        <center>
          <td>
          <h4>Invoice</h4>
          </td>
          <td>
        <h1>UMMI LAUNDRY</h1>
        </center>
        </td>
        <p class="font-weight-bold">
          Kasir :
          <span class="badge bg-gradient-primary text-light">{{ kasir }}</span>
        </p>
      </div>
        <td>
          ${prtHtml}
        </td>
        <td>
        <td>
          <td>
        <center><h5>Terimakasih Sudah Laundry di UMMI LAUNDRY</h5></center>
        </td>
        </body>
      </html>`);
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      //WinPrint.close();
    },
  },
  mounted() {
    this.key = this.$cookies.get("Authorization");
    this.getData();
    this.getInfo();
  },
};
</script>
