export class Expense{
    constructor(paidBy,amount,description='No Description'){
        if(!paidBy || typeof paidBy !=="string"){
            throw new Error("PaidBy must be non-empty string");
        }
        if(!amount || typeof amount !=="number" || amount<=0){
            throw new Error("Amount must be positive integer");
        }
        this.paidBy=paidBy.trim();
        this.amount=parseFloat(amount.toFixed(2));
        this.description=description;
        this.createdAt=new Date().toISOString();
        this.id=this.generateId();
    }
    generateId(){
        return crypto.randomUUID();
    }
}