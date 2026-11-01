export function showingSuccessToast(msg){
 Toastify({text:msg,
            duration:3000,
            gravity:"bottom",
            position:"right",
            stopOnFocus:true,

 }).showToast();
}

export function showingErrorToast(msg){
    Toastify({
        text:msg,
        duration:3000,
        gravity:"bottom",
        position:"right",
        style:{
            background:"linear-gradient(to right,#8B0000,#FFCCCB)"
        },
        stopOnFocus:true
    }).showToast();
}