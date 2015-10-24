/*
Jot Chrome Extension

Matt O'Hagan

github.com/mattohagan/jot

Background images from http://imgur.com/a/3Woti
*/

window.onload = function(){
	var storage = {};
	var stor = true;
	var hasBorder = false;
	var timer;
	var lineNum = 0;
	var divCont = document.getElementById("input");
	var clearBtn = document.getElementById("clear");
	var jBtn = document.getElementById("jBtn");
	var oBtn = document.getElementById("oBtn");
	var tBtn = document.getElementById("tBtn");
	var appBtn = document.getElementById("appBtn");

	//used for testing 
	/* storage = {
		"0": "youtu.be/link",
		"1": "#hexcode"
	} 
	localStorage.setItem('list', JSON.stringify(storage));
	*/
	

	// find storage or set to nothing in order to render
	if (localStorage && localStorage.getItem('list')) {
		storage = JSON.parse(localStorage.getItem('list'));
	}
	else {
		storage = {
			"0": ""
		}
		stor = false;
	}

	// remove original div in html
	var arr = divCont.getElementsByTagName("div");
	arr[0].parentNode.removeChild(arr[0]);

	// loop through storage and render each line approriately
	var length = Object.keys(storage).length; 
	for(var i=0; i <= length; i++) {
		var div = document.createElement("div");
		div.setAttribute("id", lineNum);
		var btn = createBtn(lineNum);
		var txt = createTxt(lineNum);

		// create last line
		if (i == length) {
			if(stor) {
				div.setAttribute("class", "last");
				div.addEventListener("click", function(){
					div.setAttribute("class", "");
				});
				txt.appendChild(document.createTextNode(""));
			} else 
				break;
		} else {
			txt.appendChild(document.createTextNode(storage[i]));
		}

		div.appendChild(btn);
		div.appendChild(txt);
		divCont.appendChild(div);
		lineNum++;
	}



	// returns a left button element
	function createBtn() {
		var btn = document.createElement("i");
		btn.setAttribute("id", "left");
		btn.setAttribute("class", "left icon-right-open-big");

		return btn;
	}

	// returns a editable text element
	function createTxt(line) {
		var txt = document.createElement("div");
		txt.setAttribute("id", line);
		txt.setAttribute("contentEditable", true);
		txt.setAttribute("class", "txt");

		return txt;
	}
	

	// returns ALL divs in the 'input' div
	var divArray = divCont.getElementsByTagName("div");

	// creates new array without btns and txt to loop through
	var containerArray = [];
	var len = divArray.length / 2;
	for(var i = 0; i < len; i++)
		containerArray[i] = divArray[i * 2];

	// functions for button and text box features
	function addBtnListener(btn, txt) {
		// hover listeners
		btn.addEventListener("mouseover", function() {
			$(txt).addClass('txtHover');
		});
		btn.addEventListener("mouseout", function() {
			$(txt).removeClass('txtHover');
		});

		// click to select text listener
		btn.addEventListener("click", function() {
			//focusAtEnd(txt);
			selectText(txt);
		});
	}

	// sets event listeners for when focus is lost to delete if empty,
	// to create a new line when <enter> is hit,
	// and to delete current line on <backspace> when empty
	function addTxtListener(el) {
		// when a line loses focus, if it's empty then delete it
        $(el).on('focusout', function(e){
            var text = e.target.innerText;
            if (isEmpty(text)) {
            	console.log(text);
                var emptyRow = e.target.parentNode;
                var lastLine = arr[arr.length - 1];

                // turn last line back into hoverable empty line
                if(emptyRow.id == lastLine.id){
                	lastLine.parentNode.setAttribute("class", "last");
                } else if (emptyRow.parentNode) {
                    emptyRow.parentNode.removeChild(emptyRow);
                    lineNum--;
                }
            }
        });


		el.addEventListener('keypress', function(e){
			var key = e.which || e.keyCode;
			// <enter> key code
			if (key == 13) {
				if (el.innerText != '') {
					var div = document.createElement('div');
					div.setAttribute("id", lineNum);
					var btn = createBtn();
					var txt = createTxt(lineNum);
					div.appendChild(btn);
					div.appendChild(txt);

                    // add the new line after the current
                    var currentLine = el.parentNode;
					var newDiv = currentLine.parentNode.insertBefore(div, currentLine.nextSibling);
					var newTxt = newDiv.getElementsByClassName('txt')[0];
					var newBtn = newDiv.getElementsByClassName('left icon-right-open-big')[0];
					addBtnListener(newBtn, newTxt);
					addTxtListener(newTxt);

					newTxt.focus();
					e.preventDefault();
					lineNum++

    				} else {
					e.preventDefault();
				}
			} 

		});

		// setting functionality of the backspace key
		el.addEventListener('keydown', function(e){
			var key = e.which || e.keyCode;
			// <backspace> key code
			if (key == 8) {
				var div = el.parentNode;
				var txt = div.getElementsByClassName('txt')[0];
				var btn = div.getElementsByClassName('left icon-right-open-big')[0];
				var text = txt.innerText;

				// if the current line is blank, delete it and put focus on 
				// previous element
				if(text == '' || text == null){
					e.preventDefault();
					var arr = div.parentNode.getElementsByTagName('div');
					
					// filter out only 'txt' div's
					// can't use .filter on a nodeList
					var txtArr = [];
					var j = 0;
					for(var i = 0; i <= arr.length - 1; i++) {
						if (arr[i].className == 'txt') {
							txtArr[j] = arr[i];
							j++;
						}
					}

					// find current row and focus on previous one
					var lcv = 0;
					while (txtArr[lcv].innerText != text) {
						lcv++;
					}
					
					focusAtEnd(txtArr[lcv - 1]);
				}

			}
		});
	}


	// the following few functions are to set listeners for 
	// elements already in storage
	function setBtnListener (element, index, array) {
		var curr = element.getElementsByClassName('left icon-right-open-big')[0];
		var txt = element.getElementsByClassName('txt')[0];

		addBtnListener(curr, txt);
	}

	function setTxtListener (element, index, array) {
		var txt = element.getElementsByClassName('txt')[0];
		addTxtListener(txt);
	}

	// set listeners
	containerArray.forEach(setBtnListener);
	containerArray.forEach(setTxtListener);


	// timer used so that storage isnt reset on every keystroke
	divCont.addEventListener("keyup", function(){
		resetTimer();
	}); 

    // check if text is empty
    function isEmpty(text) {
        return text == null || text == '\n' || text == '' || text == ' ';
    }

	// clear & reset storage set timer
	function resetTimer(){
		clearTimeout(timer);
		timer = setTimeout(setStorage, 250);
	}

	// loop through each line and add it to the storage
	function setStorage(){
		var newArray = [];
		var j = 0;

		// get an array of just the txt elements
		var array = divCont.getElementsByTagName("div");
		for(var i = 0; i < array.length; i+=2)
			newArray[j++] = array[i + 1];

		// reset and refill storage
		storage = {};
		for(var i=0, j=0; i < newArray.length; i++) {
			var text = newArray[i].innerText;
			if (!isEmpty(text)){
				storage[j] = text;
				j++;
			}
		}
		
		localStorage.setItem('list', JSON.stringify(storage));
	}

	// move cursor to end of the given element
	function focusAtEnd(el) {
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(el, 1);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		el.focus();
	}

	// select text in an element
	function selectText(el) {
		var range,
			selection;
	    if (document.body.createTextRange) {
	        range = document.body.createTextRange();
	        range.moveToElementText(el);
	        range.select();
	    } else if (window.getSelection) {
	        selection = window.getSelection();        
	        range = document.createRange();
	        range.selectNodeContents(el);
	        selection.removeAllRanges();
	        selection.addRange(range);
	    }
	}

	// set background
	var numOfBackgrounds = 52;
	var n = Math.floor((Math.random() * numOfBackgrounds) + 1);
	document.body.style.backgroundImage = "url('bg/"+n+".jpg')";

	appBtn.addEventListener("click", function(){
		chrome.tabs.update({
            url:'chrome://apps'
        });
	});

	// clear button
	clearBtn.addEventListener("mouseover", function(){
		var rand = Math.floor((Math.random() * 5) + 1);
		console.log(rand);

		switch(rand){
			case 1:
				clearBtn.innerHTML = "Positive?";
				break;
			case 2:
				clearBtn.innerHTML = "Everything?";
				break;
			case 3:
				clearBtn.innerHTML = "You Sure?";
				break;
			case 4:
				clearBtn.innerHTML = "AHHHHHH";
				break;
			default:
				clearBtn.innerHTML = "Don't do it";
				break;
		}
	});

	clearBtn.addEventListener("mouseout", function(){
		clearBtn.innerHTML = "Clear";
	});

	clearBtn.addEventListener("click", function(){
		var arr = divCont.getElementsByTagName("div");

		for(var lcv = arr.length - 1; lcv >= 1; lcv-=2){
			// completely clear html 
			if(lcv === 1)
				var txt = arr[lcv].innerHTML='';
			// only clear text on the first line
			else
				arr[lcv - 1].parentNode.removeChild(arr[lcv - 1]);
		}

		divCont.focus();
		localStorage.removeItem('list');
	});

	// top left J button
	jBtn.addEventListener("click", function() {
		var arr = divCont.getElementsByTagName("div");
		var lastLine = arr[arr.length - 1];

		lastLine.parentNode.setAttribute("class", "");
		focusAtEnd(lastLine);
	});

	// top left O button
	oBtn.addEventListener('click', function(){
		$('#input').toggleClass('faded');
	});

	// top left t button
	tBtn.addEventListener('click', function(){
		var cont =  $('.borderCont');
		var diff = 23;

		if(hasBorder){
			hasBorder = false;
			cont.removeClass('border');
			var height = $('.container').height();
			cont.height(height - diff);
		} else {
			hasBorder = true;
			cont.addClass('border');
			var height = $('.container').height();
			cont.height(height + diff);
		}
	});

}
