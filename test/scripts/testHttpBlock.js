/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 /*#*beginblockly*#*<xml xmlns="http://www.w3.org/1999/xhtml"><block type="scriptr_return" id="1" inline="false" x="-182" y="102"><value name="return"><block type="scriptr_callhttp" id="2" inline="false"><field name="url">https://api.scriptr.io/test01</field><field name="method">GET</field><value name="parameters"><block type="lists_create_with" id="3" inline="false"><mutation items="4"></mutation><value name="ADD0"><block type="list_dict" id="4" inline="true"><field name="KEY">start</field><value name="myVALUE"><block type="text" id="5"><field name="TEXT">368</field></block></value></block></value><value name="ADD1"><block type="list_dict" id="6" inline="true"><field name="KEY">end</field><value name="myVALUE"><block type="text" id="7"><field name="TEXT">Bata</field></block></value></block></value><value name="ADD2"><block type="list_dict" id="8" inline="true"><field name="KEY">sQuery</field><value name="myVALUE"><block type="text" id="9"><field name="TEXT">ahbal</field></block></value></block></value><value name="ADD3"><block type="list_dict" id="13" inline="true"><field name="KEY">apsws.time</field><value name="myVALUE"><block type="text" id="14"><field name="TEXT">1426284484144</field></block></value></block></value></block></value><value name="headers"><block type="lists_create_with" id="10" inline="false"><mutation items="1"></mutation><value name="ADD0"><block type="list_dict" id="11" inline="true"><field name="KEY">AuthoRization</field><value name="myVALUE"><block type="text" id="12"><field name="TEXT">bearer TDIyODI2REM5MTpzY3JpcHRyOjBCMERBNzgyOTRFRTQwODI0RjdGM0ZGMjU5QzgwREVG</field></block></value></block></value></block></value></block></value></block></xml>*#*#*/
return require("http").request({"url": "https://api.scriptr.io/test01" , "method": "GET", "params": {"start": "368",
	"end": "Bata",
	"sQuery": "ahbal",
	"apsws.time": "1426284484144"}, "headers": {"AuthoRization": "bearer TDIyODI2REM5MTpzY3JpcHRyOjBCMERBNzgyOTRFRTQwODI0RjdGM0ZGMjU5QzgwREVG"}})   							