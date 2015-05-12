/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var common = require("workflow/common");
var processModule = require("workflow/process");

function init() {

  if (!storage.global.workflow) {
  	storage.global.workflow = {};
	}
}

function addEvents(events) {

  if (!events || events.length == 0) {
    
    throw {
      "errorCode": "Invalid_Parameter",
      "errorDetail": "The event array cannot be null or empty"
    }
  }
      
  var id = common.eventQueuePrefix + events[0].processId;
  if (!storage.global.workflow[id]) {
    storage.global.workflow[id] = []; 
  }
  
  //storage.global.workflow[id].concat(events);
  
  // inform the process instance about the occurrence of the event
  var processInstanceData = storage.global.workflow[events[0].processId];
  var eventNames = [];
  for (var i = 0; i < events.length; i++) {
  	eventNames.push(events[i].name);
  }
  
  if (processInstanceData) {
   
    var dto = {
      "id": processInstanceData.id,
      "events": eventNames
    };
    
    console.log("engine.Pushed events: " + JSON.stringify(dto));
    var processInstance = new processModule.Process(dto);
    processInstance.run();
  }
}   				   			

function addEvent(event) {

  if (!event || !event.processId || !event.name) {
    
    throw {
      "errorCode": "Invalid_Parameter",
      "errorDetail": "An event cannot be null or empty"
    }
  }
      
  var id = common.eventQueuePrefix + event.processId;
  if (!storage.global.workflow[id]) {
    storage.global.workflow[id] = []; 
  }
  
  storage.global.workflow[id].push(event.name);
  
  // inform the process instance about the occurrence of the event
  var processInstanceData = storage.global.workflow[event.processId];
  if (processInstanceData) {
   
    var dto = {
      "id": processInstanceData.id,
      "events": [event.name]
    };
    
    console.log("engine.Pushed event: " + JSON.stringify(dto));
    var processInstance = new processModule.Process(dto);
    processInstance.run();
  }
}   				   				   				   				   							