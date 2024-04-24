const input = document.getElementById("integer");
const output = document.getElementById("output");
input.addEventListener("change", update);

update();

function update() {
    let int = BigInt(input.value);
    output.innerText = "Name: " + getNumericName(int) + ", Abbreviation: " + getNumericAbbreviation(int);
}