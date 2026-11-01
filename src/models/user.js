export class User{
    constructor(name,id=null){
        if(!name || typeof name !=="string"){
            throw new Error("name must be non-empty string");
        }
        this.name=name.trim();
        this.id=(id===null)?this.generateId():id;
    }
    generateId(){
        return crypto.randomUUID();
    }
}