
var db;
function init(){
	document.addEventListener('deviceready', deviceready, false);
	var online = window.navigator.onLine;
    if (!online) {
        navigator.notification.alert("Obecnie nie masz połączenia z Internetem. Połączenie jest niezbedne aby aplikacja działała poprawnie.");
    }
}

function deviceready(){
	db = window.openDatabase("bibliotekarz", "1.0", "bibliotekarz", 1000000);
	db.transaction(setup, errorHandler, dbReady);
}

function setup(tx){
	tx.executeSql('create table if not exists books(id INTEGER PRIMARY KEY AUTOINCREMENT, isbn TEXT, title TEXT, borrowDate DATE)');
}

function errorHandler(e){
	alert(e.message);
}

function dbReady(){
    queryForBooks();

	var $form = $('#add-new-book');

	//do rozpisania walidacja
	//czy pola uzupełnione, czy data nie jest późniejsza niż dziś

	$form.on('submit', function(){
        var isbn = $form.find('input[name="isbn"]').val();
        var title = $form.find('input[name="title"]').val();
        var borrowDate = new Date($form.find('input[name="date"]').val());

		db.transaction(function(tx){
			tx.executeSql("insert into books(isbn, title, borrowDate) VALUES(?,?,?)",[isbn, title, borrowDate.getTime()]);
		},
		errorHandler, 
		queryForBooks);
	});
	
	$('#refresh').on('touchstart', function () {
        $('#books-list').trigger('create');
    });
}

function queryForBooks() {
    db.transaction(function(tx){
        tx.executeSql("select * from books", [], getBooks, errorHandler);
    }, errorHandler, function() {alert('Pobrano książki z bazy danych')});
}

function getBooks(tx, results){
	var $results = $('.results');
	if(results.rows.length === 0){
		$results.html('Brak wyników');
		return false;
	}
	var s = "";
	for(var i=0; i<results.rows.length; i++){
		var isbn = results.rows.item(i)['isbn'];
		var title = results.rows.item(i)['title'];
		var borrowDate = results.rows.item(i)['borrowDate'];
		s += "<tr><td>" + i + "</td><td>" + title + "</td><td>" + borrowDate + "</td></tr>";
	}
	$results.html(s);
}

