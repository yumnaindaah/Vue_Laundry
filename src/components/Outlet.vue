<template>
    <div>
        <main>
            <div class="container-fluid px-4">
                <h1 class="mt-4">Data Outlet</h1>
                <br>
                <div class="card mb-4">
                    <div class="card-body">
                        <a class="btn btn-badge badge-sm bg-gradient-info" v-b-modal.modal_outlet @click="Add()">
                        <span class="icon text-white mr-2">
                            <i class="fas fa-plus-circle"></i>
                        </span>
                        <b class="text text-white ">Tambah Outlet</b></a>
                            
                            <table class="table ">
                                <tr>
                                    <td><h5>ID</h5></td>
                                    <td><h5>Outlet</h5></td>
                                    <td><h5>Aksi</h5></td>
                                </tr>
                                <tr v-for="letlet in outlet" :key="letlet">
                                    <td>{{ letlet.id_outlet }}</td>
                                    <td>{{ letlet.nama_outlet }}</td>
                                    <td>
                                        <a v-b-modal.modal_outlet href="#" class="btn btn-badge badge-sm bg-gradient-success" @click="Edit(letlet)"><i class="fas fa-pen-alt"></i></a>
                                        <a href="#" class="btn btn-badge badge-sm bg-gradient-danger" @click="Delete(letlet.id_outlet)"><i class="fas fa-trash-alt"></i></a>
                                    </td>
                                </tr>
                            </table>
                    </div>
                </div>
            </div>
        </main>

        <b-modal id="modal_outlet" ref="modal" title="Data Outlet" size="md" @ok='Save'> 
                <form>
                    <div class="form-group">
                        <label for="nama_outlet" class="col-form-label">Outlet</label>
                        <input type="text" class="form-control" placeholder="Nama Outlet" v-model="nama_outlet">
                    </div>
                </form>
            </b-modal>
        </div>
    </template>
    
<script>
module.exports = {
    data: function(){
        return{
            nama_outlet:"",
            outlet:[],
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
            axios.get(base_url + '/outlet', config)
            .then(response=>{
                    console.log(response);
                if(response.data.success == true){
                    this.outlet = response = response.data.data.outlet;
            }  
        })
    },
    Add: function(){
        this.action = "insert";
        this.id_outlet = "";
        this.nama_outlet = "";
    },
    Edit: function(item){
        this.action = "update";
        this.id_outlet = item.id_outlet;
        this.nama_outlet = item.nama_outlet;
    },

    Save: function(){
        let config = {
            headers : {
                "Authorization":"Bearer "+this.$cookies.get('Authorization')
            }
        }

    let form = {
        "nama_outlet" : this.nama_outlet,
    }
    if(this.action == "insert"){
        axios.post(base_url + '/outlet', form, config)
        .then( response => {
            Swal.fire(
            'Good job!',
            'Data outlet baru berhasil ditambahkan!',
            'success');//alert
    })
    }else{
        axios.put(base_url + '/outlet/'+this.id_outlet, form, config)
        .then(response =>{
           Swal.fire(
            'Yeay!',
            'Data outlet berhasil diubah!',
            'success'); //alert
        })
    }
    this.getData();
},
    // Delete: function(id){
    //     Swal.fire({
    //     title: 'Apakah anda yakin? ',
    //     text: "Data yang anda pilih akan hilang secara permanen!!!",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Ya, Hapus!'
    // })
    //    .then((result) => {
    //     if (result.isConfirmed) {
    //        let config = {
    //            headers : {
    //                "Authorization": "bearer " + this.$cookies.get('Authorization')
    //            }
    //        }
    //         axios.delete(base_url + '/outlet/'+ id, config)
    //         .then(response =>{
    //         Swal.fire(response.data.message)
    //     })
    //     this.getData();
    //    }
    //    })
    // }
    },
    mounted(){
        this.getData();
    }
}
    
</script>