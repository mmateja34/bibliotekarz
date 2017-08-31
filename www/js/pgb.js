
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
	tx.executeSql('create table if not exists books(id INTEGER PRIMARY KEY AUTOINCREMENT, isbn TEXT, title TEXT, borrowDate DATE, photo TEXT)');
    // tx.executeSql('drop table books');
}

function errorHandler(e){
	alert(e.message);
}

function dbReady(){
    queryForBooks();

	var $form = $('#add-new-book');

	//do rozpisania walidacja
	//czy pola uzupełnione, czy data nie jest późniejsza niż dziś

	$form.on('submit', function(event){
        event.preventDefault();
        var isbn = $form.find('input[name="isbn"]').val();
        var title = $form.find('input[name="title"]').val();
        var borrowDate = new Date($form.find('input[name="date"]').val());
        var imageURI = $('#book-photo').attr('src');
        if (imageURI.length > 0) {
            imageURI = "bd";
        }
        console.log(imageURI);

        if (isbn.length === 0 || title.length === 0 || borrowDate === 0 || imageURI === 0) {
            alert('Proszę uzupełnić wszyskie pola wymagane oraz wykonać zdjęcie książki.');
        } else{
    		db.transaction(function(tx){
    			tx.executeSql("insert into books(isbn, title, borrowDate, photo) VALUES(?,?,?,?)",[isbn, title, borrowDate.getTime(), imageURI]);
    		},
    		errorHandler, 
    		queryForBooks);
        }

	});

    $('#take-photo').on('touchstart', accessCamera);
	
	$('#refresh').on('touchstart', function () {
        $('#books-list').trigger('create');
    });

	$('.show-book').on('touchstart', function () {
        var id = $(this).data('id');
        db.transaction(function(tx){
            tx.executeSql("select * from books where id = (?)", [id], showBook, errorHandler);
        }, errorHandler, function() {});
    })
}

function queryForBooks() {
    db.transaction(function(tx){
        tx.executeSql("select * from books", [], getBooks, errorHandler);
    }, errorHandler, function() {});
}

function getBooks(tx, results){
	var $results = $('.results');
	if(results.rows.length === 0){
		$results.html('Brak wyników');
		return false;
	}
	var s = "";
	for(var i=0; i<results.rows.length; i++){
	    var id = results.rows.item(i)['id'];
		var isbn = results.rows.item(i)['isbn'];
		var title = results.rows.item(i)['title'];
		var borrowDate = results.rows.item(i)['borrowDate'];
		s += '<tr><td>' + i + '</td><td><a href="#book-details" class="show-book" data-id="' + id + '">' + title + '</a></td><td>' + borrowDate + '</td></tr>';
	}
	$results.html(s);
}

function showBook(tx, results){
    var $bookDetails = $('#book-details');
    if(results.rows.length === 0){
        alert("Nie znaleziono książki");
        $bookDetails.find('.show-title').html('Brak wyników');
        return false;
    }
    $bookDetails.find('.show-title').html(results.rows.item(0)['title']);
    $bookDetails.find('.show-isbn').html(results.rows.item(0)['isbn']);
    $bookDetails.find('.show-isbn').html(results.rows.item(0)['borrowDate']);
    $bookDetails.find('.show-payment').html(calculate(results.rows.item(0)['borrowDate']));
}

function calculate(date){
    var today = new Date();
    var payment = 0;
    if (parseInt(today - date) > 30){
        payment = (parseInt(today - date) - 30) * 0.20;
        return payment;
    }
    return payment;
}

function accessCamera() {
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
    destinationType: Camera.DestinationType.FILE_URI });
}

var retries = 0;
function onSuccess(imageURI) {
    var image = document.getElementById('book-photo');
    image.src = imageURI;
    console.log(imageURI);

    var win = function (r) {
        clearCache();
        retries = 0;
        alert('Done!');
    }
 
    var fail = function (error) {
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onSuccess(imageURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            alert('Nie udało się wysłać zdjęcia na serwer!');
        }
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://minimalic.usermd.net/upload.php"), win, fail, options);
}

function onFail(message) {
    alert('Nie udało się wykonać zdjęcia: ' + message);
}

function clearCache() {
    navigator.camera.cleanup();
}
