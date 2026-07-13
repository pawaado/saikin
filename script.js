(() => {
  const groupSelect = document.getElementById("testGroup");
  const monthField = document.getElementById("monthField");
  const monthSelect = document.getElementById("month");
  const systemHint = document.getElementById("systemHint");
  const type2Field = document.getElementById("type2Field");
  const type2Buttons = document.getElementById("type2Buttons");
  const result = document.getElementById("result");

  const monthSystems = {
    "5":"泉系統", "8":"泉系統", "11":"泉系統", "2":"泉系統",
    "4":"片山系統", "7":"片山系統", "10":"片山系統", "1":"片山系統",
    "6":"企業団系統", "9":"企業団系統", "12":"企業団系統", "3":"企業団系統"
  };

  const unique = values => [...new Set(values)];

  // 旧版data.jsが残っていても動くように項目名を吸収する。
  const sourceData = Array.isArray(window.TEST_DATA) ? window.TEST_DATA : [];
  const data = sourceData.map(row => ({
    ...row,
    group: row.group ?? row.type1 ?? "",
    type2: row.type2 ?? ""
  }));

  function resetFollowingFields() {
    monthSelect.value = "";
    systemHint.textContent = "";
    type2Buttons.innerHTML = "";
    type2Field.classList.add("hidden");
    result.classList.add("hidden");
  }

  function needsMonth(group) {
    return group !== "" && group !== "ルーチン" && group !== "定期試験AB（企業団系統）";
  }

  function rowsForSelection() {
    const group = groupSelect.value;
    if (!group) return [];

    if (!needsMonth(group)) {
      return data.filter(row => row.group === group);
    }

    const system = monthSystems[monthSelect.value];
    if (!system) return [];

    if (group === "定期試験B" && (system === "泉系統" || system === "片山系統")) {
      return data.filter(row => row.group === group && row.system === "泉・片山系統");
    }

    return data.filter(row => row.group === group && row.system === system);
  }

  function renderTypeButtons() {
    const rows = rowsForSelection();
    type2Buttons.innerHTML = "";
    result.classList.add("hidden");

    if (!rows.length) {
      type2Field.classList.add("hidden");
      return;
    }

    unique(rows.map(row => row.type2).filter(Boolean)).forEach(type2 => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.textContent = type2;
      button.addEventListener("click", () => {
        type2Buttons.querySelectorAll(".choice-button").forEach(b => b.classList.remove("selected"));
        button.classList.add("selected");
        showResult(type2);
      });
      type2Buttons.appendChild(button);
    });

    type2Field.classList.remove("hidden");
  }

  function showResult(type2) {
    const row = rowsForSelection().find(item => item.type2 === type2);
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
  }

  groupSelect.addEventListener("change", () => {
    resetFollowingFields();
    const monthRequired = needsMonth(groupSelect.value);
    monthField.classList.toggle("hidden", !monthRequired);

    // ルーチンと定期試験ABは、選択直後に試験種類ボタンを表示。
    if (groupSelect.value && !monthRequired) {
      renderTypeButtons();
    }
  });

  monthSelect.addEventListener("change", () => {
    const system = monthSystems[monthSelect.value];
    systemHint.textContent = system ? `対象系統：${system}` : "";

    // 定期試験A・Bは、試験時期を選んだ後に試験種類ボタンを表示。
    if (system) renderTypeButtons();
    else type2Field.classList.add("hidden");
  });
})();
