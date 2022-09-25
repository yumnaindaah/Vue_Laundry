<template>
<div id="">
  <div class="container-fluid py-4">
      <div class="row">
        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div class="card">
            <div class="card-body p-3">
              <div class="row">
                <div class="col-8">
                  <div class="numbers">
                    <p class="text-sm mb-0 text-capitalize font-weight-bold">Total Anggota</p>
                    <h5 class="font-weight-bolder mb-0">
                     {{ member.length }} 
                      <span class="text-success text-sm font-weight-bolder">Anggota</span>
                    </h5>
                  </div>
                </div>
                <div class="col-4 text-end">
                 
                    <i class="fas fa-users fa-2x opacity-30 align-right" aria-hidden="true"></i>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div class="card">
            <div class="card-body p-3">
              <div class="row">
                <div class="col-8">
                  <div class="numbers">
                    <p class="text-sm mb-0 text-capitalize font-weight-bold">Total Outlet</p>
                    <h5 class="font-weight-bolder mb-0">
                      {{ outlet.length }}
                      <span class="text-success text-sm font-weight-bolder">Outlet</span>
                    </h5>
                  </div>
                </div>
                <div class="col-4 text-end">
                  
                    <i class="fas fa-store fa-2x opacity-10" aria-hidden="true"></i>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          
          <div class="card">
            <div class="card-body p-3">
              <div class="row">
                <div class="col-8">
                  <div class="numbers">
                    <p class="text-sm mb-0 text-capitalize font-weight-bold">Total Paket</p>
                    <h5 class="font-weight-bolder mb-0">
                      {{ paket.length}}
                      <span class="text-danger text-sm font-weight-bolder">Paket</span>
                    </h5>
                  </div>
                </div>
                <div class="col-4 text-end">
                  
                   <i class="fas fa-tshirt fa-2x" aria-hidden="true"></i>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-xl-3 col-sm-6">
          <div class="card">
            <div class="card-body p-3">
              <div class="row">
                <div class="col-8">
                  <div class="numbers">
                    <p class="text-sm mb-0 text-capitalize font-weight-bold">Total Petugas</p>
                    <h5 class="font-weight-bolder mb-0">
                     {{ user.length}}
                      <span class="text-success text-sm font-weight-bolder">Petugas</span>
                    </h5>
                  </div>
                </div>
                <div class="col-4 text-end">
                  
                    <i class="fa fa-user fa-2x opacity-10" aria-hidden="true"></i>
                  
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>              
    </template>

<script>
module.exports = {
  data: function(){
      return {
        member: [],
        outlet:[],
        paket:[],
        user:[],
    }
  },
  methods: {
    // GET DATA OUTLET
    getDataOutlet: function () {
      let config = {
        headers: {
          Authorization: "Bearer " + this.$cookies.get("Authorization"),
        },
      };
      axios.get(base_url + "/outlet", config).then((response) => {
        console.log(response);
        if (response.data.success == true) {
          this.outlet = response.data.data.outlet;
        }
      });
    },
    // GET DATA MEMBER
    getDataMember: function () {
      let config = {
        headers: {
          Authorization: "Bearer " + this.$cookies.get("Authorization"),
        },
      };
      axios.get(base_url + "/member", config).then((response) => {
        console.log(response);
        if (response.data.success == true) {
          this.member = response.data.data.member;
        }
      });
    },
    // GET DATA PAKET
    getDataPaket: function () {
      let config = {
        headers: {
          Authorization: "Bearer " + this.$cookies.get("Authorization"),
        },
      };
      axios.get(base_url + "/paket", config).then((response) => {
        console.log(response);
        if (response.data.success == true) {
          this.paket = response.data.data.paket;
        }
      });
    },
    getDataUser: function () {
      let config = {
        headers: {
          Authorization: "Bearer " + this.$cookies.get("Authorization"),
        },
      };
      axios.get(base_url + "/user", config).then((response) => {
        console.log(response);
        if (response.data.success == true) {
          this.user = response.data.data.user;
        }
      });
    },
  },

  mounted() {
    this.getDataMember();
    this.getDataPaket();
    this.getDataOutlet();
    this.getDataUser();
  },
}
</script>
