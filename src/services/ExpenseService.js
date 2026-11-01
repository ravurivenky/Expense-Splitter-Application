import {Expense} from '../models/expense.js';
import {showingSuccessToast,showingErrorToast} from '../utilis/toastUtil';

export class ExpenseService{
    constructor(userSerive){    //injecting the service
        this.expenses=[];
        this.userSerive=userSerive;
    }

    addExpense(paidBy,amount,description){
        if(!this.userSerive.hasUser(paidBy)){
            throw new Error("User doesn't exists!");
        }
        const expense=new Expense(paidBy,amount,description);
        this.expenses.push(expense);
        return expense;
    }

    getAllExpenses(){
        return [...this.expenses];  //everytime/everyrequest a new array will return
    }

    getExpenseByUser(userName){
        return this.expenses.filter((expense)=>expense.paidBy===userName);
    }

    clearExpenses(){
        this.expenses=[];
    }

    simplifyExpenses(){
        //step:1: calculate what each person should pay
        //venky=>300
        //gopi=>150
        //siva=> 450
        //Total=>900
        //TotalUsers=>3
        //shared per person => 900/3=300
       
        //step:2: figure out who owes money and who should receive money
        //Now balance:
        //venky=> 300paid, so 0-balance
        //gopi=> 150paid, so owes 150-balance
        //siva=>450paid, so recieve 150-balance

        //step:3: match people who owe money with people who should receive money
        //gopi owes 150 => siva should receive 150
        //Result: [gopi owes siva 150,etc..]

       const usersCount=this.userSerive.getUsersCount();
       if(usersCount===0){
        return [];
       }

       const userNames=this.userSerive.getUserNames();
       const net={};
       userNames.forEach(userName=>{
        net[userName]=0;    //initial net balance is '0' for all users
       })

       this.expenses.forEach(expense=>{
        const share=expense.amount/usersCount;  //for each person how much share to the current expense

        userNames.forEach(userName=>{
            if(userName===expense.paidBy){
                net[userName] +=(expense.amount-share);
            }else{
                net[userName] -=share;
            }
        })
       })

       return this.calculateSettlements(net);
    }

    calculateSettlements(usersNet){
        //console.log(usersNet);
        const results=[];

        //step:1: filtering out balanced peoples(whoevers balance is zero, remaining peoples should settle)
        const names=Object.keys(usersNet).filter((name)=>{
            return Math.abs(usersNet[name])>0.01
        });

        //step:2 sort by balance(low to high)
        names.sort((a,b)=>usersNet[a]-usersNet[b]);

        //step:3: two-pointer technique(identify the person who owes the most money versus the person who has to receive the money)(pair-up the opposite values)
        let i=0; //points to person who owes most money
        let j=names.length-1;   //points to person who receieve most money

        //loop until last person
        while(i<j){
            const creditor=names[j];    //who should receive the money      
            const debtor=names[i];      //who should give the money
            const settlement=Math.min(-usersNet[debtor],usersNet[creditor]);
            if(settlement>0.01){
                usersNet[debtor] += settlement;
                usersNet[creditor] -=settlement;
                results.push(`${debtor} owes ${creditor} ₹${settlement.toFixed(2)}`);
            }
            if(Math.abs(usersNet[debtor])<0.01) i++;    //debtor is settled, move to the next
            if(Math.abs(usersNet[creditor])<0.01) j--;  //creditor is settled, move to previous
        }
        return results;
    }

    getTotalAmount(){
        let toatl=0;
        this.expenses.forEach(expense=>{
             toatl+=parseFloat(expense.amount);
        })
        return toatl;
    }

    getSettlementAmount(){
        let settlemt=0;
        if(this.expenses.length>0){
            settlemt=this.getTotalAmount()/this.userSerive.getUsersCount();
        }else{

        }
        return settlemt.toFixed(2);
    }

    addExpensesFromCollection(expenses){
        expenses.forEach(expense=>{
            if(!this.userSerive.hasUser(expense.paidBy)){
                showingErrorToast(`User ${expense.paidBy} doesn't exists, so skipping expenses with that user.`);
            }else{
                const expenseDetails=new Expense(expense.paidBy,expense.amount,expense.description,expense.id);
                this.expenses.push(expenseDetails);
            }
        })
        return expenses.filter(expense=>this.userSerive.hasUser(expense.paidBy));  //return only those expenses which are added to our collection.
    }
}