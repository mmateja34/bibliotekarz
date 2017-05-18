var db = null;

function init() {
	document.addEventListener('deviceready', function() {
		db = window.openDatabase("bibliotekarz", "1.0", "bibliotekarz", 1000000);
		db.transaction(setup, errorHandler, dbReady);
	});

 	var online = window.navigator.onLine;
    if (online) {
        navigator.notification.alert("Obecnie nie masz połączenia z Internetem. Połączenie jest niezbedne aby aplikacja działała poprawnie.");
    }
}

function setup(tx){
	tx.executeSql('create table if not exist books(id integer primary key autoincrement, isbn text, title text, createdAt date)');
}

function errorHandler(e){
	alert(e.message);
}

fuction dbReady(){
	$('#add-book-button').on("touchstart", function(e){
		db.transaction(function(tx){
			var isbn = "isbn";
			var title = "title";
			var createdAt = new Date();
			createdAt.setDate(createdAt.getDate());
			tx.executeSql("insert into books(isbn, title, createdAt) values(?,?,?)",[isbn, title, createdAt.getTime()]);
		}, errorHandler, function() {alert("Książka została dodana")});
	});

	$('#get-books-button').on("touchstart", function(e){
		db.transaction(function(tx){
			tx.executeSql("select * from books order by createdAt asc", [], getBooks, errorHandler);
		}, errorHandler, function() {});
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

