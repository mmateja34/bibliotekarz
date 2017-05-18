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
			createdAt.setDate(createdAt.getDate() - randRange(1,30));
			tx.executeSql("insert into books(isbn, title, createdAt) values(?,?,?)",[isbn, title, createdAt.getTime()]);
		}, errorHandler, function() {alert("Książka została dodana")});
	});
}