<template>
  <div>
     <div id="layoutAuthentication">
            <div id="layoutAuthentication_content">
                <main class="main-content  mt-0">
                  <section class="min-vh-100 mb-8">
                    <div class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg" style="background-image: url('src/assets/img/curved-images/curved14.jpg');">
                      <span class="mask bg-gradient-dark opacity-6"></span>
                      <div class="container">
                        <div class="row justify-content-center">
                          <div class="col-lg-5 text-center mx-auto">
                            <h1 class="text-white mb-2 mt-5">Selamat Datang!</h1>
                            <p class="text-lead text-white">Cucian bersih hingga membasmi noda membandel!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="container">
                      <div class="row mt-lg-n10 mt-md-n11 mt-n10">
                        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
                          <div class="card z-index-0">
                            <div class="card-header text-center pt-4">
                              <h3>Sign In</h3>
                            </div>
                            <div class="card-body">
                            {{ message }}
                            <div class="card-body">
                              <form v-on:submit.prevent="Login" method="post">
                                <div class="mb-3">
                                  <input v-model="username" class="form-control" id="username" type="text" placeholder="Username" />
                                </div>
                                <div class="mb-3">
                                  <input v-model="password" class="form-control" id="inputPassword" type="password" placeholder="Password" />
                                </div>
                                
                                <div class="text-center">
                                  <button type="sumbit" value="Login" class="btn bg-gradient-dark w-100 my-4 mb-2">Sign in</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </main>
            </div>
        </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      username: "",
      password: "",
      message: "",
    };
  },
  methods: {
    Login: function () {
      this.message = "Mohon tunggu..."; //alert notif

      //mapping data
      let form = {
        username: this.username,
        password: this.password,
      };

      axios.post(base_url + "/login", form).then((response) => {
        if (response.data.success == true) {
          // this.message = response.data.message; //alert
          Swal.fire({
            icon: "success",
            title: "Selamat Datang Kembali di UMMI LAUNDRY!",
            showConfirmButton: false,
            timer: 10000,
          }); //alert
        

          //cek apakah token sudah ada di cookies???
          if (this.$cookies.isKey("Authorization")) {
            this.$cookies.remove("Authorization");
          }

          //menyimpan token ke cookies
          this.$cookies.set("Authorization", response.data.data.token);

          location.reload();
        } else {
         Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ada kesalahan dalam memasukkan data!',
       
})
        }
      });
    },
  },
};
</script>
