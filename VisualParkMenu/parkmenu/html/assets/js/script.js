$('body').on('input', '.input-number', function(){
	this.value = this.value.replace(/[^0-9]/g, '');
});

let currentShowing = "ausparken"

function display(bool) {
    if (bool) {
		$("#einparken").removeClass("selected")
		$("#ausparken").addClass("selected")

		currentShowing = "ausparken"
		
		ToggleFavourite(false)

        $("body").fadeIn(500);
    } else {
        $("body").fadeOut(500);
    }
}

display(false)

window.addEventListener('message', function(event) {
    var item = event.data;

    if(item.type == "showUI") {
		ShowCars("ausparken")

        display(true)
    }

    if(item.type == "clearCars") {
        $(".carboxlist").empty()
    }

    if (item.type === "addNearCar") {
        AddNearCar(item.vehicleName, item.vehiclePlate, item.nickname, item.fav, item.carType)
    }

    if (item.type === "addCar") {
		if (item.impound) {
			$("#einparken").hide()
			$(".favorit").hide()
			$("#text").text("ausparken")
			$(".header-text").text("Abschlepphof")
		} else {
			$("#einparken").show()
			$(".favorit").show()
			$("#text").text("ausparken/einparken")
			$(".header-text").text("Garage")
		}
        AddCar(item.vehicleName, item.vehiclePlate, item.nickname, item.fav, item.carType)
    }
})

function ShowCars(type) {
	currentShowing = type

	if(type == "einparken") {
		$("#einparken").addClass("selected")
		$("#ausparken").removeClass("selected")
	} else if(type == "ausparken") {
		$("#ausparken").addClass("selected")
		$("#einparken").removeClass("selected")
	}

	$(".carboxlist").children('.carpanel').each(function() {
		var element = $(this).prop('outerHTML')

		if($(element).attr("type") == type) {
			$(this).show()
		} else {
			$(this).hide()
		}
	})
}

$(document).ready(function(){
	$(".searchinput").on('keyup', function() {
		var value = $(this).val().toLowerCase();

		$(".carboxlist").children('.carpanel').each(function() {
            var element = $(this).prop('outerHTML')
			let nickname = $(element).attr('nickname').toLowerCase()

			if(nickname.startsWith(value)) {
				$(this).show()
			} else {
				$(this).hide()
			}
		})
	})
})

let showFavourites = true

function ToggleFavourite(fav) {
	if(fav != undefined) {
		showFavourites = fav
	} else {
		showFavourites = !showFavourites
	}

	if(showFavourites) {
		$("#fav").removeClass("notselected")
		$("#fav").addClass("selected")
	} else {
		$("#fav").removeClass("selected")
		$("#fav").addClass("notselected")
	}

	$(".carboxlist").children('.carpanel').each(function() {
		var element = $(this).prop('outerHTML')
		let isFav = $(element).attr('fav')
		let type = $(element).attr('type')

		if(type !== currentShowing) 
			return $(this).hide();

		if(isFav == "true") {
			if(showFavourites) {
				$(this).show()
			} else {
				$(this).hide()
			}
		} else {
			if(showFavourites) {
				$(this).hide()
			} else {
				$(this).show()
			}
		}
	})
}

$("#fav").click(function() {
	ToggleFavourite()
})

function AddNearCar(vehicleName, vehiclePlate, nickname, fav, type) {
	if (nickname == undefined || nickname == "NULL") {
		nickname = " "
	}

	let icon = "selectedicn";
	let img = "car.png"

	if(fav) {
		icon = "isFav"
	}

	if(type == "helicopter" || type == "airplane") {
		img = "helicopter.svg"
	} else if(type == "boat" ) {
		img = "boat.svg"
	}

    let item = `
	<div class="carpanel"  type="einparken" nickname="`+nickname+`" fav="`+fav+`">
		<p class="namecar">`+vehicleName+` <span id="nickname">`+nickname+`</span></p>
		<div class="circle">
				<p class="numbertext">`+vehiclePlate+`</p>
			</div>
			<div class="imgaa" onclick="Einparken('`+vehiclePlate+`')">
				<img class="imga" src="assets/images/`+img+`" >
			</div>
			<div class="favor ` + icon + `" onclick="ToggleFav('`+vehiclePlate+`')">				
				<svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M13 4.96531L8.27635 4.6427L6.49741 0L4.71847 4.6427L0 4.96531L3.61903 8.15756L2.43146 13L6.49741 10.3301L10.5634 13L9.37582 8.15756L13 4.96531Z" fill="white" fill-opacity="0.15"/>
				</svg>								
			</div>
			<div class="editname">
				<svg  class="editicn" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" onclick="OpenEditor('`+vehiclePlate+`')">
					<path d="M10.8509 0.381923C10.6112 0.142224 10.2293 0.142224 9.98962 0.381923L5.36243 5.00909C5.28931 5.07817 5.24056 5.16754 5.20806 5.26503L4.45244 7.78785C4.38742 8.00318 4.44837 8.23472 4.60681 8.39316C4.72055 8.51099 4.87899 8.57191 5.03744 8.57191C5.09429 8.57191 5.15524 8.56378 5.21212 8.54754L7.73492 7.79191C7.83244 7.75941 7.9218 7.71066 7.99085 7.63754L12.6181 3.01035C12.7318 2.89661 12.7968 2.74224 12.7968 2.57973C12.7968 2.41724 12.7318 2.26286 12.6181 2.1491L10.8509 0.381923Z" fill="white" fill-opacity="0.15"/>
					<path d="M12.1875 5.89062C11.8509 5.89062 11.5781 6.16358 11.5781 6.5V10.5625C11.5781 11.1227 11.1225 11.5781 10.5625 11.5781H2.4375C1.87752 11.5781 1.42188 11.1227 1.42188 10.5625V2.4375C1.42188 1.87732 1.87752 1.42188 2.4375 1.42188H6.5C6.83662 1.42188 7.10938 1.14892 7.10938 0.8125C7.10938 0.476076 6.83662 0.203125 6.5 0.203125H2.4375C1.20546 0.203125 0.203125 1.20566 0.203125 2.4375V10.5625C0.203125 11.7943 1.20546 12.7969 2.4375 12.7969H10.5625C11.7945 12.7969 12.7969 11.7943 12.7969 10.5625V6.5C12.7969 6.16358 12.5241 5.89062 12.1875 5.89062Z" fill="white" fill-opacity="0.15"/>
				</svg>								
			</div>
		</div>
    `
    
    $(".carboxlist").append(item)
}

