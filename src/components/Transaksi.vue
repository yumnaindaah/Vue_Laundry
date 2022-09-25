<template>
  <div id="poin">
    <div class="content-wrapper px-4">
      <div class="row">
      <h1 class="mt-4">Data Transaksi</h1>
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
             
                <router-link to="/input_transaksi" v-if="role ==='admin'||'kasir'" class="btn btn-badge badge-sm bg-gradient-success">
                             <i class="fas fa-cart-plus"></i>
                             Tambah Transaksi
                           </router-link>
              </p>
              <br>
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
                      <option value="baru" :selected="data.item.status === 'baru'">Baru</option>
                      <option value="proses" :selected="data.item.status === 'proses'">Proses</option>
                      <option value="selesai" :selected="data.item.status === 'selesai'">Selesai</option>
                      <option value="diambil" :selected="data.item.status === 'diambil'">Diambil</option>
                    </select>
                  </template>

                  <template v-slot:cell(dibayar)="data">
                    <select :disabled="role === 'owner'" class="form-control" @change="changeBayar(data.item.id_transaksi, $event)">
                      <option value="dibayar" :selected="data.item.dibayar === 'dibayar'">Dibayar</option>
                      <option value="belum_dibayar" :selected="data.item.dibayar === 'belum_dibayar'">Belum Dibayar</option>
                    </select>
                  </template>

                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" class="nav-link btn btn-badge badge-sm btn bg-gradient-warning btn-icon-text" 
                    v-on:click="Detail(data.item)" v-b-modal.modal-detail>
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

    <b-modal
      id="modal-detail"
      ref="modal"
      title="Detail Transaksi"
      size="md"
      hide-footer="true"
    >

      <div class="table-responsive table table-stripped" id="print">
        
        <center>
        <tb>
          <td>
          <h1>Nota Transaksi</h1>
          </td>
          <td>
        <h4>UMMI LAUNDRY</h4>
        </td>
        </tb>

        <table class="table table-responsive">
          <tr>
            <td rowspan="3"><img src="src/assets/img/png-clipart-washing-machines-graphics-laundry-detergent-symbol-on-washing-machine-clothes-dryer-cleaning-thumbnail-removebg-preview.png" width="150"></td>
            <td>ID</td>
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
            <td>Pembayaran</td>
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
      <a href="#" class=" btn btn-badge badge-sm btn bg-gradient-warning btn-icon-text"  @click="Prints()"><i class="fas fa-print"></i> Cetak Nota</a>

    </b-modal>

  </div>
</template>

<script>
module.exports = {
  data : function(){
    return {
      tahun: "",
      role:"",
      bulan: "",
      tgl: "",
      action: "",
      message: "",
      key: "",
      total: "",
      transaksi: [],
      detail_transaksi: [],
      fields_transaksi: ["id_transaksi", "nama_member", "tgl", "status", "dibayar", "tgl_bayar", "kasir", "total", "Aksi"],
      fields_detail_transaksi: ["jenis", "berat", "sub_total"],
      list_years: [2020, 2021, 2022, 2023],
      list_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }
  },
  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let form = {
        "tahun": this.tahun,
        "bulan": this.bulan,
        "tgl": this.tgl
      }
      axios.post(base_url + "/transaksi/report", form, conf)
      .then(response => {
          this.transaksi = response.data.data;
      })
      .catch(error => {
        console.log(error);
      });
    },
    changeStatus: function(id_transaksi, event){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let form = {
        "id_transaksi": id_transaksi,
        "status": event.target.value
      }
      axios.put(base_url + "/transaksi/status", form, conf)
      .then(response => {
        this.getData();
        alert(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
    },
    changeBayar: function(id_transaksi, event){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let form = {
        "id_transaksi": id_transaksi,
        "status": event.target.value
      }
      axios.put(base_url + "/transaksi/bayar", form, conf)
      .then(response => {
        this.getData();
        alert(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
    },
    Detail: function(data){
      this.total = data.total;
      this.detail_transaksi = data;
      
    },
    Prints: function(){
      const prtHtml = document.getElementById('print').innerHTML;
      //console.log(prtHtml);
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }
      const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
        <link rel="stylesheet" href="src/assets/css/bootstrap.min.css">
          
        </head>
        <body>
          ${prtHtml}
        </body>
      </html>`);
      WinPrint.document.close();
      WinPrint.focus();
      //WinPrint.print();
      //WinPrint.close();
    }
  },
  mounted(){
    this.key = this.$cookies.get("Authorization");
    this.getData();
    this.getInfo();
  }
}
</script>
