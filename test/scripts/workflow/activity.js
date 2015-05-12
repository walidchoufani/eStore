/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var common = require("workflow/common");
var util = require("workflow/util");

/**
 * base Activity class. mainly contains data as all logic is usually
 * implemented in the class definition.
 * @class Activity
 * @contructor Activity
 * @param {Object} dto : parameters to initialize the activity instance
 *	{String} processId : the identifier of the process instance to which the current instance belongs (mandatory)
 *	{Object} activityDefinition : the activity definition (ActivityDefinition) related to this activity instance (mandatory)
 *	{String} id : optional, unless your are recreating a persisted activity instance
 *	{String} status: the status of the activity instance, to be passed only when your are recreating a persisted activity instance
 */
function Activity(dto) {
  
  if (!dto || (!dto.processId && !dto.activityDefinition)) {
    
  	throw {
      	
      	"errorLocation":  "Activity line 17",
    	"errorCode": "Invalid_Parameter",
        "errorDetail": "dto cannot be null or empty"
    }
  }
  
  this.processId = dto.processId;
  this.activityDefinition = dto.activityDefinition;
  this.iterateWhile = dto.iterateWhile;
  if (this.iterateWhile && this.iterations) {
    
    throw {
      	
      	"errorLocation":  "Activity line 35",
    	"errorCode": "Invalid_Parameter",
        "errorDetail": "you cannot define a value for iterations and iterateWhile at the same time for the same activity"
    }
  }
  
  if (!dto.id) {
    this._create(dto);
  }else {
    this._reconstruct(dto)
  }
}

/**
 * invokes the execute method implemented by the activity definition then any bespoke logic contained 
 * in the current activity (in the "execute" method of the Activtiy instance). Once execution is done
 * the method invoke the fireEvent(params) method.
 * the status of the activity is switched to running during the execution and to done or cancelled after it.
 * @method run
 * @param {Array} events : the array of the events related to the process instance to which the activity belongs 
 */
Activity.prototype.run = function(events) {
    var exit = 0;
  	console.log("activity " + this.id + " running");
  	this.status = common.RUNNING;
  	do {
    	
      this.activityDefinition.execute();
      this.execute();
      exit++;
    } while (this._loop() && exit < 5);
    
 	this.status = common.DONE;
    return this.fireEvent();
};

/**
 * you can redefine this method if you need to add bespoke behavior to the current activity instance
 * (i.e not the behavior defined in the "execute" method of the related activity definition)
 * @method execute
 * @param {Object} data: optional data parameters
 */
Activity.prototype.execute = function(data) {
};

/**
 * this method is automatically invoked by run() once the latter is done executing. 
 * it should be overriden in case you need to fire an event that is different than "activity_done".
 * @method fireEvent
 * @param {Object} params :  use this parameter to pass any values to the method when overriding it
 */
Activity.prototype.fireEvent = function(params) {
  
  var event = {
    
  	"processId": this.processId,
    "name": this.activityDefinition.name + "_" + common.DONE
  }
  
  return event;
  //var engine = require("workflow/engine");
  //engine.addEvent(event);
};

/**
 * create a new activity instance and set its status to not running
 * @method _create
 * @param {Object} dto : initialization parameters
 */
Activity.prototype._create = function(dto) {
  
  this.status = common.NOT_RUNNING;
  this.id = common.activityPrefix + util.getGuid();
};

/**
 * reconstruct the activity instance from persisted data
 * @method _reconstruct
 * @param {Object} dto : initialization parameters
 */
Activity.prototype._reconstruct = function(dto) {
   
  this.status = dto.status;
  this.id = dto.id;
};

/** 
 * verify if the loop condition is true or false
 * @method _loop
 * @return {Boolean} true/false
 */
Activity.prototype._loop = function() {
 	
  if (this.activityDefinition.iterations) {
  
	this._counter = this._counter ? this._counter++ : this._counter = 0; // initialize or increment an internal counter
    console.log("Iterations " +  this.activityDefinition.iterations  + " counter " + this._counter)
    return this._counter <= this.activityDefinition.iterations;
  }
  
  if (this.activityDefinition.iterateWhile) {
    return eval(this.activityDefinition.iterateWhile);
  }
};     							