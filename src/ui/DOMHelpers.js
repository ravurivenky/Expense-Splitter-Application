export class DOMHelper {
    static getElementByID(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with ${id} not found`);
        }
        return element;
    }

    static createOption(text,value){
        //we can do validations here.
        return new Option(text,value);
    }
    
    static createListItem(text,className=''){
        const li=document.createElement('li');
        li.textContent=text;
        if(className !==''){
            li.className=className;
        }
        return li;
    }

    static clearElement(element){
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
    }

    static appendFragment(parent,items,createItemFun){
        //create a document fragment to store our result
        const fragment=document.createDocumentFragment();
        items.forEach(item=>{
            const li=createItemFun(item);
            fragment.appendChild(li);
        })
        return parent.appendChild(fragment);
    }
}
