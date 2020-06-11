var modalText = [
    {
        title: "Remove Item",
        body: "Are you sure you want to remove the item from you cart?",
        button: {
            remove: `<button type="button" class="btn btn-outline-light" id="removeZero">Remove</button>`,
            closeText: "Cancel"
        }
    },
    {
        title: "Your cart is empty",
        body: "Please add an item to your cart before going to Checkout.",
        button: {
            remove: "",
            closeText: "Close"
        }
    },
    {
        title: "Order Submitted",
        body: `<p>Your order has been submitted!<br>We will contact you via Instagram to confirm payment.</p><p>Thank you for shopping with us!</p>`,
        button: {
            remove: "",
            closeText: `<a href="index.html" class="no-link">Back to Home</a>`
        }
    }
]

var shippingInfo = [
    {
        country_code: "CAN",
        country: "Canada",
        cost: 3.00,
        ship_time: "2-5 business days"
    },
    {
        country_code: "NIL",
        country: "Toronto Pick-Up",
        cost: 0.00,
        ship_time: "N/A"
    },
    {
        country_code: "USA",
        country: "USA",
        cost: 5.00,
        ship_time: "7-14 business days"
    },
    {
        country_code: "INT",
        country: "International",
        cost: 8.00,
        ship_time: "14-30 business days"
    }
]

$("#NavBar").load("partial/nav.html");
$("#foot").load("partial/footer.html");

$(window).on("load", countCart = () => {
    cartItems = JSON.parse(sessionStorage.getItem("data"));
    if (cartItems != null) {
        total = 0;
        for (let i in cartItems) {
            total += cartItems[i].qty;
        }
        cartQtyTotal(total);
    }
});

function cartQtyTotal(count) {
    $("#shoppingCount").text(count);
}

var shoppingCart = [];
$("#cartList").click(function () {

    cartItems = JSON.parse(sessionStorage.getItem("data"));
    prodID = event.target.parentElement.parentElement.id;

    // increase quantity
    if (event.target.classList.contains("incQty")) {
        updateQty(prodID, cartItems, true);
    }

    //decrease quantity
    if (event.target.classList.contains("decQty")) {
        currentQty = event.target.previousElementSibling.innerText;
        if (currentQty == 1) {
            $(".modal-content").html(buildModal(modalText[0], prodID));
        }
        else {
            updateQty(prodID, cartItems, false);
        }
    }

    //remove item
    if (event.target.classList.contains("trash")) {
        removeItem(prodID, cartItems);
    }
});

function updateQty(prodID, cart, up) {
    for (let i in cart) {
        if (prodID == cart[i].sku) {
            up ? cart[i].qty++ : cart[i].qty--;
        }
    }
    sessionStorage.setItem("data", JSON.stringify(cart));
    updateCart();
}

function removeItem(prodID, cart) {
    for (let i in cart) {
        if (prodID == cart[i].sku) {
            cart.splice(i, 1);
            shoppingCart.splice(i, 1);
        }
    }
    sessionStorage.setItem("data", JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    cartItems = JSON.parse(sessionStorage.getItem("data"));
    total = 0;
    $("#cartList").text("");
    if (cartItems == null || cartItems.length == 0) {
        $("#cartList").html(emptyNote);
    }
    else {
        for (let i in cartItems) {
            $("#cartList").append(buildCartList(cartItems[i]));
            price = parseInt(cartItems[i].price.replace(/\D/g, ''));
            quantity = cartItems[i].qty;
            total += price * quantity;
        }
    }
    $("#subtotal").text(total);
    countCart();
}

function showShipping(price) {
    if (Number.isNaN(price)) {
        USDformat = "TBD";
    }
    else {
        USDformat = "$" + price + " USD";
        sessionStorage.setItem("shipping", price);
    }
    $("#shipping").text(USDformat);
    finalTotal();
}

function finalTotal() {
    price = parseInt(sessionStorage.getItem("shipping"));
    if (Number.isNaN(price)) {
        USDformat = "TBD";
    }
    else {
        subtotal = $("#subtotal").text();
        total = parseInt(subtotal) + price;
        USDformat = "$" + total + " USD";
    }
    $("#total").text(USDformat);
}

$("#Checkout").click(function () {
    if (cartItems == null || cartItems.length == 0) {
        event.preventDefault();
        $(".modal-content").html(buildModal(modalText[1], null));
    }
});

function buildModal(obj, prodID) {
    $("#alertMsg").addClass("show-zero");
    $(".blackout").addClass("black-on");

    return `<div class="modal-header">
        <h1 class="modal-title" id="${prodID}">${obj.title}</h1>
    </div>
    <div class="modal-body">${obj.body}</div>
    <div class="modal-footer">
        ${obj.button.remove}
        <button type="button" class="btn btn-light" id="closeModal">${obj.button.closeText}</button>
    </div>`
}

$(".pop-up-modal").click(function () {
    switch (event.target.id) {

        case "closeModal":
            closeZero();
            break;

        case "removeZero":
            prodID = $(".modal-title").attr("id");
            cartItems = JSON.parse(sessionStorage.getItem("data"));
            removeItem(prodID, cartItems);
            closeZero();
            if ($("#total").text()) finalTotal();
            break;
    }
});

function closeZero() {
    $("#alertMsg").removeClass("show-zero");
    $(".blackout").removeClass("black-on");
}