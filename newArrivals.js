const spaceID = "fszoesgel2t5";
const tokenID = "uorRKXNyrH9SNIfTFQZylAHZal1r_QWxImNxAwWcTac";
const catalogue = "https://cdn.contentful.com/spaces/" + spaceID + "/entries?access_token=" + tokenID;


//updates home page with newest arrivals added to Contentful
fetch(catalogue, {
    method: "get"
})
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        for (i = 0; i < 3; i++) {
            let prodName = data.items[i].fields.productName;
            let price = data.items[i].fields.price;
            let sku = data.items[i].fields.sku;
            let imgURL = "";

            imgMatching = data.includes.Asset;
            for (let j in imgMatching) {
                if (imgMatching[j].fields.title == sku) {
                    imgURL = imgMatching[j].fields.file.url;
                    break;
                }
            }
            cardTitle = document.getElementsByClassName("card-title")[i];
            cardSubtitle = document.getElementsByClassName("card-subtitle")[i];
            cardImgTop = document.getElementsByClassName("card-img-top")[i];

            cardTitle.innerText = prodName;
            cardTitle.setAttribute("id", sku);
            cardSubtitle.innerText = "$" + price + " USD";
            cardImgTop.src = imgURL;
            // cardImgTop.alt = sku;

        }
    }
    );

