var datatable = null;
var db = openDatabase("MyData","","My Database",1024*100);


function init(){
    if (localStorage.hatch==undefined){localStorage.hatch = "0";}
    if (localStorage.luck==undefined){localStorage.luck = "1";}
    if (localStorage.normal==undefined){localStorage.normal = "0";}
    if (localStorage.rare==undefined){localStorage.rare = "0";}
    if (localStorage.superRare==undefined){localStorage.superRare = "0";}
    if (localStorage.superiorSuperRare==undefined){localStorage.superiorSuperRare = "0";}
    if (localStorage.ratio==undefined){localStorage.ratio = "5";}
    datatable = document.getElementById("datatable");
    document.getElementById("hatchProgress").innerHTML = "Progress: "+localStorage.hatch+"%";
    document.getElementById("normal").innerHTML = localStorage.normal;
    document.getElementById("rare").innerHTML = localStorage.rare;
    document.getElementById("superRare").innerHTML = localStorage.superRare;
    document.getElementById("superiorSuperRare").innerHTML = localStorage.superiorSuperRare;
    document.getElementById("luck").innerHTML = "Bonus luck: "+localStorage.luck+"0%";
    if (Number(localStorage.hatch)<100){document.getElementById("egg").src = "egg.png";} else {document.getElementById("egg").src = "hatchedEgg.png";}
    if (Number(localStorage.hatch)<100){document.getElementById("egg2").src = "egg2.png";} else {document.getElementById("egg2").src = "hatchedEgg2.png";}
    //showAllData();
}

function hideAllData(){
    for(var i=datatable.childNodes.length-1;i>=0;i--){
        datatable.removeChild(datatable.childNodes[i]);
    }
    var tr = document.createElement("tr");
    var th1 = document.createElement("th");
    var th2 = document.createElement("th");
    var th3 = document.createElement("th");
	var th4 = document.createElement("th");
	var th5 = document.createElement("th");
	var th6 = document.createElement("th");

    th1.innerHTML = "Name";
    th2.innerHTML = "Due";
    th3.innerHTML = "Importance";
	th4.innerHTML = "Difficulty";
	th5.innerHTML = "Detail";
	th6.innerHTML = "Time";

    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
	tr.appendChild(th4);
	tr.appendChild(th5);
	tr.appendChild(th6);
    datatable.appendChild(tr);
}

function showData(row){
    var r = document.createElement("tr");
    r.innerHTML = "";
    var tr = document.createElement("td");
    tr.className = "mdl-data-table__cell--non-numeric"
    tr.innerHTML = row.Name;
    tr.onclick = function(){showDetail(row);}
    var tr2 = document.createElement("td");
    tr2.className = "mdl-data-table__cell--non-numeric"
    tr2.innerHTML = row.Due;
    tr.onclick = function(){showDetail(row);}
    r.appendChild(tr);
    r.appendChild(tr2);
    datatable.appendChild(r);
}

function deleteData(rowName){
	db.transaction(function(tx){
        tx.executeSql("DELETE FROM MsgData WHERE Name = '"+rowName+"'",[],function(tx,rs){
			showAllData();
        },function(tx,error){
        });
    })
}

function showAllData(){
    db.transaction(function(tx){
        tx.executeSql("create table if not exists MsgData(Name text,Due text,Importance text,Difficulty text,Detail text,Time text)",[]);
        tx.executeSql("select * from MsgData",[],function(tx,rs){
            hideAllData();
			for(var i=datatable.childNodes.length-1;i>=0;i--){
                datatable.removeChild(datatable.childNodes[i]);
			}
            for(var i=0;i<rs.rows.length;i++){
                showData(rs.rows.item(i));
            }
        });
    })
}

function addData(Name,Due,Importance,Difficulty,Detail,Time){
    db.transaction(function(tx){
        tx.executeSql("insert into MsgData values (?,?,?,?,?,?)",[Name,Due,Importance,Difficulty,Detail,Time],function(tx,rs){
            window.alert("success!");
        },function(tx,error){
            window.alert(error.source+"::"+error.message);
        });
    })
}

function saveData(){
    var Name = document.getElementById("Name").value;
    var Due = document.getElementById("Due").value;
	var Importance = document.getElementById("Importance").value;
	var Difficulty = document.getElementById("Difficulty").value;
	var Detail = document.getElementById("Detail").value;
    var Time = new Date().getTime();
    if (Importance>=0 && Importance<=10 && Difficulty>=0 && Difficulty<=10) {
        addData(Name,Due,Importance,Difficulty,Detail,Time);
        order();
        document.getElementById("Name").value = "";
        document.getElementById("Due").value = "";
        document.getElementById("Importance").value = "";
        document.getElementById("Difficulty").value = "";
        document.getElementById("Detail").value = "";
    } else {document.getElementById("invisAddTask").style.display = "inline";window.alert("The selected value for Difficulty and Importance should on a scale of 0-10.");}
}