function AddCar(vehicleName, vehiclePlate, nickname, fav, type) {
	if (nickname == undefined || nickname == "NULL") {
		nickname = " "
	}

	let icon = "selectedicn";
	let img = "car.png"

	if(fav) {
		icon = "isFav"
	}

	if(type == "helicopter" || type == "airplane") {
		img = "helicopter.svg"
	} else if(type == "boat" ) {
		img = "boat.svg"
	}


    let item = `
		<div class="carpanel"  type="ausparken" nickname="`+nickname+`" fav="`+fav+`">
			<p class="namecar">`+vehicleName+` <span id="nickname">`+nickname+`</span></p>
			<div class="circle">
				<p class="numbertext">`+vehiclePlate+`</p>
			</div>
			<div class="imgaa" onclick="Ausparken('`+vehiclePlate+`')">
				<img class="imga" src="assets/images/`+img+`" >
			</div>
			<div class="favor ` + icon + `" onclick="ToggleFav('`+vehiclePlate+`')">
				<svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M13 4.96531L8.27635 4.6427L6.49741 0L4.71847 4.6427L0 4.96531L3.61903 8.15756L2.43146 13L6.49741 10.3301L10.5634 13L9.37582 8.15756L13 4.96531Z" fill="white" fill-opacity="0.15"/>
				</svg>								
			</div>
			<div class="editname">
				<svg class="editicn" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" onclick="OpenEditor('`+vehiclePlate+`')">
					<path d="M10.8509 0.381923C10.6112 0.142224 10.2293 0.142224 9.98962 0.381923L5.36243 5.00909C5.28931 5.07817 5.24056 5.16754 5.20806 5.26503L4.45244 7.78785C4.38742 8.00318 4.44837 8.23472 4.60681 8.39316C4.72055 8.51099 4.87899 8.57191 5.03744 8.57191C5.09429 8.57191 5.15524 8.56378 5.21212 8.54754L7.73492 7.79191C7.83244 7.75941 7.9218 7.71066 7.99085 7.63754L12.6181 3.01035C12.7318 2.89661 12.7968 2.74224 12.7968 2.57973C12.7968 2.41724 12.7318 2.26286 12.6181 2.1491L10.8509 0.381923Z" fill="white" fill-opacity="0.15"/>
					<path d="M12.1875 5.89062C11.8509 5.89062 11.5781 6.16358 11.5781 6.5V10.5625C11.5781 11.1227 11.1225 11.5781 10.5625 11.5781H2.4375C1.87752 11.5781 1.42188 11.1227 1.42188 10.5625V2.4375C1.42188 1.87732 1.87752 1.42188 2.4375 1.42188H6.5C6.83662 1.42188 7.10938 1.14892 7.10938 0.8125C7.10938 0.476076 6.83662 0.203125 6.5 0.203125H2.4375C1.20546 0.203125 0.203125 1.20566 0.203125 2.4375V10.5625C0.203125 11.7943 1.20546 12.7969 2.4375 12.7969H10.5625C11.7945 12.7969 12.7969 11.7943 12.7969 10.5625V6.5C12.7969 6.16358 12.5241 5.89062 12.1875 5.89062Z" fill="white" fill-opacity="0.15"/>
				</svg>								
			</div>
		</div>
    `

    $(".carboxlist").append(item)
}

function CloseUI() {
	display(false)
	$.post('http://bc_garage/exit', JSON.stringify({}));
}

document.onkeyup = function (data) {
	if (data.which == 27) {
		CloseUI()
		return
	}
};

function Einparken(plate) {
	CloseUI()
	$.post('http://bc_garage/einparken', JSON.stringify({
		plate: plate
	}));
}

function Ausparken(plate) {
	console.log(plate)

	CloseUI()
	$.post('http://bc_garage/ausparken', JSON.stringify({
		plate: plate
	}));
}

function ToggleFav(plate) {
	$.post('http://bc_garage/toggleFav', JSON.stringify({
		plate: plate
	}));
}

async function OpenEditor(plate) {
	let newNickname = await Swal.fire({
		title: 'Neuer Nickname',
		input: 'text',
		inputPlaceholder: 'Trage deinen Nickname ein',
	})

	newNickname = newNickname.value 
	
	if (newNickname) {
		$.post('http://bc_garage/changeNickname', JSON.stringify({
			plate: plate,
			nickname: newNickname
		}));
	}
}