let fullmoon = false;
let index = false;
import controls from './controls.js'

let thispage = window.location.pathname;
console.log(thispage);
if (thispage == '/'){
    index = true; //detects whether we are on homepage
}

if (controls.playermode == 'on'){
    fullmoon = true;
    if (index){
        window.location.replace("/on/");
    }
}else{
    fullmoon = false;
    if (thispage == '/on/'){
        console.log('redirect');
        window.location.replace("/");
    }
}



$(document).ready(function(){

/*-----------------------------------------
    MOON PHASER
-----------------------------------------*/

	let date = new Date();
	resizeMoon();

    process_phase( moon_day(date) );

    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();

    $('#date').text(`Today is ${month} ${day} ${year}.`);




/*-----------------------------------------
    IMAGE SLIDER
-----------------------------------------*/

    $('.images').slick({
        infinite: true,
        prevArrow: '.prev',
        nextArrow: '.next'
    });



/*-----------------------------------------
    FORM SCRIPTS
-----------------------------------------*/

    var $form = $('form');

    if ( $form.length > 0 ) {
        $('form input[type="submit"]').bind('click', function ( event ) {
            if ( event ) {
                event.preventDefault();
                register($form);
            }
        });
    }

    function register($form) {
        $.ajax({
            type: $form.attr('method'),
            url: $form.attr('action'),
            data: $form.serialize(),
            cache       : false,
            dataType    : 'json',
            contentType: 'application/json; charset=utf-8',
            error       : function(err) { alert("Could not connect to the registration server. Please try again later."); },
            success     : function(data) {
                if (data.result != "success") {
                    $('#mce-error-response').text(data.msg.slice(3)).show();
                    console.log(data.msg);
                    // Something went wrong, do something to notify the user. maybe alert(data.msg);
                } else {
                    console.log(data.msg)
                    $('form').hide();
                    $('#pre-thankyou').hide();
                    $("#thankyou").show();
     
                }
            }
        });
    }


    if (controls.playermode == 'off' && index){
        // different transmissions behavior
        $('#transmissions-link').click(function(){
           $('main').attr('data-displaymode', 'inactivelist');
        });
    }

    //video background controls working with .in-view class
    $(window).scroll(function() {
        if ($('#ocean').hasClass('in-view') ){
            $('#bgvid')[0].play();
        } else {
            $('#bgvid')[0].pause();
        }
    });
        

});


/*-----------------------------------------
    MOON FUNCTIONS
-----------------------------------------*/

function resizeMoon(){
    //stretches moon shape to fit window
	let ratio = window.innerWidth / window.innerHeight;
	$('#moon, #newmoon').css('transform', `scale(${ratio},1) translateZ(0)`);
}

$( window ).resize(function() {
  //recalc ratio
   resizeMoon();
});


