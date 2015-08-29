var IO = require('ramda-fantasy').IO;
var Identity = require('ramda-fantasy').Identity;
var _ = R;

var generateId = function(){
  return IO(function(){
    return new Date().getTime();
  });
};

var consoleLog = function(value){
  return IO(function(){
    return console.log(value);
  });
};

var localStorageGetItem = function(key){
  return IO(function() {
    return window.localStorage.getItem(key);
  });
};

var localStorageSetItem = R.curry(function(key, value){
  return IO(function() {
    window.localStorage.setItem(key, value)
  });
});

var ioArray = function(a) {
	return IO(function(){
		_.map(function(io){
			io.runIO();
		}, a);
	});
};

var addEventListener = _.curry(function(dom, eventName, action){
	return IO(function(){
		dom.addEventListener(eventName, action);
	});
});


var stringify = function(value) {
  return JSON.stringify(value);
};

var parse = function(value) {
  return JSON.parse(value);
};

var isJSON = function(string) {
  try {
    JSON.parse(string);
  } catch(err) {
    return false;
  }
  return true;
};

var convertToFloat = function(value) {
  return parseFloat(value);
};

var defaultItem = _.curry(function(text, id) {
  return {id:id, title: text, status: 'active'}
});

var querySelector = function(selector) {
	return IO(function(){
		return document.querySelector(selector);
	});
};

var querySelectorAll = function(selector) {
	return IO(function(){
    return document.querySelectorAll(selector);
	});
};

var createDomFromString = function(s) {
	return IO(function(){
		var div = document.createElement('div');
		div.innerHTML = s;
	 	return div.childNodes;
	});
};

var appendChild = _.curry(function(dom, el) {
	return IO(function(){
		dom.appendChild(el);
	});
});

var innerHTML = _.curry(function(dom, html) {
	return IO(function(){
		dom.innerHTML = html;
	});
});

var tpl = _.curry(function(id, title, status) {
  var isCompleted = (status === 'completed');
  var cls = isCompleted ? 'class=completed' : '';
  var checked = isCompleted ? 'checked' : '';
	return '<li data-id="' + id + '"' + cls  + ' >' +
		'<div class="view">' +
			'<input class="toggle" type="checkbox" data-id="' + id + '" ' + checked + '>' +
			'<label>' + title + '</label>' +
			'<button class="destroy" data-id=' + id + '></button>' +
		'</div>' +
		'<input class="edit" data-id=' + id + '>' +
	'</li>';
});

var countTpl = function(count) {
  return '<strong>' + count + '</strong> item left';
};

// debugging utilities
var trace = _.curry(function(tag, x) {
  console.log("-----" +  tag + "-----");
  console.log(x);
  console.log("-----" + "end " + tag + "-----");
  return x;
});

var tapTrace = _.curry(function(tag, x) {
  return _.tap(trace(tag, x));
});

var debug = function(x) {
  debugger;
  return x;
};
// end debugging utilities
