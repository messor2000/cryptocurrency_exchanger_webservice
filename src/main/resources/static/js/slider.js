$(document).ready(function(){
    console.log('slider');
    $('.js-reviews-slider').slick({
        // dots: true,
        // infinite: true,
        // speed: 300,
        // slidesToShow: 1,
        // centerMode: true,
        // variableWidth: true
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000,
        dots: false,
        arrows: false,
        mobileFirst: true,
        variableWidth: true,
        responsive: [
            // {
            //     breakpoint: 1800,
            //     settings: "unslick"
            // },
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 2,
                    variableWidth: true
                }
            },
            {
                breakpoint: 744,
                settings: {
                    slidesToShow: 1,
                    variableWidth: true
                }
            }
        ]
    })



});