//moon phase calculations
Date.prototype.getJulian = function() {
    return ((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
};

function moon_day(today) {
    var GetFrac = function(fr) {
        return (fr - Math.floor(fr));
    };
    var thisJD = today.getJulian();
    var year = today.getFullYear();
    var degToRad = 3.14159265 / 180;
    var K0, T, T2, T3, J0, F0, M0, M1, B1, oldJ;
    K0 = Math.floor((year - 1900) * 12.3685);
    T = (year - 1899.5) / 100;
    T2 = T * T;
    T3 = T * T * T;
    J0 = 2415020 + 29 * K0;
    F0 = 0.0001178 * T2 - 0.000000155 * T3 + (0.75933 + 0.53058868 * K0) - (0.000837 * T + 0.000335 * T2);
    M0 = 360 * (GetFrac(K0 * 0.08084821133)) + 359.2242 - 0.0000333 * T2 - 0.00000347 * T3;
    M1 = 360 * (GetFrac(K0 * 0.07171366128)) + 306.0253 + 0.0107306 * T2 + 0.00001236 * T3;
    B1 = 360 * (GetFrac(K0 * 0.08519585128)) + 21.2964 - (0.0016528 * T2) - (0.00000239 * T3);
    var phase = 0;
    var jday = 0;
    while (jday < thisJD) {
        var F = F0 + 1.530588 * phase;
        var M5 = (M0 + phase * 29.10535608) * degToRad;
        var M6 = (M1 + phase * 385.81691806) * degToRad;
        var B6 = (B1 + phase * 390.67050646) * degToRad;
        F -= 0.4068 * Math.sin(M6) + (0.1734 - 0.000393 * T) * Math.sin(M5);
        F += 0.0161 * Math.sin(2 * M6) + 0.0104 * Math.sin(2 * B6);
        F -= 0.0074 * Math.sin(M5 - M6) - 0.0051 * Math.sin(M5 + M6);
        F += 0.0021 * Math.sin(2 * M5) + 0.0010 * Math.sin(2 * B6 - M6);
        F += 0.5 / 1440;
        oldJ = jday;
        jday = J0 + 28 * phase + Math.floor(F);
        phase++;
    }

    // 29.53059 days per lunar month
    return (((thisJD - oldJ) / 29.53059));
}

function process_phase(phase) {

   	let phase_name;
    let newmoon = false;
    let phase_key = 1;

    if (phase <= 0.0625 || phase > 0.9875) {
       	phase_name = "a new moon"
       	newmoon = true;
        phase_key = 2;
    } else if (phase <= 0.1875) {
		phase_name = "a waxing crescent";
        phase_key = 5;
    } else if (phase <= 0.3125) {
		phase_name = "waxing, in its first quarter";
        phase_key = 4;
    } else if (phase <= 0.4875) {
		phase_name = "a waxing gibbous";
        phase_key = 4;
    } else if (phase <= 0.5125) {
        fullmoon = true;
  		phase_name = "a full moon";
        phase_key = 1;
    } else if (phase <= 0.6875) {
  		phase_name = "a waning gibbous";
        phase_key = 3;
    } else if (phase <= 0.8125) {
  		phase_name = "waning, in its last quarter";
        phase_key = 3;
    } else if (phase <= 0.9875) {
 		phase_name = "a waning crescent";
        phase_key = 2;
    }

    $('#date').text( 'today');
    $('#moonphase').text( `${phase_name}`) ;


    //adjust logo text width
    let magmatic_moon_wdth = 150;
    let range = 150-40;
    if (fullmoon){
    }else if (phase <= 0.4875){
        magmatic_moon_wdth = (phase/0.5)*range + 40;
    }else if (phase >= 0.5125){
        magmatic_moon_wdth = (0.5/phase)*range + 40;
    }
    // console.log(magmatic_moon_wdth);
    $('#logo').get(0).style.setProperty('--wdth', magmatic_moon_wdth);

    if(newmoon){
    	//new moon
    	$('#newmoon').show();
    	$('#moon').hide();
    }else{
    	$('#newmoon').hide();
    	$('#moon').get(0).style.setProperty('--PHSE', Math.round(phase*100) );
    	$('#moon').show();
    }

    //update favicons
    changeFavicon(phase_key);
}

function changeFavicon(key) {
    $('[href^="/assets/favicon/"]').each(function(){
        // console.log(this);
        this.href = this.href.replace('favicon-1', 'favicon-'+key);
    });
}


/*-----------------------------------------
    don't animate when not in view
-----------------------------------------*/
// / Watch if .view-check elements are visible on screen
// // and apply a class accordingly
if ("IntersectionObserver" in window) {
    // eslint-disable-next-line compat/compat
    const obs = new IntersectionObserver(els => {
        els.forEach(el => {
            el.intersectionRatio > 0
                ? el.target.classList.add("in-view")
                : el.target.classList.remove("in-view");
        });
    });

    const elements = document.querySelectorAll(".view-check");
    elements.forEach(el => {
        obs.observe(el);
    });
}