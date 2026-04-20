
/* ✅ 1. AUTO COPYRIGHT YEAR */
const year = document.getElementById("year");
if (year) {
    year.textContent = new Date().getFullYear();
}


/* ✅ 2. CATEGORY ACTIVE BUTTON */
const pills = document.querySelectorAll(".pill");

pills.forEach(pill => {
    pill.addEventListener("click", () => {

        pills.forEach(p => p.classList.remove("active"));

        pill.classList.add("active");
    });
});


/* ✅ 3. SEARCH FILTER PRODUCTS */
const searchInput = document.querySelector(".search-bar");
const cards = document.querySelectorAll(".card");

if (searchInput) {
    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();

            if (title.includes(value)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}


/* ✅ 4. ADD TO CART COUNTER */
let cartCount = 0;

const cartIcon = document.querySelector(".cart-icon");
const addButtons = document.querySelectorAll(".add-to-cart");

addButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        cartCount++;

        if (cartIcon) {
            cartIcon.innerText = "🛒 " + cartCount;
        }
    });
});


/* ✅ 5. CARD HOVER ANIMATION */
cards.forEach(card => {

    card.addEventListener("mouseenter", () => {
        card.style.transform = "scale(1.05)";
        card.style.transition = "0.3s";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "scale(1)";
    });
});


/* ✅ 6. SMOOTH SCROLL LINKS */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', function (e) {

        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});
