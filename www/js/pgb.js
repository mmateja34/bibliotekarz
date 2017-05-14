var db = null;

function init() {
	document.addEventListener('deviceready', function() {
		db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
		db.transaction(function(tx) {
		    tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
		    tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
		    tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
		  }, function(error) {
		    alert('Transaction ERROR: ' + error.message);
		  }, function() {
		    alert('Populated database OK');
		 });
	});
 	var online = window.navigator.onLine;
    if (online) {
        navigator.notification.alert("Obecnie nie masz połączenia z Internetem. Połączenie jest niezbedne aby aplikacja działała poprawnie.");
    }
}

