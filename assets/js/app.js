const bodycontrol=document.getElementById("body");
const titlecontrol=document.getElementById("title");
const postform=document.getElementById("postform");
const userIdcontrol=document.getElementById("userId");
const postcontainer=document.getElementById("postcontainer");
const updatebtn=document.getElementById("updatebtn");
const addbtn=document.getElementById("addbtn");


const BASE_URL =`https://jsonplaceholder.typicode.com`;
const POST_URL=`${BASE_URL}/posts`;

function togglespinner() {
    spinner.classList.toggle('d-none')
}


function snackbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:2500
    })
}
let postArr=[]
const createCards=arr=>{
    postArr=arr;
    let result=""
    for(let i=arr.length-1;i>=0;i--){
        result+=`<div class="col-12 col-md-4 mb-4" id="${arr[i].id}">
      <div class="card h-100">
        <div class="card-header">
          <h3>${arr[i].title} ${arr[i].id}</h3>
        </div>

        <div class="card-body">
          <p>${arr[i].body}</p>
        </div>

        <div class="card-footer d-flex justify-content-between">
          <button onclick="onedit(this)" class="btn btn-sm btn-outline-primary">Edit</button>
          <button onclick="onremove(this)" class="btn btn-sm btn-outline-danger">remove</button>
        </div>
      </div>
    </div>`
    }
    postcontainer.innerHTML=result;
}



function MakeApiCall(method_name,api_url,msgbody=null,cbfun){
     spinner.classList.remove("d-none")
    let xhr=new XMLHttpRequest();
    xhr.open(method_name,api_url,true);
    xhr.send(msgbody);
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response);
            if(method_name==="POST"){
                 cbfun({...JSON.parse(msgbody),...res});
                spinner.classList.add("d-none")
                 return 
            }
            if(method_name==="PATCH"){
                cbfun(JSON.parse(msgbody));
                spinner.classList.add("d-none")
                return
            }
            cbfun(res);
           spinner.classList.add("d-none")

        }else{
            snackbar("something went wrong");
         spinner.classList.add("d-none")

        }
    }
}

MakeApiCall("GET",POST_URL,null,createCards);


function onpostsubmit(eve){
    eve.preventDefault();
    let post_obj={
        title:titlecontrol.value,
        body:bodycontrol.value,
        userId:userIdcontrol.value
    }
    postform.reset();
    MakeApiCall("POST",POST_URL,JSON.stringify(post_obj),createsinglecards)
}
function createsinglecards(obj){
let col=document.createElement("div");
col.className="col-12 col-md-4 mb-4";
col.id=obj.id;
col.innerHTML=`<div class="card h-100">
        <div class="card-header">
          <h3>${obj.title} ${obj.id}</h3>
        </div>

        <div class="card-body">
          <p>${obj.body}</p>
        </div>

        <div class="card-footer d-flex justify-content-between">
          <button onclick="onedit(this)" class="btn btn-sm btn-outline-primary">Edit</button>
          <button onclick="onremove(this)" class="btn btn-sm btn-outline-danger">remove</button>
        </div>
      </div>`
      postcontainer.prepend(col);
}


function onedit(eve){
    let edit_id=eve.closest(".col-md-4").id;
    localStorage.setItem("edit_id",edit_id);
    let EDIT_URL=`${BASE_URL}/posts/${edit_id}`
    MakeApiCall("GET",EDIT_URL,null,patchdatainform)
}
function patchdatainform(postobj){
    titlecontrol.value=postobj.title;
    bodycontrol.value=postobj.body;
    userIdcontrol.value=postobj.userId;
    addbtn.classList.add("d-none");
    updatebtn.classList.remove("d-none");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function onupdatefunc(eve){
    let update_id=localStorage.getItem("edit_id");
    localStorage.removeItem("edit_id");
    let update_obj={
         title:titlecontrol.value,
        body:bodycontrol.value,
        userId:userIdcontrol.value,
        id:update_id
    }
    postform.reset();
    let update_url=`${BASE_URL}/posts/${update_id}`
    MakeApiCall("PATCH",update_url,JSON.stringify(update_obj),updatePostCards)

}

function updatePostCards(obj){
let col=document.getElementById(obj.id);
col.querySelector(".card-header h3").innerText=obj.title;
col.querySelector(".card-body p").innerText=obj.body;
updatebtn.classList.add("d-none");
addbtn.classList.remove("d-none")

}

function onremove(eve){
let remove_id=eve.closest(".col-md-4").id;

let getconfirm=confirm(`do you want to remove these post with id ${remove_id}`);
if(getconfirm){
localStorage.setItem("remove_id",remove_id)
let remove_url=`${BASE_URL}/posts/${remove_id}`;
MakeApiCall("DELETE",remove_url,null,removecardfromui)
}
}
function removecardfromui(res){
    let REMOVE_id=localStorage.getItem("remove_id");
    document.getElementById(REMOVE_id).remove();
    snackbar("the post is deleted successfully","success")
}
postform.addEventListener("submit",onpostsubmit)
updatebtn.addEventListener("click",onupdatefunc)