import {User} from '../models/user.js';
import {showingSuccessToast,showingErrorToast} from '../utilis/toastUtil';
export class UserService{
    constructor(){
        //store users, we need a collection, for that we are using Map
        this.users=new Map();
    }

    //add user
    addUser(name){
        if(!name){
            throw new Error("User Name is required!");
        }
        name=name.trim();
        if(this.users.has(name)){
            throw new Error("User alredy exists.");
        }
        const userDetails=new User(name);
        this.users.set(name,userDetails);
        return userDetails;
    }

    //get user
    getUser(name){
        return this.users.get(name);
    }

    //get all users
    getAllUsers(){
        return Array.from(this.users.values());
    }

    //get all users names
    getUserNames(){
        return Array.from(this.users.keys());
    }

    //user exists in our collection
    hasUser(name){
        return this.users.has(name);
    }

    getUsersCount(){
        return this.users.size;
    }

    clearUsers(){
        this.users.clear();
    }

    addUsersFromCollection(users){   
        const finalUsers=[];
        users.forEach(user=>{
            if(this.hasUser(user.name)){
                showingErrorToast(`User ${user.name} already exists, so skipping it.`);
            }else{
            finalUsers.push(user);
            const userDetails=new User(user.name,user.id);
             this.users.set(user.name,userDetails); 
            }      
        })    
        return finalUsers;
    }
}