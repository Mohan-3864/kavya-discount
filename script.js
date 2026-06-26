// ==========================================
// Google Apps Script Web App URL
// Replace this after deploying Apps Script
// ==========================================

const SCRIPT_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

let currentBillNo = "";
let currentReward = 0;

// Rewards
const prizes = [50, 60, 70, 80, 90, 100];

// ==========================================
// Elements
// ==========================================

const billPage = document.getElementById("billPage");
const coinPage = document.getElementById("coinPage");

const billInput = document.getElementById("billNo");
const billMessage = document.getElementById("billMessage");

const displayBillNo = document.getElementById("displayBillNo");

const continueBtn = document.getElementById("continueBtn");

const flipBtn = document.getElementById("flipBtn");
const nextBtn = document.getElementById("nextBtn");

const coin = document.getElementById("coin");

const result = document.getElementById("result");

const loading = document.getElementById("loading");

// ==========================================

continueBtn.addEventListener("click", checkBill);

flipBtn.addEventListener("click", flipCoin);

nextBtn.addEventListener("click", resetGame);

// ==========================================

function showLoading() {
    loading.classList.add("show");
}

function hideLoading() {
    loading.classList.remove("show");
}

// ==========================================
// Check Bill Number
// ==========================================

async function checkBill() {

    currentBillNo = billInput.value.trim();

    if (currentBillNo === "") {
        billMessage.innerHTML = "Please enter Bill Number.";
        return;
    }

    billMessage.innerHTML = "";

    showLoading();

    try {

        const response = await fetch(SCRIPT_URL, {

            method: "POST",

            body: JSON.stringify({

                action: "check",

                billNo: currentBillNo

            })

        });

        const data = await response.json();

        hideLoading();

        if (data.status === "exists") {

            alert(
                "This Bill Number has already received a reward.\n\nReward : ₹" +
                data.reward
            );

            return;
        }

        displayBillNo.innerHTML = currentBillNo;

        billPage.classList.remove("active");

        coinPage.classList.add("active");

    }

    catch (err) {

        hideLoading();

        alert("Unable to connect to server.");

        console.log(err);

    }

}

// ==========================================
// Flip Coin
// ==========================================

async function flipCoin() {

    flipBtn.disabled = true;

    coin.classList.add("flip");

    setTimeout(async function () {

        currentReward =
            prizes[Math.floor(Math.random() * prizes.length)];

        result.innerHTML =
            "🎉 Congratulations!<br><br>You Won <br>₹" +
            currentReward;

        coin.classList.remove("flip");

        await saveReward();

    }, 2000);

}

// ==========================================
// Save Reward
// ==========================================

async function saveReward() {

    showLoading();

    try {

        const response = await fetch(SCRIPT_URL, {

            method: "POST",

            body: JSON.stringify({

                action: "save",

                billNo: currentBillNo,

                reward: currentReward

            })

        });

        const data = await response.json();

        hideLoading();

        if (data.status == "saved") {

            console.log("Saved Successfully");

        }

        else {

            alert("Unable to save reward.");

        }

    }

    catch (err) {

        hideLoading();

        alert("Saving Failed");

        console.log(err);

    }

}

// ==========================================
// Reset
// ==========================================

function resetGame() {

    currentBillNo = "";

    currentReward = 0;

    billInput.value = "";

    result.innerHTML = "";

    flipBtn.disabled = false;

    billPage.classList.add("active");

    coinPage.classList.remove("active");

    billInput.focus();

}
