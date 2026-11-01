import {ExpenseUI} from './ui/expenseUI';
import {UserService} from './services/UserService';
import {ExpenseService} from './services/ExpenseService';

class ExpenseApp{
    constructor(){
        this.userService=new UserService();
        this.expenseService=new ExpenseService(this.userService);
        //this.ui=new ExpenseUI(this.userService,this.expenseService);
        this.ui=null;
    }
    init(){
        try{
            this.ui=new ExpenseUI(this.userService,this.expenseService);
            console.log("Splitter App initialized successfully");
        }catch(error){
            console.error("failed to initialize app:", error);
        }
    }
}
let expenseApp;
document.addEventListener('DOMContentLoaded',()=>{
    expenseApp=new ExpenseApp();
    expenseApp.init();
})

//initialize app if not initialize when DOM content loaded whenever window loads, if we won't initilaize app, then our toaster pop's won't work
window.addEventListener('load',()=>{
    if(!expenseApp){
        expenseApp=new ExpenseApp();
        expenseApp.init();
    }
})