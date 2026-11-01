import {UserService} from '../services/UserService';
import {ExpenseService} from '../services/ExpenseService';
import {showingSuccessToast,showingErrorToast} from '../utilis/toastUtil';
export class ExportAndImport{
    constructor(userService,expenseService){
        this.userService=userService;
        this.expenseService=expenseService;
    }
     JSONData(){
        return {
            users:this.userService.getAllUsers(),
            expenses:this.expenseService.getAllExpenses(),
            exportDate:new Date().toISOString()
        }
    }

    exportDataLink(){
        const data=this.JSONData();
        if(data.users.length===0 && data.expenses.length===0){
            showingErrorToast("No data to export");
        }else{
            
        //convert object to json
        const jsonData=JSON.stringify(data,null,4);

        //create JSON file
        const blob=new Blob([jsonData],{type:"application.json"});

        //generate download URL
        const url=URL.createObjectURL(blob);

        //create download link
        const link=document.createElement("a");
        link.href=url;
        link.download=`ExpenseSplitter_${new Date().toISOString()}.json`;

        //trigger download
        document.body.appendChild(link);
        link.click();

        //cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showingSuccessToast("Data exported successfully");
        }
    }

    async importFromFile(file){
        let importedData;
        //file not there then return
        if (!file) return;

        // 1. Validate file extension
        if (!file.name.toLowerCase().endsWith(".json")) {
            throw new Error("Please select a valid JSON file.");
        }
        try{
            //read file content
            const fileContent=await file.text();

            //parse JSON
            importedData=JSON.parse(fileContent);

        }catch(error){
            throw new Error("Importing failed, please select valid .json file"+error.message);
        }
        return {
            users:importedData.users,
            expenses:importedData.expenses
        }
    }
}