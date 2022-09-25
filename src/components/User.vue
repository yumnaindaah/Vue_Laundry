<template>
    <div>
        <main>
            <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <div class="card mb-4">
            <div class="card-header pb-0">
              <h1>Data Petugas</h1>
            </div>
            <div class="card-body px-0 pt-0 pb-2">
              <div class="table-responsive p-4">
                  <a class="btn btn-badge badge-sm bg-gradient-info" v-b-modal.modal_user @click="Add()">
                         <span class="icon text-white mr-2">
                            <i class="fas fa-user-plus"></i>
                        </span>
                        <b class="text text-white ">Tambah Petugas</b></a>
                    <table class="table text-center">
                    
                                <tr>
                                    <td><h5>ID User</h5></td>
                                    <td><h5>Nama</h5></td>
                                    <td><h5>Username</h5></td>
                                    <td><h5>Petugas</h5></td>
                                    <td><h5>Outlet</h5></td>
                                    <td><h5>Action</h5></td>
                                </tr>
                            
                                <tr v-for="ser in user" :key="ser">
                                    <td>{{ ser.id }}</td>
                                    <td>{{ ser.nama }}</td>
                                    <td>{{ ser.username }}</td>
                                    <td>
                                        <span v-if="ser.role == 'admin'" class="badge badge-sm bg-gradient-info">Admin</span>
                                        <span v-if="ser.role == 'kasir'" class="badge badge-sm bg-gradient-warning">Kasir</span>
                                        <span v-if="ser.role == 'owner'" class="badge badge-sm bg-gradient-success">Owner</span>
                                    </td>
                                    <td>{{ ser.outlet.nama_outlet }}</td>
                                    <td>
                                        <a v-b-modal.modal_user href="#" class="btn btn-badge badge-sm bg-gradient-success" @click="Edit(ser)"><i class="fas fa-pen-alt"></i></a>
                                        <a href="#" class="btn btn-badge badge-sm bg-gradient-danger" @click="Delete(ser.id)"><i class="fas fa-trash-alt"></i></a>
                                    </td>
                                </tr>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <b-modal id="modal_user" ref="modal" title="Form User" size="md" @ok="Save">
            <form>
                <div class="form-group">
                    <label for="inputNama">Nama</label>
                    <input v-model="nama" placeholder="masukkan nama" id="inputNama" class="form-control" type="text"/>
                </div>
                <div class="form-group">
                    <label for="inputUsername">Username</label>
                    <input v-model="username" placeholder="masukkan username"  id="inputUsername" class="form-control" type="text"/>
                    
                </div>
                <div class="form-group">
                    <label for="inputUsername">Password</label>
                    <input v-model="password" placeholder="masukkan password"  id="inputPassword" class="form-control" type="password"/>
                    
                </div>
                <div class="form-group">  
                    <label for="inputRole" >Role</label>
                    <select id="inputRole" class="form-control" v-model="role">
                    <option value="">--Pilih Role--</option>
                    <option value="admin">Admin</option>
                    <option value="kasir">Kasir</option>
                    <option value="owner">Owner</option>
                    </select>
                    
                </div>
                <div class="form-group">
                    <label for="id_outlet">Outlet</label>
                    <b-form-select class="form-control" v-model="id_outlet" :options="data_outlet"></b-form-select>
                    
                </div>
            </form>
        </b-modal>
    </div>
</template> 
<script>
module.exports = {
    data: function(){
        return{
            id_outlet:"",
            nama:"",
            username : "",
            password:"",
            role : "",
            action:"",
            outlet:"",
            user:[],
            data_outlet:[],
            }
        },
    methods:{
        getData: function(){
        let config = {
            headers: {
                "Authorization":"Bearer "+this.$cookies.get('Authorization')
            }
        }
        axios.get(base_url + '/user', config)
        .then(response=>{
                console.log(response);
            if(response.data.success == true){
                this.user = response = response.data.data.user;
        }   else{
            this.componentName = 'login';
            window.location = front_url;
        }  
    })
    .catch(error =>{
        console.log(error);
    });
},
OutletDropdown: function(){
    let config= {
        headers:{
            "Authorization":"Bearer "+this.$cookies.get('Authorization')
        }
    };
    axios.get(base_url + '/outlet', config)
        .then(response=>{
            console.log(response)
            let json_outlet = response.data.data.outlet;
            let list_outlet = [{
                value: "", text:"--Pilih Outlet--"
            }]
            json_outlet.forEach(element =>{
                list_outlet.push({
                    value: element.id_outlet, text: element.nama_outlet
                    })
                });
                this.data_outlet = list_outlet
            })
        },
Add: function(){
    this.action = "insert";
    this.id_outlet = "";
    this.id = "";
    this.nama = "";
    this.username = "";
    this.password = "";
    this.role = "";
},
Edit: function(item){
    this.action = "update";
    this.id_outlet = item.id_outlet;
    this.id = item.id
    this.nama = item.nama;
    this.username = item.username;
    this.role = item.role;
},
Save: function(){
    let config = {
        headers : {
            "Authorization":"Bearer "+this.$cookies.get('Authorization')
        }
    }
    let form = {
        "id_outlet" : this.id_outlet,
        "nama" : this.nama,
        "username": this.username,
        "password": this.password,
        "role": this.role,
    }
    if(this.action == "insert"){
        axios.post(base_url + '/user', form, config)
        .then( response => {
            this.getData();
            Swal.fire(
                'Good job!',
                'Data petugas baru berhasil ditambahkan!',
                'success'
            )
    })
    .catch(error => {
          console.log(error);
        });
    }else{
        axios.put(base_url + '/user/'+this.id, form, config)
        .then(response =>{
            this.getData();
             Swal.fire(
                'Okay!',
                'Data petugas berhasil diubah!',
                'success'
            )
            
        })
        .catch(error => {
          console.log(error);
        });
    }
},
    Delete: function(id){
        Swal.fire({
        title: 'Apakah anda yakin? ',
        text: "Data yang anda pilih akan terhapus secara permanen!!!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!'
    })
       .then((result) => {
  if (result.isConfirmed) {
           let config = {
               headers : {
                   "Authorization": "bearer " + this.$cookies.get('Authorization')
               }
           }
            axios.delete(base_url + '/user/'+ id, config)
            .then(response =>{
            Swal.fire(response.data.message)
        })
        this.getData();
       }
       })
    }
    },
    mounted(){
        this.getData();
        this.OutletDropdown();
    }
}
    
</script>