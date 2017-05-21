
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

	//do rozpisania walidacja
	//czy pola uzupełnione, czy data nie jest późniejsza niż dziś

	$('#add-new-book').on('submit', function(){
        var $inputs = $('#add-new-book:input');

        var values = {};
        $inputs.each(function() {
            values[$(this).name] = $(this).val();
        });
        var isbn = values['isbn'];
        var title = values['title'];
        var borrowDate = values['borrowDate'];
		db.transaction(function(tx){
			tx.executeSql("insert into books(isbn, title, borrowDate) VALUES(?,?,?)",[isbn, title, borrowDate]);
		},
		errorHandler, 
		queryForBooks);
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

