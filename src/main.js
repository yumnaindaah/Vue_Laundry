var base_url = "http://localhost:8000/api";

//konfigurasi route
var router = [
    {   
        path: "/", 
        name: "Home", 
        component: httpVueLoader("./src/components/Home.vue")
    },
    {   
        path: "/member", 
        name: "Member", 
        component: httpVueLoader("./src/components/Member.vue")
    },
    {   
        path: "/outlet", 
        name: "Outlet", 
        component: httpVueLoader("./src/components/Outlet.vue")
    },
    {   
        path: "/paket", 
        name: "Paket", 
        component: httpVueLoader("./src/components/Paket.vue")
    },
    {   
        path: "/transaksi", 
        name: "Transaksi", 
        component: httpVueLoader("./src/components/Transaksi.vue")
    },
    {   
        path: "/input_transaksi", 
        name: "Input_Transaksi", 
        component: httpVueLoader("./src/components/Input_transaksi.vue")
    },
    {   
      path: "/user", 
      name: "User", 
      component: httpVueLoader("./src/components/User.vue")
  },

];

var routers = new VueRouter({ routes : router, base: "/"});


//INSTANCE VUE

var app = new Vue({
    el: "#app",
    components: {
      'apps' : httpVueLoader("./src/components/App.vue"),
      'login' : httpVueLoader("./src/components/Login.vue"),
    },
    data: {
      user : {
        id_user: "",
        id_outlet: "",
        role: "",
        name: "",
        username: "",
      },
      componentName: ""
    },
    router: routers,
    methods: {
      CekToken : function(){
        //cek cookies, apakah sudah punya token?
        if(this.$cookies.isKey('Authorization')){

          //validasi token dulu
          let config = {
            headers : {
              "Authorization" : "Bearer " + this.$cookies.get('Authorization')
            }
          }

          axios.get(base_url + '/login/check', config)
          .then( response => {
            //console.log(response);
            if(response.data.success == true){
              //load component apps
              this.componentName = "apps";
              
              this.id_user = response.data.data.id;
              this.id_outlet = response.data.data.id_outlet;
              this.role = response.data.data.role;
              this.name = response.data.data.nama;
              this.username = response.data.data.username;

            } else {
              this.componentName = "login";
            }
          })

        } else { //kalau tidak punya, langsung ke login
          this.componentName = "login";
        }

      },
    },
    mounted(){
      this.CekToken();
    }
  });