function dropTable(){
    //var tableName = window.prompt("the name of deleted table:","");
    var tableName = "MsgData";
	db.transaction(function(tx){
        tx.executeSql("drop table "+tableName+"",[],function(tx,rs){
            window.alert("success!");
			showAllData();
        },function(tx,error){
            window.alert(error.source+"::"+error.message);
        });
    })
}

function showDetail(row){
    document.getElementById("k").style.display = "none";
    document.getElementById("invisDesc").style.display = "inline";
    document.getElementById("Name1").value = row.Name;
    document.getElementById("Due1").value = row.Due;
    document.getElementById("Importance1").value = row.Importance;
    document.getElementById("Difficulty1").value = row.Difficulty;
    document.getElementById("Detail1").value = row.Detail;
    document.getElementById("deleted").onclick = function(){deleteData(row.Name);
        document.getElementById("invisDesc").style.display = "none";
        document.getElementById("k").style.display = "inline";
    }
        document.getElementById("finished").onclick = function(){deleteData(row.Name);
        document.getElementById("invisDesc").style.display = "none";
        document.getElementById("k").style.display = "inline";
        localStorage.hatch = String(Number(localStorage.hatch) + row.Difficulty * localStorage.ratio);
        document.getElementById("hatchProgress").innerHTML = "Progress: "+localStorage.hatch+"%"; 
        if (Number(localStorage.hatch)<100){document.getElementById("egg").src = "egg.png";} else {document.getElementById("egg").src = "hatchedEgg.png";}
        if (Number(localStorage.hatch)<100){document.getElementById("egg2").src = "egg2.png";} else {document.getElementById("egg2").src = "hatchedEgg2.png";}
    }
    document.getElementById("edit").onclick = function(){edit(row);}
}

function hatchEgg(){
    if (Number(localStorage.hatch)>=100) {
            localStorage.luck = String(Number(localStorage.luck)+1);
            document.getElementById("luck").innerHTML = "Bonus luck: "+localStorage.luck+"0%";
            localStorage.hatch = String(Number(localStorage.hatch)-100);
            var result = Math.random();
            if (result<=0.8*(1-Number(localStorage.luck)*0.1)){
                normal();
            }
            if (result>0.8*(1-Number(localStorage.luck)*0.1) && result<=0.92*(1-Number(localStorage.luck)*0.04)){
                rare();
            }
            if (result>0.92*(1-Number(localStorage.luck)*0.04) && result<=0.97*(1-Number(localStorage,luck)*0.015)){
                superRare();
            }
            if (result>0.97*(1-Number(localStorage.luck)*0.015)){
                superiorSuperRare();
            }
            document.getElementById("hatchProgress").innerHTML = "Progress: "+localStorage.hatch+"%"; 
        }
        if (localStorage.hatch<100){document.getElementById("egg").src = "egg.png";} else {document.getElementById("egg").src = "hatchedEgg.png";}
        if (Number(localStorage.hatch)<100){document.getElementById("egg2").src = "egg2.png";} else {document.getElementById("egg2").src = "hatchedEgg2.png";}
}

function normal(){
    localStorage.normal = String(Number(localStorage.normal)+1);
    document.getElementById("normal").innerHTML = localStorage.normal;
    window.alert("A chicken has been added to your collection! You have gained some luck for the next hatch!");
}

function rare(){
    localStorage.rare = String(Number(localStorage.rare)+1);
    document.getElementById("rare").innerHTML = localStorage.rare;
    localStorage.luck = "1";
    window.alert("Your luck is not bad. A lark has been added to your collection!");
    document.getElementById("luck").innerHTML = "Bonus luck: "+localStorage.luck+"0%";
}

function superRare(){
    localStorage.superRare = String(Number(localStorage.superRare)+1);
    document.getElementById("superRare").innerHTML = localStorage.superRare;
    localStorage.luck = "1";
    window.alert("Good luck! A silver-throated bushtit has been added to your collection!");
    document.getElementById("luck").innerHTML = "Bonus luck: "+localStorage.luck+"0%";
}

function superiorSuperRare(){
    localStorage.superiorSuperRare = String(Number(localStorage.superiorSuperRare)+1);
    document.getElementById("superiorSuperRare").innerHTML = localStorage.superiorSuperRare;
    localStorage.luck = "1";
    window.alert("Unbelievable! A dragon has been added to your collection!");
    document.getElementById("luck").innerHTML = "Bonus luck: "+localStorage.luck+"0%";
}

