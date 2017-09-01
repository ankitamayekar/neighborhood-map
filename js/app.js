
var map,add1,add2;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'),{
		center:{lat: 47.639325,lng: -122.128538}, 
		zoom: 12
		});
}

//// Model
var model = {
    currentLocation: null,
    locations : [
		
        {title: 'In.gredents',desc:'Fine Dining Restaurant ',area:'redmond',location: {lat: 47.645410, lng: -122.124633}},
        {title: 'Spazzo',desc:'Italian Restaurant Cheery eatery featuring many wines by the glass & Italian basics, with big-screen TV in lively bar.', area:'redmond',location: {lat: 47.670385, lng: -122.119998}}, 
        {title: 'Seoul Hot Pot',desc:' Korean Restaurant Traditional Korean barbecue & other standards offered up in a modest, compact setting.',area:'redmond',location: {lat: 47.636620, lng: -122.136993}}, 
        {title: 'Peking', desc:'Asian Restaurant Family-owned Chinese joint with a focus on housemade noodles plus classic fare since 1983.',area:'redmond', location: {lat: 47.628345, lng: -122.151638}},
	    {title: 'Costco Food Court', desc:'Located in: Costco Wholesale',area:'Kirkland', location: {lat: 47.681103, lng: -122.181766}},
		{title: 'La Casita', desc:'Festive family restaurant serving a wide variety of Mexican standards with bottomless chips & salsa.',area:'sammamish', location: {lat: 47.583221, lng: -122.033234}},
		{title: 'Taco Time', desc:'Longtime Mexican fast-food chain serving tacos, crisp burritos & kids meals in simple surrounds.',area:'Issaquah', location: {lat: 47.608226, lng: -122.033234}},
		{title: 'Bombay House', desc:'Indian restaurant specializing in vegetarian & vegan cooking, with gluten-free options available.',area:'Bellevue', location: {lat: 47.576737, lng: -122.136231}},
        {title: 'Wild Ginger',desc:'Busy, sleek restaurant with Pacific Rim fare, happy hour & weekend dim sum brunch.',area:'bellevue',location: {lat: 47.617993, lng: -122.201366}}
        ] 
};

/* ======= Octopus ======= */

var octopus = {

    init: function() {
        // set our current location to the first one in the list
        model.currentLocation = model.locations[0];

        // tell our views to initialize
        locationListView.init();
    },

    getCurrentLocation: function() {
        return model.currentLocation;
    },

    getLocations: function() {
        return model.locations;
    },

    // set the currently-selected location to the object passed in
    setCurrentLocation: function(location) {
		model.currentLocation = location;
    }
};



/* ======= View ======= */
var locationListView = {

    init: function() {
        // store the DOM element for easy access later
        this.ListElem = document.getElementById('r-list');

        // render this List view 
        this.render();
    },

    render: function() {
        var loc, elem, i;
        // get the locations we'll be rendering from the octopus
        var locations = octopus.getLocations();

        // empty the loc list
        this.ListElem.innerHTML = '';

        // loop over the locations
        for (i = 0; i < locations.length; i++) {
            loc = locations[i];
            // make a new loc list item and set its text
            elem = document.createElement('li');
            elem.textContent = loc.title;
            // on click, setCurrentLocation and render the locationView
            //  of the loc variable to the click event )
            elem.addEventListener('click', (function(locationCopy) {
                return function() {
                    octopus.setCurrentLocation(locationCopy);
                    locationView.render();
                };
            })(loc));

            // finally, add the element to the list
            this.ListElem.appendChild(elem);
        }
		
    }
};



var locationView = {

    init: function() {		
        // render this view 
        this.render();
    },

    render: function() {
        // update the DOM elements with values from the current location
        var currentLoc = octopus.getCurrentLocation();
		
		/* Importing data from FourSquare 
		CLIENT_ID
		SXTB4PSIKGVCH3HTSYBZY4RFJJB5CDWX44Q31KYJUVU3BCVO
		CLIENT_SECRET
		JGY3V3KIAXQVYL1FBU0HZ5KYZTPYKXGQEKTZFPEO2JEKHZGJ
		version 
		20161016 */



		var ResponseURL ='https://api.foursquare.com/v2/venues/search?ll='+currentLoc.location.lat+','+currentLoc.location.lng+'&client_id=SXTB4PSIKGVCH3HTSYBZY4RFJJB5CDWX44Q31KYJUVU3BCVO&client_secret=JGY3V3KIAXQVYL1FBU0HZ5KYZTPYKXGQEKTZFPEO2JEKHZGJ&v=20161016&query='+currentLoc.title+'&limit=1';
		//extract the required data received (address )
		$.getJSON(ResponseURL).done(function(data) {
			var resultInfo = data.response.venues[0];
			add1 = resultInfo.location.formattedAddress[0];
			add2 = resultInfo.location.formattedAddress[1];
			
		//add a marker for currently selected restuarant 
		var marker = new google.maps.Marker({
		position:currentLoc.location,
		map:map,
		//animation: google.maps.Animation.DROP,
		title:currentLoc.title
		});
		
		//add info window to the marker
		var contentString ='<div><div><b>'+currentLoc.title+'</b></div><div>'+add1 +'</div><div>'+add2 +'</div><hr><div>'+currentLoc.desc+'</div></div>';
		var infowindow = new google.maps.InfoWindow({
          content: contentString,
		  maxWidth: 200
        });
		//marker.addListener('click', toggleBounce);
		marker.addListener('click', function() {
          infowindow.open(map, marker);
		  
        });
		}).fail(function() {
			alert("FourSquare Error.");
		});  
		
		
		/* function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      } */
    }
};
function SearchR() {
    var input, upperinput, ul, li, x, j;
    input = document.getElementById("myInput");
    upperinput = input.value.toUpperCase();
    //ul = document.getElementById("r-list");
    li = document.getElementsByTagName("LI");
    for (j = 0; j < li.length; j++) {
        x = li[j].innerHTML.toUpperCase();
        if (x.indexOf(upperinput) > -1) {
            li[j].style.display = "";
        } else {
            li[j].style.display = "none";
        }
    }
}

octopus.init();
