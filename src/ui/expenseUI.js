//Initialize all UI elements
//bind events
//select box in Expense section

import {DOMHelper} from '../ui/DOMHelpers';
import {showingSuccessToast,showingErrorToast} from '../utilis/toastUtil';
import {ExportAndImport} from '../utilis/ExportAndImport';

export class ExpenseUI{
    constructor(userService,expenseService){
        this.userService=userService;
        this.expenseService=expenseService;

        this.initializeElements();
        this.bindEvents();
        this.initializeSelectBox();
        //this.initializeAmount();
        this.exportAndImport=new ExportAndImport(this.userService,this.expenseService);
    }

    initializeElements(){
        this.elements={
            addUserForm:DOMHelper.getElementByID("addUserForm"),
            txtUser:DOMHelper.getElementByID("txtUser"),
            expenseUserInput:DOMHelper.getElementByID("expenseUserInput"),
            addExpenseForm:DOMHelper.getElementByID("addExpenseForm"),
            txtExpenseAmount:DOMHelper.getElementByID("txtExpenseAmount"),
            txtExpenseDescription:DOMHelper.getElementByID("txtExpenseDescription"),
            paymentList:DOMHelper.getElementByID("paymentList"),
            splitfyBtn:DOMHelper.getElementByID("splitfyBtn"),
            resultArea:DOMHelper.getElementByID("resultArea"),
            AmountsSpan:DOMHelper.getElementByID("AmountsSpan"),
            btnExport:DOMHelper.getElementByID("btnExport"),
            importJsonFile:DOMHelper.getElementByID("importJsonFile"),
            displayUsers:DOMHelper.getElementByID("displayUsers")
        }
    }

    bindEvents(){
        this.elements.addUserForm.addEventListener('submit',(e)=>{
            this.handleAddUser(e);
        })

        this.elements.addExpenseForm.addEventListener("submit",(e)=>{
            this.handleAddExpense(e);
        })

        this.elements.splitfyBtn.addEventListener('click',()=>{
            //here we are not submitting form, so 'event' parameter not require
            this.handleSimplifyLogicToSplit();
        })

        this.elements.btnExport.addEventListener('click',()=>{
            this.exportDataHandler();
        })

        this.elements.importJsonFile.addEventListener('change',(e)=>{
            //console.log(e);
            this.importDataFromFile(e);
            
        })
    }

    displayUsers(){
        this.elements.displayUsers.innerHTML=`<span>Users (<b>${this.userService.getUsersCount()}</b>) : ${this.userService.getAllUsers().map(user=>user.name).join(", ")}</span>`;
    }
    handleAddUser(event){
        //form submit default functionality need to prevent, otherwise page will refresh after form submit
        event.preventDefault();
        try{
            //get the user provided username
            const name=this.elements.txtUser.value.trim();
            //check if user name provided in txt box or not
            if(!name){
                throw new Error("User name is mandatory");
            }
            //store user in user service collection
            const user=this.userService.addUser(name);

            //add user name to select box
            this.addUserToSelectBox(user.name);

            //reset the form
            this.elements.addUserForm.reset()
            this.displayUsers();
            showingSuccessToast(`User ${user.name} added`);
        }catch(error){
            console.error("Error adding User:",error);
            showingErrorToast(error.message);
        }
    }
    initializeSelectBox(){
        const defaultValue=DOMHelper.createOption("--Select User--","");    //no need to handle this value in select
        this.elements.expenseUserInput.add(defaultValue);
    }

    initializeAmount(){
        this.elements.AmountsSpan.innerHTML=`<span>Amount: <b>${this.expenseService.getTotalAmount()}</b><span> | <span>Settlement Amount: <b>${this.expenseService.getSettlementAmount()}</b></span>`
    }

    addUserToSelectBox(userName){
        const option=DOMHelper.createOption(userName,userName);
        this.elements.expenseUserInput.add(option);
    }

    handleAddExpense(event){
        event.preventDefault(); //disable default functionalities
        try{
            const paidBy=this.elements.expenseUserInput.value.trim();
            const amount=this.elements.txtExpenseAmount.valueAsNumber;
            const description=this.elements.txtExpenseDescription.value.trim();

            if(!paidBy){
                throw new Error("Please select a user");
            }

            if(!amount || amount<=0){
                throw new Error("Please enter an amount greater than zero");
            }

            //add expense to the expense service collection
           const expense=this.expenseService.addExpense(paidBy,amount,description);
           
           //render expenses to the All Payments box
            this.renderExpense(expense);
           //reset the expense form
            this.elements.txtExpenseAmount.value="";
            this.elements.txtExpenseDescription.value="";

           //show toast to new expense
           showingSuccessToast(`Expense ₹${expense.amount} added by ${expense.paidBy}`);
        }catch(error){
            console.error("Error adding Expense:",error);
            showingErrorToast(error.message);
        }
    }

    renderExpense(expense){
        let text="";
        if(expense.description !=="" && expense.description !=="No Description"){
            text=`${expense.paidBy} paid ₹${expense.amount} for ${expense.description}`;
        }else{
            text=`${expense.paidBy} paid ₹${expense.amount}`
        }
        this.initializeAmount();
        const li=DOMHelper.createListItem(text,"expense-item");
        this.elements.paymentList.appendChild(li);
    }

    handleSimplifyLogicToSplit(){
        try{
           const results=this.expenseService.simplifyExpenses();
           if(results.length===0 && this.expenseService.getTotalAmount()===0){
            return;
           }else{
            this.DisplayResults(results);
           }
        }catch(error){
            console.error("Error simplifying Expenses:",error);
            showingErrorToast(error.message);
        }
    }
    DisplayResults(results){
        //console.log(results);
        DOMHelper.clearElement(this.elements.resultArea);   //clear result area first
        if(results.length===0){
            const noResultsItem=DOMHelper.createListItem("All expenses are settled!","no-result");
            this.elements.resultArea.appendChild(noResultsItem);
            return;
        }
        DOMHelper.appendFragment(this.elements.resultArea,results,(result)=>{
            //console.log(result);
            return DOMHelper.createListItem(result,'settlement-result');
        })
    }

    exportDataHandler(){
        try{
            this.exportAndImport.exportDataLink();
        }catch(error){
            console.error("Error exporting data:",error);
            showingErrorToast(error.message);
        }
    }

    async importDataFromFile(event){
        try{
            //console.log(event);
        const expensesData=await this.exportAndImport.importFromFile(event.target.files[0]);
        //console.log(expensesData.users);
       if(expensesData.users.length===0 && expensesData.expenses.length===0){
            showingErrorToast("No data to import");
       }else{
         const users=this.userService.addUsersFromCollection(expensesData.users); //add users to user service collection
        DOMHelper.appendFragment(this.elements.expenseUserInput,users,(user)=>{
            return DOMHelper.createOption(user.name,user.name);
        })
        const expenses=this.expenseService.addExpensesFromCollection(expensesData.expenses); //add expenses to expense service collection
        DOMHelper.appendFragment(this.elements.paymentList,expenses,(expense)=>{
            let text="";
            if(expense.description !=="" && expense.description !=="No Description"){
                text=`${expense.paidBy} paid ₹${expense.amount} for ${expense.description}`;
            }else{
                text=`${expense.paidBy} paid ₹${expense.amount}`
            }
            return DOMHelper.createListItem(text,"expense-item");
        });
        this.displayUsers();
        this.initializeAmount();
        showingSuccessToast("Data imported successfully");
       }
        }catch(error){
             console.error("Error importing data:",error);
            showingErrorToast("importing data failed, please select valid .json file");
        }
        
    }
}