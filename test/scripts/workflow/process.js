/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var common = require("workflow/common");
var util = require("workflow/util");
var activityModule = require("workflow/activity");

/**
 * create a new process definition (process template)
 * @class Process
 * @constructor Process
 * @param {Object} dto : initialization parameters to create the process instance
 * 	{String} processDefinitionName : the name of the process definition to relate to the current process instance (optional if id is provided)
 *	{String} id : the identifier of a persisted process instance to use to initialize the current instance
 *	{Array} events : new events to handle by the process instance, to be added to existing events if the instance was persisted before (optional)
 */
function Process(dto) {
  
  this.activities = [];
  this.id = "";
  this.events = [];
  this.processDefinition = null;
  
  if (!dto) {
    
  	throw {
    	"errorLocation":  "Process line 20",
      	"errorCode": "Invalid_Parameter",
        "errorDetail": "dto cannot be null"
    }
  }
 
  if (!dto.processDefinitionName && !dto.id) {
    
    throw {
    	"errorLocation":  "Process line 29",
      	"errorCode": "Invalid_Parameter",
        "errorDetail": "You need provide either a process id or a process definition name in the dto parameter"
    }
  }
  
  // if the process was already instanciated, we need to re-construct it from its data in the store
  if (dto.id) {
    
    this.id = dto.id;
    this._load(dto.id); // load persisted process data from store
    this.events = dto.events ? this.events.concat(dto.events) : this.events; //merge events with queued process events
  }else {
  	
    this._create(dto);
  	this.events = dto.events ? dto.events : [];  
  }
  
  this.persist();
}

/**
 * loop through the list of not running activities and ask every activity that has a verfied
 * condition to run. this model is only sustainable if all activities generate an event after run()
 * is done. in the case where run() did not yield to the end of the activity, such as in the case
 * of a human activity for example, the activity still has to fire an event (such as "activityN_running")
 * It is up to the process to check if its start condition is met before running the activity.
 * @method run
 */
Process.prototype.run = function() {
  
  var activitiesToRun = this.activities;
  var firedEvents = [];
  
  // search for the first next activity that has a verify start condition and execute it, then persist.
  // only run one activity per run() invocation
  for (var i = 0; i < activitiesToRun.length; i++) {
    
    if (activitiesToRun[i].status == common.NOT_RUNNING && activitiesToRun[i].activityDefinition.startConditionMet(this.events)) {    	
      
      var event = activitiesToRun[i].run(this.events);
      firedEvents.push(event);
    }
  }
  
  var engine = require("workflow/engine");
  engine.addEvents(firedEvents);
  this.persist();
};

/**
 * serialize this process instance into the global store
 * @method persist
 */
Process.prototype.persist = function() {
  
  delete this.processDefinition;
  storage.global.workflow[this.id] = this;
  console.log("Persisted process  " +  this.id + "  " + JSON.stringify(this));
};

/**
 * create a process instance and all its activities using the definition of the process
 * create an event queue in the global store such as key = "EventQueue_theProcessId"
 * @method _create
 * @param {Object} initDTO : an object for initializing the process instance
 */
Process.prototype._create = function(initDTO) {
  
  this.id = common.processPrefix + util.getGuid();
  var queueName = common.eventQueuePrefix +  this.id;
  storage.global.workflow[queueName] = []; // initialize an event queue for this process instance
  this.processDefinition = storage.global.workflow[initDTO.processDefinitionName];
  this.processDefinitionName = initDTO.processDefinitionName;
  var activityDefinitionNames = Object.keys(this.processDefinition.activityDefinitions);
  for (var i = 0; i < activityDefinitionNames.length; i++) {
    
    var dto = {
          
      "processId": this.id,
      "activityDefinition": this.processDefinition.activityDefinitions[activityDefinitionNames[i]]
    };
  
    this.activities.push(new activityModule.Activity(dto));
  }
}

/**
 * reconstruct a process instance from its persisted data in the store
 * @method _load
 * @param {String} id :  the identifier of the process instance to load from the store
 */
Process.prototype._load = function(id) {
  
  // load the process instance's data from the store
  var processData = storage.global.workflow[id];
  if (!processData) {

    throw {
      
	  "errorLocation":  "Process line 113", 
      "errorCode": "ProcessInstance_Error",
      "errorDetail": "Could not retrieve process instance " +  dto.processId
    }
  }

  this.processDefinitionName = processData.processDefinitionName;
  this.processDefinition = storage.global.workflow[processData.processDefinitionName];
  
  // create activity instances using the process' data
  for (var i = 0; i < processData.activities.length; i++) {
    this.activities.push(new activityModule.Activity(processData.activities[i]));
  }

  // load events
  this.events = processData.events;
};

/**
 * remove the serialized data of the process (if any) from the global store
 * @method _cleanup
 */
Process.prototype._cleanup = function() {
  
  var key = common.processPrefix + this.id
  if (storage.global.workflow[key]) {
    storage.gloabal.workflow[key].delete;
  }
};				   				   							