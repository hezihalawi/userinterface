
function addSectionToArray(sectionName, numOfButtons) {
    const buttons = [];
    for (let i = 1; i <= numOfButtons; i++) {
        buttons.push(`custom-eval-button-${i}`);
    }
    sectionButtons.push({ section: sectionName, buttons });
}


class KSageCell {
    constructor(inputSelector, outputSelector, codeSelector, codestr, buttonSelector,autoEval) {
        this.inputDiv = document.querySelector(inputSelector);
        this.outputDiv = document.querySelector(outputSelector);
        this.codeElement = document.querySelector(codeSelector);
        this.evalButtonId =  buttonSelector;

        if (!this.inputDiv || !this.outputDiv || !this.codeElement || ! this.evalButtonId) {
            console.error("❌ שגיאה: אחד האלמנטים לא נמצא!", { inputSelector, outputSelector, codeSelector,buttonSelector });
            return;
        }

        this.scriptTag = document.createElement("script");
        this.scriptTag.type = "text/x-sage";
        this.scriptTag.textContent = codestr.trim();

        this.evalButton = document.createElement("button");
        this.evalButton.id = this.evalButtonId;
        this.evalButton.style.display = "none";
        this.evalButton.innerText = "none";




        this.inputDiv.appendChild(this.scriptTag);
        this.outputDiv.appendChild(this.evalButton);
        this.outputDiv.parentNode.insertBefore(this.evalButton, this.outputDiv);

        this.cell = this.createSageCell();

        this.evalButton.addEventListener("click", () => {
            if (this.cell) {
                this.startProcessing();
                let evalBtn = this.inputDiv.querySelector(".sagecell_evalButton");
                if (evalBtn) {
                    evalBtn.click();
                    this.observeProcessing();
                    this.observeOutput();
                } else {
                    console.error("❌ כפתור ההערכה של SageMathCell לא נמצא.");
                }
            } else {
                console.error("❌ לא ניתן להפעיל את החישוב - תא SageMath לא אותחל כראוי.");
            }
        });
    }

    createSageCell() {
        return sagecell.makeSagecell({
            inputLocation: this.inputDiv,
            outputLocation: this.outputDiv,
            autoeval: false,
            evalButton: `#${this.evalButtonId}`,
            evalButtonText: "חשב",
            hide: ["permalink", "sessionFiles", "evalButton"],
            linkKey: 'Quiz1'
        });
    }

    startProcessing() {
        this.evalButton.textContent = "⏳ מחשב...";
        this.evalButton.style.backgroundColor = "orange";
        this.evalButton.style.color = "black";
    }

    observeProcessing() {
        const observer = new MutationObserver(() => {
            if (!this.inputDiv.classList.contains("sagecell_processing")) {
                this.finishProcessing();
                observer.disconnect();
            }
        });
        observer.observe(this.inputDiv, { attributes: true, attributeFilter: ["class"] });
    }

    observeOutput() {
        const observer = new MutationObserver(() => {
            this.finishProcessing();
            observer.disconnect();
        });
        observer.observe(this.outputDiv, { childList: true, subtree: true });
    }

    finishProcessing() {
        setTimeout(() => {
            this.evalButton.textContent = "✅ החישוב הושלם!";
            this.evalButton.style.backgroundColor = "green";
            this.evalButton.style.color = "white";
        }, 500);
    }
}


class KSageBlock {
    constructor(inputSelectors, outputSelectors, codeSelectors, codes, buttonSelectors,autoEval = false) {
        if (inputSelectors.length !== codes.length || outputSelectors.length !== codes.length || codeSelectors.length !== codes.length) {
            console.error("❌ יש להעביר את אותו מספר מזהים לכל רשימה (input, output, code) וכן קטעי קוד תואמים");
            return;
        }

        this.cells = [];
        for (let i = 0; i < codes.length; i++) {
            const cell = new KSageCell(inputSelectors[i], outputSelectors[i], codeSelectors[i],codes[i], buttonSelectors[i], autoEval);
            this.cells.push(cell);
        }
    }
}
