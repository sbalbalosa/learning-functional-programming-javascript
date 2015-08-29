(function (window) {
	'use strict';

var localStorageSetItem = R.curry(function(key,value){
	return IO(function(){
		window.localStorage.setItem(key, value);
	});
});
var localStorageGetItem = function(key) {
	return IO(function(){
		return window.localStorage.getItem(key);
	});
};

// var createDomFromString = function(s) {
// 	return IO.of(function(){
// 		var div = document.createElement('div');
// 		div.innerHTML = s;
// 	 	return div.childNodes;
// 	});
// };
//
// var addEventListener = R.curry(function(dom, eventName, action){
// 	return new IO(function(){
// 		dom.addEventListener(eventName, action);
// 	});
// });

// var ioList = function(a) {
// 	return new IO(function(){
// 		R.map(function(io){
// 			io.unsafePerformIO();
// 		}, a);
// 	});
// };

// var appendChild = R.curry(function(dom, el) {
// 	return new IO(function(){
// 		dom.appendChild(el);
// 	});
// });
//
// var querySelector = function(selector) {
// 	return new IO(function(){
// 		return document.querySelector(selector);
// 	});
// }

var stringify = function(value) {
	return JSON.stringify(value);
};
//
var parse = function(value) {
	return JSON.parse(value);
};

// var newAction = function(e){
// 	if(e.keyCode === 13) {
// 		var value = e.target.value;
// 		createTodo(value).unsafePerformIO();
// 		e.target.value = '';
// 		return false;
// 	} else {
// 		return true;
// 	}
// };
//
// var changeAction = function(e) {
// 	var id = e.target.dataset.id;
// 	if (e.target.checked === true) {
// 		update(id, 'status', 'completed').unsafePerformIO();
// 	} else {
// 		update(id, 'status', 'active').unsafePerformIO();
// 	}
// 	return true;
// };
//
// var generateId = function() {
// 	return new IO(function(){
// 		return new Date().getTime();
// 	})
// };
//
// var tpl = R.curry(function(id, title) {
// 	return '<li>' +
// 		'<div class="view">' +
// 			'<input class="toggle" type="checkbox" data-id=' + id + '>' +
// 			'<label>' + title + '</label>' +
// 			'<button class="destroy" data-id=' + id + '></button>' +
// 		'</div>' +
// 		'<input class="edit" data-id=' + id + '>' +
// 	'</li>';
// });
//
// var isActive = function(s) {
// 	return s === 'active';
// };
// var isCompleted = function(s) {
// 	return s === 'completed'
// };
//
// var defaultItem = R.curry(function(title, id) {
// 	 return {id:id, title: title, status: 'active'};
// });


/*
	todo
	{
		items: [
			{
				title: 'any string',
				status: either 'active', 'completed'
			},
			{
				title: 'any string',
				status: either 'active', 'completed'
			}
		]
	}
*/

//db module
var getDefaultDbStructure = R.defaultTo({items:[]});
var setValueToDb = R.compose(
	localStorageSetItem('todo'),
	stringify);
var createDefaultDb = R.compose(
	setValueToDb
	defaultDbStructure
);

debugger;

// var setDb = R.compose(setItem('todo'), JSON.stringify);

// var createDefaultDb = R.compose(
// 	R.map(JSON.parse),
// 	setDb,
// 	defaultDb);
//
// createDefaultDb(null);

// var getBufferDb = R.ifElse(R.isNil)(createDefaultDb,parse);
// var getDb = R.map(getBufferDb, getItem('todo'));
// var applyDb = R.chain(R.__, getDb);
//
// //item document module
// var itemsLens = R.lensProp('items');
// var viewItems = R.view(itemsLens);
// var overItems = R.over(itemsLens);
// var setItems = R.set(itemsLens);
//
// var applyDoc = R.useWith(R.call, R.identity, applyDb)(R.__, viewItems);
// var applyChanges = R.compose(setDb,applyDb,setItems,applyDoc);
//
// // read
// var findIndex = R.compose(applyDoc, R.findIndex, R.propEq('id'), R.identity);
// var find = R.compose(applyDoc, R.find, R.propEq('id'), R.identity);
// var findAll = R.compose(applyDb, R.always(viewItems));
//
// // create
// var create = R.compose(setDb, applyDb,
// overItems, R.append, R.chain(R.__, generateId()),
// defaultItem, R.identity);
//
// // update
// var update = R.curry(function(id, key, value) {
// 	return R.compose(applyChanges, R.update(findIndex(id)),
// 		R.set(R.lensProp(key), value), find, parseInt, R.identity)(id);
// });
//
// //delete
// var remove = R.curry(function(id){
// 	return R.compose(applyChanges,R.remove(R.__, 1),findIndex)(id);
// });
//
// /** ----------- DOM Manipulation ---------- */
//
// // dom module
// var applyTpl = R.compose(R.apply(tpl),
// 	R.ap([R.prop('id'), R.prop('title')]),
// 	R.append(R.__, []));
//
// var applyTplToAll = R.compose(R.map(applyTpl),findAll);
//
// var convertAllToDom = R.compose(
// 	createDomFromString,
// 	R.join(''),
// 	applyTplToAll
// );
//
// var displayAllTodo = R.compose(ioList,
// 	R.chain(R.__, convertAllToDom()),R.map,
// 	appendChild, R.chain(R.identity)
// );
//
//
// var attachEventNewData = R.compose(
// 	addEventListener(R.__, 'keypress', newAction),
// 	R.chain(R.identity)
// );
//
// var attachEventChangeData = R.compose(
// 	addEventListener(R.__, 'change', changeAction),
// 	R.chain(R.identity)
// );
//
// var displayItem = R.compose(
// 	R.chain(R.identity),
// 	appendChild(R.chain(R.identity, querySelector('.todo-list'))),
// 	R.head,
// 	R.chain(R.identity),
// 	createDomFromString,
// 	applyTpl,
// 	R.chain(R.__, generateId()),
// 	defaultItem,
// 	R.identity
// );
//
// var createTodo = R.compose(create, R.tap(displayItem));

// displayAllTodo(querySelector('.todo-list')).unsafePerformIO();
// attachEventNewData(querySelector('.new-todo')).unsafePerformIO();
// attachEventChangeData(querySelector('.todo-list')).unsafePerformIO();

})(window);
