/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var eventQueuePrefix = "EventQueue_";  
var processDefinitionPrefix = "ProcessDef_";
var processPrefix = "Process_";
var activityPrefix = "Activity_";
var NOT_RUNNING = "not_running"; 
var RUNNING = "running";
var DONE = "done";
var CANCELLED = "cancelled";   							