/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=anonymous 
  **/ 
 
 var start = request.parameters["start"];
var end = request.parameters["end"];
var squery = request.parameters["sQuery"];

var pragma = request.headers["Pragma"];
var authorization = request.headers["Authorization"];

return "<!DOCTYPE html><html><head><title>test02</title></head><body><h3>Request</h3><p><b>HTTP Request:</b> " + JSON.stringify(request) + "</p></br></br><h3>Request Headers</h3><p><p><b>Authorization:</b> " + authorization + "</p><p><b>Pragma:</b> " + pragma + "</p></br></br><h3>Request Parameters</h3><p><b>start:</b> " + start + "</p><p><b>end:</b> " + end + "</p><p><b>squery:</b> " + squery + "</p></br></br></body></html>";   							   				   							