function order(){
    if (!document.getElementById("switch-2").checked){
        db.transaction(function(tx){
            tx.executeSql("create table if not exists MsgData(Name text,Due text,Importance text,Difficulty text,Detail text,Time text)",[]);
            tx.executeSql("select * from MsgData",[],function(tx,rs){
               hideAllData();
                for(var i=datatable.childNodes.length-1;i>=0;i--){
                    datatable.removeChild(datatable.childNodes[i]);
                }
                var a=[];
                for(var i=0;i<rs.rows.length;i++){
                    a[i] = i;
                }
                for(var i=0;i<rs.rows.length-1;i++){
                    for(var j=i+1;j<rs.rows.length;j++){
                        if (rs.rows.item(i).Time>rs.rows.item(j).Time){
                            tempo = a[i];
                            a[i] = a[j];
                            a[j] = tempo;
                        }
                    }   
                }
                for(var i=0;i<rs.rows.length;i++){
                    showData(rs.rows.item(a[i]));
                }
            });
        })
    }
    if (document.getElementById("switch-2").checked){
        db.transaction(function(tx){
            tx.executeSql("create table if not exists MsgData(Name text,Due text,Importance text,Difficulty text,Detail text,Time text)",[]);
            tx.executeSql("select * from MsgData",[],function(tx,rs){
               hideAllData();
                for(var i=datatable.childNodes.length-1;i>=0;i--){
                    datatable.removeChild(datatable.childNodes[i]);
                }
                var a=[];
                for(var i=0;i<rs.rows.length;i++){
                    a[i] = i;
                }
                for(var i=0;i<rs.rows.length-1;i++){
                    for(var j=i+1;j<rs.rows.length;j++){
                        if ((rs.rows.item(i).Importance/(rs.rows.item(i).Due+1))<(rs.rows.item(j).Importance/(rs.rows.item(j).Due+1))){
                            tempo = a[i];
                            a[i] = a[j];
                            a[j] = tempo;
                        }
                    }   
                }
                for(var i=0;i<rs.rows.length;i++){
                    showData(rs.rows.item(a[i]));
                }
            });
        })
    }
    
}

function addDataF(){
    document.getElementById("k").style.display = "none";
    document.getElementById("invisAddTask").style.display = "inline";
}

function back(){
    document.getElementById("invisAddTask").style.display = "none";
    document.getElementById("invisDesc").style.display = "none";
    document.getElementById("edit").innerHTML = "Edit";
    order();
    document.getElementById("k").style.display = "inline";
}

function finish(){
    document.getElementById("invisAddTask").style.display = "none";
    saveData();
    document.getElementById("k").style.display = "inline";
}

function hatchPage(){
    document.getElementById("hatch").style.display = "inline";
    document.getElementById("k").style.display = "none";
}

function pageHide(){
    document.getElementById("hatch").style.display = "none";
    document.getElementById("k").style.display = "inline";
}

function settingPage(){
    document.getElementById("setting1").style.display = "inline";
    document.getElementById("k").style.display = "none";
}

function settingHide(){
    document.getElementById("setting1").style.display = "none";
    document.getElementById("k").style.display = "inline";
}

function set(){
    localStorage.ratio = document.getElementById("setRatio").value;
}

function edit(row){
        document.getElementById("edit").innerHTML = "Save";
        document.getElementById("Name1").readOnly = false;
        document.getElementById("Due1").readOnly = false;
        document.getElementById("Importance1").readOnly = false;
        document.getElementById("Difficulty1").readOnly = false;
        document.getElementById("Detail1").readOnly = false;
        document.getElementById("edit").onclick = function(){
        Namen = document.getElementById("Name1").value;
        Duen = document.getElementById("Due1").value;
        Importancen = document.getElementById("Importance1").value;
        Difficultyn = document.getElementById("Difficulty1").value;
        Detailn = document.getElementById("Detail1").value;
        Timen = row.Time;
        if (Importancen<=10 && Importancen>=0 && Difficultyn>=0 && Difficultyn<=10){
        document.getElementById("edit").innerHTML = "Edit";
        document.getElementById("Name1").readOnly = true;
        document.getElementById("Due1").readOnly = true;
        document.getElementById("Importance1").readOnly = true;
        document.getElementById("Difficulty1").readOnly = true;
        document.getElementById("Detail1").readOnly = true;
        deleteData(row.Name);
        addData(Namen,Duen,Importancen,Difficultyn,Detailn,Timen);
        order();
        document.getElementById("edit").onclick = function(){edit(row);}
    } else {window.alert("The selected value for Difficulty and Importance should on a scale of 0-10.");}
    }
}
