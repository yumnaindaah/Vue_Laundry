<template>
    <div>
        <main>
            <div class="container-fluid px-4">
                <h1 class="mt-4">Data Member</h1>
                <br>
                <div class="card mb-4">
                    <div class="card-body">
                        <a class="btn btn-badge badge-sm bg-gradient-info" v-b-modal.modal_member @click="Add()">
                         <span class="icon text-white mr-2">
                            <i class="fas fa-user-plus"></i>
                        </span>
                        <b class="text text-white ">Tambah Member</b></a>

                            <table class="table text-center table-striped">
                            <thead>
                                <tr>
                                    <td><h5>ID</h5></td>
                                    <td><h5>Nama</h5></td>
                                    <td><h5>Jenis Kelamin</h5></td>
                                    <td><h5>Telepon</h5></td>
                                    <td><h5>Alamat</h5></td>
                                    <td><h5>Aksi</h5></td>
                                </tr>
                                </thead>
                                <tr v-for="mber in member" :key="mber">
                                    <td>{{ mber.id_member }}</td>
                                    <td>{{ mber.nama }}</td>
                                    <!-- <td>{{ mber.jenis_kelamin }}</td> -->
                                    <td> 
                                       <span v-if="mber.jenis_kelamin == 'l'" class="badge badge-sm bg-gradient-info">Laki-laki</span>
                                       <span v-if="mber.jenis_kelamin == 'p'" class="badge badge-sm bg-gradient-danger">Perempuan</span>
                                    </td>
                                    <td>{{ mber.telp }}</td>
                                    <td>{{ mber.alamat }}</td>
                                    <td>
                                        <a v-b-modal.modal_member href="#" class="btn btn-badge badge-sm bg-gradient-success" @click="Edit(mber)"><i class="fas fa-pen-alt"></i></a>
                                        <a href="#" class="btn btn-badge badge-sm bg-gradient-danger" @click="Delete(mber.id_member)"><i class="fas fa-trash-alt"></i></a>
                                    </td>
                                </tr>
                            </table>
                    </div>
                </div>
            </div>
        </main>

        <b-modal id="modal_member" ref="modal" title="Data Member" size="md" @ok='Save'> 
                <form>
                    <div class="form-group">
                        <label for="nama" class="col-form-label">Nama</label>
                        <input type="text" class="form-control" placeholder="Nama" v-model="nama">
                    </div>
                    <div class="form-group">
                        <label for="nama" class="col-form-label">Alamat</label>
                        <input type="text" class="form-control" placeholder="Alamat" v-model="alamat">
                    </div>
                    <div class="form-group">
                        <label for="jenis_kelamin" class="col-form-label">Jenis Kelamin</label>
                        <div class="form-check">
                            <input v-model="jenis_kelamin" class="form-check-input" type="radio" name="jenis_kelamin" id="jenis_kelamin1" value="l">
                            <label class="form-check-label" for="jenis_kelamin1">
                                Laki-laki
                            </label>
                        </div>
                        <div class="form-check">
                            <input v-model="jenis_kelamin" class="form-check-input" type="radio" name="jenis_kelamin" id="jenis_kelamin2" value="p">
                            <label class="form-check-label" for="jenis_kelamin2">
                                Perempuan
                            </label>
                            </div>
                        </div>
                    <div class="form-group">
                        <label for="tlp" class="col-form-label">Telepon</label>
                        <input type="text" class="form-control" placeholder="Telepon" v-model="telp">
                    </div>
                </form>
            </b-modal>
        </div>
    </template>

<script>
module.exports = {
    data: function(){
        return{
            nama:"",
            jenis_kelamin : "",
            telp : "",
            alamat : "",
            member :[],
            action :""

            }
        },
    methods:{
        getData: function(){
            let config = {
                headers: {
                "Authorization":"Bearer "+this.$cookies.get('Authorization')
                }
            }
            axios.get(base_url + '/member', config)
            .then(response=>{
                    console.log(response);
                if(response.data.success == true){
                    this.member = response = response.data.data.member;
            }  
        })
    },
    Add: function(){
        this.action = "insert";
        this.id_member = "";
        this.nama = "";
        this.jenis_kelamin = "";
        this.telp = "";
        this.alamat = "";
    },
    Edit: function(item){
        this.action = "update";
        this.id_member = item.id_member;
        this.nama = item.nama;
        this.jenis_kelamin = item.jenis_kelamin;
        this.telp = item.telp;
        this.alamat = item.alamat;
    },

    Save: function(){
        let config = {
            headers : {
                "Authorization":"Bearer "+this.$cookies.get('Authorization')
            }
        }

    let form = {
        "nama" : this.nama,
        "alamat" : this.alamat,
        "jenis_kelamin": this.jenis_kelamin,
        "telp": this.telp,
    }
    if(this.action == "insert"){
        axios.post(base_url + '/member', form, config)
        .then( response => {
            Swal.fire(
            'Good job!',
            'Data anggota baru berhasil ditambahkan!',
            'success');//alert
    })
    }else{
        axios.put(base_url + '/member/'+this.id_member, form, config)
        .then(response =>{
            Swal.fire(
            'Yeay!',
            'Data anggota berhasil diubah!',
            'success'); //alert
        })
    }
    this.getData();
    },
    
    Delete: function(id){
        Swal.fire({
        title: 'Apakah anda yakin?',
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
            axios.delete(base_url + '/member/'+ id, config)
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
    }
}
    
</script>