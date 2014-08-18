window.onload=function(){
	var storage = {};
	var stor;
	var timer;
	var lineNum = 0;
	var divCont = document.getElementById("input");
	var clearBtn = document.getElementById("clear");


	storage = {
		"0": "test 1", 
		"1": "test 2"
	}
	localStorage.setItem('list', JSON.stringify(storage));

	if (localStorage && localStorage.getItem('list')) {
		storage = JSON.parse(localStorage.getItem('list'));

		var arr = divCont.getElementsByTagName("div");
		arr[0].parentNode.removeChild(arr[0]);
		var length = Object.keys(storage).length; 

		for(var i=0; i < length; i++) {
			var div = document.createElement("div");
			div.setAttribute("id", lineNum);

			var btn = document.createElement("div");
			btn.setAttribute("id", lineNum);
			btn.setAttribute("class", "left");
			btn.appendChild(document.createTextNode('||'));

			var txt = document.createElement("div");
			txt.setAttribute("id", lineNum);
			txt.setAttribute("contentEditable", true);
			txt.setAttribute("class", "txt");
			txt.appendChild(document.createTextNode(storage[i]));

			div.appendChild(btn);
			div.appendChild(txt);
			divCont.appendChild(div);

			lineNum++;
		}
	}
	else {
		storage = {
			"0": ""
		}
	}

	divCont.addEventListener("keyup", function(){
		console.log('boom');
		resetTimer();
	}); 
	var btnArray = [];
	var txtArray = [];

	var divArray = divCont.getElementsByTagName("div");
	console.log(divArray);
	var len = divArray.length / 3;
	for(var i = 0; i < len; i++) {
		var current = divArray[i * 3];
		console.log(current);
		var curr = current.getElementsByClassName('left')[0];
		console.log(curr);
		btnArray[i] = curr;
		btnArray[i].addEventListener("click", function() {
			txtArray[i] = current.getElementsByClassName('txt')[0];
			txtArray[i].style.color = "#808080";
		});
	}


/*
	addEventLIstener('keypress', function(e){
		var key = e.which || e.keyCode;
		if (key == 13) {
			// do stuff
		}
	});
*/

	// clear & reset storage set timer
	function resetTimer(){
		clearTimeout(timer);
		timer = setTimeout(setStorage, 250);
	}

	// loop through each line and add it to the storage
	function setStorage(){
		var array = divCont.getElementsByTagName("div");
		storage = {};
		for(var i=0, j=0; i < array.length; i++) {
			var text = array[i].innerText;
			if (text != "\n"){
				storage[j] = text;
				j++;
			}
		}

		localStorage.setItem('list', JSON.stringify(storage));
	}

	// set background
	var n=Math.floor((Math.random() * 50) + 1);
	document.body.style.backgroundImage = "url('bg/"+n+".jpg')";

	// clear button
	clearBtn.addEventListener("click", function(){
		var arr = divCont.getElementsByTagName("div");
		for(var lcv=arr.length - 1; lcv >= 0; lcv--){
			if(lcv===0)
				arr[lcv].innerHTML='';
			else
				arr[lcv].parentNode.removeChild(arr[lcv]);
		}
		divCont.focus();
		localStorage.removeItem('list');
	});

}
