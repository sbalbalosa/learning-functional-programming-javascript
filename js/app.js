(function (window) {
	// 'use strict';
 	var testObj = { test: 'yes'};
	window.localStorage.setItem('tododebug', JSON.stringify(testObj));
	// window.localStorage.removeItem('todo');

	// costant variables
	var dbName = 'todo';
	var dbStructure = {items:[]};

	// db module
	var setDb = _.compose(localStorageSetItem(dbName), stringify);
	var getDb = _.compose(_.map(parse), localStorageGetItem)(dbName);
	var getDb = _.map(parse, localStorageGetItem(dbName));
	var setDefaultDb = _.compose(setDb, _.always(dbStructure));

	var runSetDefaultDb = _.ifElse(R.isNil)(
		_.compose(_.chain(consoleLog),
		_.map(_.always('Db is initialized')), setDefaultDb),
		_.compose(consoleLog, _.always('Db is already initialized')));

	var initDb = _.chain(runSetDefaultDb, getDb);
	// end db module

	// db prop module
	// constants
	var prop = "items";
	var propLens = _.lensProp(prop);
	var viewProp = _.view(propLens);
	var overProp = _.over(propLens);
	var setProp =  _.compose(_.map(_.__, getDb), _.set(propLens), _.identity);
	var getProp = _.map(viewProp, getDb);

	// used by remove and update
	var propChange =  _.compose(_.chain(setDb), _.chain(setProp));
	// end db prop module


	// create module
	var initValue = defaultItem;
	var id = generateId();
	var initCreate = _.compose(_.map(_.__, id), initValue, _.identity);
	var createByObject = _.compose(
		_.chain(setDb), _.map(_.__, getDb),
		overProp, _.append, _.identity);
	var createBuffer = _.chain(createByObject);
	// absolute create
	var create = _.compose(createBuffer, initCreate);
	// end create module

	// read module

	var primaryKey = 'id';
	var findIndex = _.compose(_.map(_.__, getProp),
	_.findIndex, _.propEq(primaryKey), parseFloat, _.identity);
	var findById = _.compose(_.map(_.__, getProp), _.find,
		 _.propEq(primaryKey),parseFloat, _.identity);
	var findAll = getProp;
	var findByValue = function(key, value) {
		return _.map(_.filter(_.propEq(key, value)), findAll);
	};

	var count = _.map(_.length);
	var countAll = count(findAll);

	// app specific
	var findAllCompleted = findByValue('status', 'completed');
	var findAllActive = findByValue('status', 'active');
	var countAllCompleted = count(findAllCompleted);
	var countAllActive = count(findAllActive);

	// end read module

	// update module
	var update = _.curry(function(id, key, value){
		var index = findIndex(id);
		var supplyIndex = _.map(_.__, index);
		var setValue = _.set(_.lensProp(key), value);
		var initUpdate = _.compose(_.map(setValue), findById,
		convertToFloat, _.identity);
		return _.compose(
			propChange,
			_.chain(_.map(_.__, getProp)),
			_.chain(_.__, supplyIndex(_.update)),
			_.flip(_.map),
			initUpdate)(id);
	});

	//** app specific *//
	var updateToActive = update(_.__, 'status', 'active');
	var updateToCompleted = update(_.__, 'status', 'completed');
	var updateTitle = update(_.__, 'title');
	// end update module


	var removeById = _.compose(
		propChange,
		_.map(_.__, getProp),
		_.reject,
		_.propEq('id'),
		parseFloat,
		_.identity
	);




	/** DOM module app specific */
	var todoList = querySelector('.todo-list');
	var newTodo = querySelector('.new-todo');

	var appendTodoList = _.map(appendChild, todoList);
	var applyTpl =	_.compose(_.apply(tpl),
		_.ap([_.prop('id'), _.prop('title'), _.prop('status')]),
		_.append(_.__, []));
 	var applyTplToAll = _.map(_.map(applyTpl), findAll);
	var convertAllToDom = _.chain(createDomFromString,
		_.map(_.join(''), applyTplToAll));
	var convertDomToIo = _.chain(
		_.map(_.__, convertAllToDom),
		_.map(_.map, appendTodoList));


	/**

	TODO use create buffer
	*/
	var displayAllTodoFromDb = _.chain(ioArray, convertDomToIo);
	var displayTodo = _.compose(
		_.chain(_.head),
		_.chain(_.__, _.map(_.map, appendTodoList)),
		_.flip(_.map),
		createDomFromString,
		applyTpl);

	var createTodoBuffer = _.compose(
			ioArray, _.ap([createByObject, displayTodo]),
			_.append(_.__, []));

	var createTodo = _.compose(_.chain(createTodoBuffer), initCreate);

	//TODO make this pure
	var newTodoAction = function(e){
		if(e.keyCode === 13) {
		  var value = e.target.value;
		  createTodo(value).runIO();
			showItemsLeft.runIO();
			e.target.value = '';
			return false;
		} else {
			return true;
		}
	};


//TODO make this pure
	var completedTodoAction = function(e) {
		if(e.target.className === 'toggle') {
			var li = e.target.parentElement.parentElement;
			var id = li.getAttribute('data-id');
			if (e.target.checked === true) {
				updateToCompleted(id).runIO();
				showItemsLeft.runIO();
				li.setAttribute('class', 'completed');
			} else {
				updateToActive(id).runIO();
				showItemsLeft.runIO();
				li.removeAttribute('class');
			}
		}
	};

	// make this pure
	var deleteTodoAction = function(e) {
		if(e.target.className === 'destroy') {
			var li = e.target.parentElement.parentElement;
			var id = li.getAttribute('data-id');
			removeById(id).runIO();
			showItemsLeft.runIO();
			li.parentNode.removeChild(li);
		}
	};

	var beginEditTodoAction = function(e) {
		if (e.target.tagName === 'LABEL') {
			var li = e.target.parentElement.parentElement;
			var id = li.getAttribute('data-id');
			li.className = 'editing';
			li.getElementsByClassName('edit')[0].focus();
		};
	};

	var endEditTodoAction = function(e) {
		if(e.keyCode === 13) {
			if(e.target.className === 'edit') {
				var li = e.target.parentElement;
				var id = li.getAttribute('data-id');
				var value = e.target.value;
				updateTitle(id, value).runIO();
				li.getElementsByTagName('label')[0].innerHTML = value;
				li.className = '';
			}
		}
	};

	var focusOutEditTodoAction = function(e) {
		if(e.target.className === 'edit') {
			var li = e.target.parentElement;
			var id = li.getAttribute('data-id');
			li.className = '';
		}
	}

	// update dom module
	var toggleInputs = querySelectorAll('.toggle');
	var startNewTodoListener = _.chain(
		addEventListener(_.__, 'keypress', newTodoAction),
		newTodo);

	// show items left
	var todoCount = querySelector('.todo-count');
	var showItemsLeft = _.chain(
		_.chain(_.__, _.map(countTpl, countAllActive)),
		 _.map(innerHTML, todoCount));

	var main = querySelector('.main');
	var mainToggleListener = _.chain(
		addEventListener(_.__, 'change', completedTodoAction),
		 main);
	var mainDeleteListener = _.chain(
		addEventListener(_.__, 'click', deleteTodoAction),
		main);
	var mainBeginEditListener = _.chain(
		addEventListener(_.__, 'dblclick', beginEditTodoAction),
		main);

	var documentKeyPress = addEventListener(document,
		'keypress', endEditTodoAction);

	var documentFocusOut = addEventListener(document,
		'focusout', focusOutEditTodoAction);

	// run unsafe code
	initDb.runIO(); // initialize database if needed
	displayAllTodoFromDb.runIO();
	startNewTodoListener.runIO();
	mainBeginEditListener.runIO();
	mainToggleListener.runIO();
	documentFocusOut.runIO();
	documentKeyPress.runIO();
	mainDeleteListener.runIO();
	showItemsLeft.runIO();


debugger;

})(window);
