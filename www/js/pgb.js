var db = null;

function init() {
	document.addEventListener('deviceready', function() {
		db = window.openDatabase("bibliotekarz", "1.0", "bibliotekarz", 1000000);
	});

 	var online = window.navigator.onLine;
    if (online) {
        navigator.notification.alert("Obecnie nie masz połączenia z Internetem. Połączenie jest niezbedne aby aplikacja działała poprawnie.");
    }
}

function setup(tx){
	tx.executeSql('create table if not exist books(id integer primary key autoincrement, isbn text, title text, createdAt date)');
	
}
