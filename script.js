(() => {
  const type1 = document.getElementById("type1");
  const type2 = document.getElementById("type2");
  const result = document.getElementById("result");

  const unique = values => [...new Set(values)];

  unique(window.TEST_DATA.map(row => row.type1)).forEach(value => {
    type1.add(new Option(value, value));
  });

  type1.addEventListener("change", () => {
    type2.innerHTML = "";
    result.classList.add("hidden");

    if (!type1.value) {
      type2.disabled = true;
      type2.add(new Option("先に種類（1）を選択", ""));
      return;
    }

    type2.disabled = false;
    type2.add(new Option("選択してください", ""));

    unique(
      window.TEST_DATA
        .filter(row => row.type1 === type1.value)
        .map(row => row.type2)
    ).forEach(value => type2.add(new Option(value, value)));
  });

  type2.addEventListener("change", () => {
    const row = window.TEST_DATA.find(
      item => item.type1 === type1.value && item.type2 === type2.value
    );

    if (!row) {
      result.classList.add("hidden");
      return;
    }

    document.getElementById("periodic").textContent = row.periodic;
    document.getElementById("routine").textContent = row.routine;
    document.getElementById("dishes").textContent = row.dishes;
    document.getElementById("medium").textContent = row.medium;
    document.getElementById("reagent").textContent = row.reagent;
    result.classList.remove("hidden");
  });
})();
