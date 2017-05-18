
var db;
function init(){
	document.addEventListener('deviceready', deviceready, false);
	var online = window.navigator.onLine;
    if (online) {
        navigator.notification.alert("Obecnie nie masz połączenia z Internetem. Połączenie jest niezbedne aby aplikacja działała poprawnie.");
    }
}

function deviceready(){
	db = window.openDatabase("bibliotekarz", "1.0", "bibliotekarz", 1000000);
	db.transaction(setup, errorHandler, dbReady);
}

function setup(tx){
	tx.executeSql('create table if not exists books(id INTEGER PRIMARY KEY AUTOINCREMENT, isbn TEXT, title TEXT, createdAt DATE)');
}

function errorHandler(e){
	alert(e.message);
}

function dbReady(){
	$('#add-book-button').on("touchstart", function(e){
		db.transaction(function(tx){
			var isbn = "isbn";
			var title = "title";
			var createdAt = new Date();
			createdAt.setDate(createdAt.getDate());
			tx.executeSql("insert into books(isbn, title, createdAt) VALUES(?,?,?)",[isbn, title, createdAt.getTime()]);
		}, errorHandler, function() {alert("Książka została dodana");});
	});

	$('#get-books-button').on("touchstart", function(e){
		db.transaction(function(tx){
			tx.executeSql("select * from books", [], getBooks, errorHandler);
		}, errorHandler, function() {alert("coś poszło nie tak")});
	});
}

function getBooks(tx, results){
	if(results.rows.length == 0){
		$('#results').html('Brak wyników');
		return false;
	}
	var s = "";
	for(var i=0; i<results.row.length; i++){
		var createdAt = new Date();
		createdAt.setTime(results.rows.item(i).createdAt);
		s += createdAt.toDateString() + " " + createdAt.toTimeString() + "<br />";
	}
	$('#results').html(s);
}

