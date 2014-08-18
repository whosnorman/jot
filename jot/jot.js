window.onload=function(){
	var storage = {};
	var stor;
	var timer;
	var lineNum = 0;
	var divCont = document.getElementById("input");
	var clearBtn = document.getElementById("clear");


	storage = {
		"0": "youtu.be/link", 
		"1": "#hexcode"
	}
	localStorage.setItem('list', JSON.stringify(storage));

	// find storage or set to nothing in order to render
	if (localStorage && localStorage.getItem('list'))
		storage = JSON.parse(localStorage.getItem('list'));
	else {
		storage = {
			"0": ""
		}
	}

	// remove original div in html
	var arr = divCont.getElementsByTagName("div");
	arr[0].parentNode.removeChild(arr[0]);

	// loop through storage and render each line approriately
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
	

	// returns ALL divs in the 'input' div
	var divArray = divCont.getElementsByTagName("div");

	// creates new array without btns and txt to loop through
	var containerArray = [];
	var len = divArray.length / 3;
	for(var i = 0; i < len; i++)
		containerArray[i] = divArray[i * 3];

	// set callbacks for button events
	function setBtnListener (element, index, array) {
		var curr = element.getElementsByClassName('left')[0];
		var txt = element.getElementsByClassName('txt')[0];
		curr.addEventListener("mouseover", function() {
			txt.style.color = "rgba(255, 255, 255, 0.6)";
			txt.style.textShadow = "0 0 0";
		});
		curr.addEventListener("mouseout", function() {
			txt.style.color = "#fff";
			txt.style.textShadow = "0px 1px 5px rgba(0,0,0,0.2)";
		});
		curr.addEventListener("click", function() {
			txt.focus();
		});
	}

	containerArray.forEach(setBtnListener);


/*
	addEventLIstener('keypress', function(e){
		var key = e.which || e.keyCode;
		if (key == 13) {
			// do stuff
		}
	});
*/


	// timer used so that storage isnt reloaded on every single keystroke
	divCont.addEventListener("keyup", function(){
		resetTimer();
	}); 

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
