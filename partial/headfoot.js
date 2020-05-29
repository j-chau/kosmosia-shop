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
