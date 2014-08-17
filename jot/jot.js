window.onload=function(){
	var storage = {};
	var stor;
	var timer;
	var m=document.getElementById("m");
	var b=document.getElementById("b");

	if (localStorage && localStorage.getItem('list')) {
		storage = JSON.parse(localStorage.getItem('list'));

		var arr = m.getElementsByTagName("li");
		arr[0].parentNode.removeChild(arr[0]);
		var length = Object.keys(storage).length;
		for(var i=0; i < length; i++) {
			var li = document.createElement("li");
			li.appendChild(document.createTextNode(storage[i]));
			m.appendChild(li);
		}
	}

	m.addEventListener("keyup", function(){
		resetTimer();
	}); 

	// clear & reset storage set timer
	function resetTimer(){
		clearTimeout(timer);
		console.log('boom');
		timer = setTimeout(setStorage, 250);
	}

	// go through each line and add it to the storage
	function setStorage(){
		console.log('clap');
		var array = m.getElementsByTagName("li");
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
	document.body.style.backgroundImage="url('https://raw.githubusercontent.com/mattohagan/jot/master/bg/"+n+".jpg')";

	// clear button
	b.addEventListener("click", function(){
		var arr = m.getElementsByTagName("li");
		for(var lcv=arr.length - 1; lcv >= 0; lcv--){
			if(lcv===0)
				arr[lcv].innerHTML='';
			else
				arr[lcv].parentNode.removeChild(arr[lcv]);
		}
		m.focus();
		localStorage.removeItem('list');
	});

}
