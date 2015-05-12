/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 /**
 * @class ActivityDefinition
 * @constructor ActivityDefinition
 * @param {Object} dto
 * 	{String} name : the name of the Activity
 *	{String} startCondition : the condition to be verified in order to trigger an instance of this activity.
 *	start conditions can contain one event or a combination of events using either & or || but not both
 *	ex: "endOfA1 && endOfA2" (join on two activities), "endOfA1 || someEvent"
 *	{Numeric} iterations: set this to the number of times you need the instances of this activity to execute - sequentially (optional,
 * 	cannot be used in combination to iterateWhile)
 *	{String} iterateWhile: set this to a condition that will cause the activity instance to execute n times sequentially, until
 * 	the condition is not verified anymore (optional, cannot be used in combination to iterations). The condition should evaluate
 *  the value of global store objects and/or global store objects properties:
 *  example: storage.global.registration.name == "x" &&  storage.global.n > 10
 */
function ActivityDefinition(dto) {

  if (!dto || (!dto.name)) {
    
  	throw {
      
    	"errorLocation":  "ActivityDefinition line 6",
      	"errorCode": "Invalid_Parameter",
        "errorDetail": "dto cannot be null or empty"
    }
  }
  
  this.name = dto.name;
  this.startCondition = dto.startCondition ? dto.startCondition.trim() : "";
  this.iterations = dto.iterations;
  this.iterateWhile = dto.iterateWhile;
}

/**
 * persist the current activity definition instance into the global store
 * @method persist
 */
ActivityDefinition.prototype.persist = function() {
  storage.global.workflow[this.name] = this;
}

/**
 * verify that the start condition needed to start the activity instance related to this \
 * definition is met
 * @method startConditionMet
 * @param {Array} events:  the array of events fired for the current process
 */
ActivityDefinition.prototype.startConditionMet = function(events) {

  var all = true;
  var eventArray = this.startCondition.split(" ");
  var operator = eventArray.indexOf("&&") > -1 ? "&&" : eventArray.indexOf("||") > -1 ? "||" : "";
  if (operator) {
     
    for (var i = 0; i < eventArray.length; i++) {

      var evt = eventArray[i];
      if (evt != "&&" && evt != "||") {         
        all = (operator == "&&") ? events.indexOf(evt) > -1 && all : events.indexOf(evt) > -1 || all; 
      }
    }
    
    return all;
  }else {
    
    var found = false;
    for (var i = 0; i < events.length && !found; i++) {
      
      var evt = events[i];
      found = events[i] == this.startCondition;
    }
    
    return found;
  }
};

/**
 * this method should be overriden by sub-classes or by instance of ActivityDefinition (extension)
 * @method execute
 */
ActivityDefinition.prototype.execute = function() {
  
};   				   				   				   							