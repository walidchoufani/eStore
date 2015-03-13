/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 var l = require("log");
l.setLevel("debug");
l.info("{ \"<b>alert</b>\" : \"<script>alert(\"123\")</script>\" }");
l.warn("{ \"<b>name</b>\" : \"abou Ali\" }");

l.info("{ \"<b>name</b>\" : \"abou Ali\" }");

l.error("{ \"<b>name</b>\" : \"abou Ali\" }");


l.info("{ \"<b>name</b>\" : \"abou Ali\" }");
return { "name" : "abou Ali" };      				   				   				   							