var toDoList = (function () {
    var toDoListArray = [], toDoId = 0;
    var selectedElement, selectedParentElement, toDoItemId, toDoStatus=false;

    retrieveLocalStorage();

    function ToDoConstructor(toDoText, toDoId, toDoStatus) {
        this.toDoText = toDoText;
        this.toDoId = toDoId;
        this.toDoStatus = toDoStatus;
        this.toDoChecked = false;
    }

    ToDoConstructor.prototype.updatingArray = function(toDoItemId) {
        for(var i = toDoItemId; i < toDoListArray.length; i++) {
            document.querySelector(`[toDoId="${toDoListArray[i].toDoId}"]`).setAttribute("toDoId",`${toDoListArray[i].toDoId-1}`);
            toDoListArray[i].toDoId -= 1;
            localFun(toDoListArray);
        }
    }

    ToDoConstructor.prototype.toDoDone = function(selectedElement) { 
      switch(this.toDoStatus) {
        case false:
                 selectedElement.classList.remove('list');
                 selectedElement.classList.add('list_changed');  
                 event.target.textContent="DEACTIVE"
                 this.toDoStatus = true;
                 break;
        case true:
                 selectedElement.classList.remove('list_changed'); 
                 selectedElement.classList.add('list');  
                 event.target.textContent="ACTIVE"
                 this.toDoStatus = false;
                  break;
      }
      localFun(toDoListArray);
    } 

    ToDoConstructor.prototype.toDoDelete= function(toDoItemId) {
        selectedParentElement=document.querySelector(`[todoId="${toDoItemId}"]`);
        selectedParentElement.remove();
        toDoListArray.splice(toDoItemId,1);
        this.updatingArray(toDoItemId);
        toDoId--;
        localFun(toDoListArray);
    }

    ToDoConstructor.prototype.toDoUpdate = function(toDoItemId,selectedElement) {
        var updateFromPrompt = prompt("enter to update"," ");
        selectedElement.textContent += updateFromPrompt;
        this.toDoText = selectedElement.textContent;
        localFun(toDoListArray);
    }

    var textEntered = document.getElementById("textbox");
    document.getElementById("add_button").addEventListener('click', toAdd);
    document.addEventListener('keypress', KeyPress);

    function KeyPress(event) {
         if(event.keyCode === 13 || event.which === 13)
         toAdd();
    }

    function toAdd() {
        var descriptionToBeAdded;
        descriptionToBeAdded = textEntered.value;
        if(descriptionToBeAdded == " ") {
           var textFromPrompt = prompt("enter something"," ");
           descriptionToBeAdded = textFromPrompt;
        }
        var item = document.querySelector(".inner_div");
        var clone = item.cloneNode(true);
        clone.querySelector('[data-list="list"]').textContent = descriptionToBeAdded;
        clone.setAttribute("toDoId",toDoId);
        clone.classList.remove("inner_div");
        clone.classList.add("div_list");
        var toDoElement = new ToDoConstructor(descriptionToBeAdded,toDoId,toDoStatus);
        toDoListArray.push(toDoElement);
        localFun(toDoListArray);
        document.querySelector(".bottom").appendChild(clone);
        textEntered.value = " ";
        toDoId++;
        
    }

    document.getElementById("delete_selected_button").addEventListener('click', deleteSelected);

    function deleteSelected() {
        for(var j = toDoListArray.length - 1; j >= 0; j--) {
            selectedParentElement = document.querySelector(`[todoId="${j}"]`);
            if(selectedParentElement.querySelector('[data-check="check"]').checked) {
               toDoListArray[j].toDoChecked = true;
               toDoListArray[j].toDoDelete(j);
            }
        }
        localFun(toDoListArray);
    }

    document.getElementById("delete_all").addEventListener('click',deleteAll);
    function deleteAll() {
       for(var j = toDoListArray.length - 1; j >= 0; j--)
         {
           toDoListArray[j].toDoDelete(j);
         }
    }

    document.getElementById("bottom_div").addEventListener('click', listHandler);
     
    function listHandler(event) {
            toDoItemId = event.target.parentElement.getAttribute("toDoId");
            selectedParentElement = document.querySelector(`[todoId="${toDoItemId}"]`);
            selectedElement = selectedParentElement.querySelector('[data-list="list"]');
            switch(event.target.getAttribute("data-type")) {
                case "done":
                     toDoListArray[toDoItemId].toDoDone(selectedElement);
                     break;
                case "delete":
                     toDoListArray[toDoItemId].toDoDelete(toDoItemId);
                     break;
                case "update":
                     toDoListArray[toDoItemId].toDoUpdate(toDoItemId,selectedElement);
                     break;
                default: break;
            }
    };
    function localFun(toDoListArray)
    {
        var string=JSON.stringify(toDoListArray);
        localStorage.setItem("todos",string);
    }

    function retrieveLocalStorage()
    {
        var data;
        if (localStorage.getItem('todos')) {
            data = JSON.parse(localStorage.getItem('todos'));
          } else {
            data = [];
          }
          
          data.forEach(item => {
            text = item.toDoText;
            id=item.toDoId;
            status=item.toDoStatus;
            listMaker(text,id,status);
          });
    }
    function listMaker(text,id,status){
        switch(status) {
            case "true": status = true;
                    break;
            case "false": status = false;
                    break;
            default: status= false;
        }
        var item = document.querySelector(".inner_div");
        var clone = item.cloneNode(true);
        clone.querySelector('[data-list="list"]').textContent = text;
        clone.setAttribute("toDoId",id);
        clone.classList.remove("inner_div");
        clone.classList.add("div_list");
        var toDoElement = new ToDoConstructor(text,id,status);
        toDoListArray.push(toDoElement);
        if(status)
        {
            clone.querySelector('[data-list="list"]').classList.remove('list');
            clone.querySelector('[data-list="list"]').classList.add('list_changed');
            clone.querySelector('[data-type="done"]').textContent="DEACTIVE"
        }
        else{
            clone.querySelector('[data-list="list"]').classList.remove('list_changed');
            clone.querySelector('[data-list="list"]').classList.add('list');
            clone.querySelector('[data-type="done"]').textContent="ACTIVE"
        }
        document.querySelector(".bottom").appendChild(clone);
        toDoId++;  
    }

})();

toDoList;



