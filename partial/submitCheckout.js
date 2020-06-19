updateCart();

function showOrderTotal() {
    shippingCost = parseInt(sessionStorage.getItem("shipping"));
    if (shippingCost >= 0) {
        showShipping(shippingCost);
        total = $("#total").text();
    }
    else {
        $("#shipping").text("fill in shipping info");
        total = "$" + $("#subtotal").text() + " USD";
    }
    $("#summaryTotal").text(total);
}

function buildCartList(obj) {
    price = parseInt(obj.price.replace(/\D/g, ''));
    quantity = obj.qty;
    singleTotal = price * quantity;

    return `<div class="d-flex mb-4 mx-auto text-left">
        <div class="text-center p-0 img-checkout">
            <img src="${obj.imgURL}" class="img-checkout">
            <span class="badge badge-pill badge-secondary">${obj.qty}</span>
        </div>
        <div class="flex-grow-0 text-wrap my-auto pl-2">
            <h5>${obj.description}</h5>
        </div>
        <div class="flex-grow-1 text-right my-auto pr-1">
            <div class>$${singleTotal} USD</div>
        </div>
    </div>`
}

$("#showSummary").click(function () {
    $("#toggleShow").toggleClass("d-flex d-none");
    $("#toggleHide").toggleClass("d-none d-flex");
});

$(window).on("load resize", function windowWidth() {
    if ($(".find-xl").is(":hidden")) {
        $("#orderSummary").addClass("show");
        $("#extraHR").addClass("d-none");
    }
    else if ($("#toggleShow").hasClass("d-flex")) {
        $("#orderSummary").removeClass("show");
    }
});

$(".form-check-input").click(function () {
    if ($("#ship2").is(":checked")) {
        $(".address-row :input").prop("disabled", true);
        price = 0;
    }
    else {
        $(".address-row :input").prop("disabled", false);
        price = null;
    }
    sessionStorage.setItem("shipping", price);
    showOrderTotal();
});

$("#shipCountry").click(function () {
    countryName = event.target.innerText;
    countryCode = event.target.value;
    if (countryCode == "INT") { countryName = "" }
    $("#dropdownFront").text(countryCode);
    $("#validationCustom05").val(countryName);
    for (let i in shippingInfo) {
        if (countryCode === shippingInfo[i].country_code) {
            price = shippingInfo[i].cost;
            sessionStorage.setItem("shipping", price);
            showOrderTotal();
        }
    }
});

// custom function to create JSON from given array
(function ($) {
    $.fn.getObject = function () {
        json = "{";

        // making json for customer info
        arr = this.serializeArray();
        arr.forEach(function (el) {
            json += '"' + el.name + '"' + ': ' + '"' + el.value + '", ';
        })
        // making json for items ordered
        cartItems = JSON.parse(sessionStorage.getItem("data"));
        for (i = 0; i < cartItems.length; i++) {
            json += '"' + 'item_' + (i + 1) + '"' + ': ' + '"' + cartItems[i].sku + '", ';
            json += '"' + 'qty_' + (i + 1) + '"' + ': ' + '"' + cartItems[i].qty + '", ';
        }
        json = json.substring(0, json.length - 2) + "}";
        return JSON.parse(json);
    }
})(jQuery);

$(document).ready(() => {
    showOrderTotal();
    if (parseInt(sessionStorage.getItem("shipping")) == 0) {
        $("#ship2").prop("checked", true);
        $(".address-row :input").prop("disabled", true);

    }

    forms = document.getElementsByClassName("needs-validation");
    validation = Array.prototype.filter.call(forms, (form) => {
        $(form).focusout((event) => {
            if (event.target.checkValidity() === false) {
                event.target.classList.add("is-invalid");
            }
            else {
                event.target.classList.remove("is-invalid");
            }
        });
        $(form).submit((event) => {
            form.classList.add('was-validated');

            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            else {
                // loading animation
                $("#submitOrder").html(`<span class="spinner-border spinner-border-sm text-secondary mb-1 mr-3" role="status" aria-hidden="true"></span>sending...`)
                // sending form data to Google Sheets
                var customerInfo = $('form#customerInfo'),
                    url = "https://script.google.com/macros/s/AKfycbwwAbmoPwguPLSUrqM44u7pIsZkE0uorreeNO05D41zNq5AvRhk/exec"
                event.preventDefault();
                var jqxhr = $.ajax({
                    url: url,
                    method: "GET",
                    dataType: "json",
                    data: customerInfo.getObject()
                })
                    .success(function () {
                        $("#submitOrder").text("Sent!")
                        $(".modal-content").html(buildModal(modalText[2], null));
                        sessionStorage.clear();
                        shoppingCart = [];
                        cartQtyTotal(0);
                        $("#cartList").text("");
                    });
            }
        });
    });
}, false);

function emptyNote() {
    return false;
}