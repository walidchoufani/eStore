/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var activityModuleDefinition = require("workflow/activityDefinition");

function HumanActivityDefinition() {
  
}

HumanActivityDefinition.prototype = new activityModuleDefinition.ActivityDefinition()
HumanActivityDefinition.prototype.constructor = HumanActivityDefinition;

HumanActivityDefinition.prototype.execute = function() {
  
}   							