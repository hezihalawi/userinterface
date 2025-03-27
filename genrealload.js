const sectionButtons = [];


function updateDynamicTitle(title) {
    document.getElementById("dynamic-title").textContent = title;
}

function createNavButton(sectionId, title,displayText) {
    const button = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.textContent = title;

    link.onclick = function () {
        navigateToSection(sectionId);
        document.getElementById("dynamic-title").textContent = displayText;
    };
    link.classList.add("disabled");
    button.appendChild(link);
    return button;
}

/**
 * פונקציה שמכניסה את הכפתורים הדינמיים לניווט הישן
 */
function loadNavButtons() {
    const navContainer = document.getElementById("nav-buttons-container");
    navButtons.forEach(({ sectionId, title ,displayText}) => {
        navContainer.appendChild(createNavButton(sectionId, title,displayText));
    });
}
function navigateToSection(sectionId) {
    document.querySelectorAll(".main-content section").forEach(section => {
        section.style.display = "none";
    });

    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = "block";
        for (let i = 0; i <2; i++) {
        setTimeout(() => {
            triggerSectionButton(i+1);
    }, i * 1000); // כל הודעה תודפס בהפרש של שנייה
}


    }
}
function loadSections() {
    const container = document.getElementById("main-contentid");
    const navContainer = document.getElementById("nav-buttons-container");

    let inputSelectors = [];
    let outputSelectors = [];
    let buttonSelectors = [];

    let codeSelectors = [];
    let codes = [];


    // מערך שמכיל שמות של פונקציות
    let bla = ["show_description", "show_inputs", "store_stuntent_ans", "grade_ans", "refreshquestion"];

    // פונקציות שמוגדרו

    values.forEach((item, index) => {
        let section = document.createElement("section");
        let sectionId = "section-" + (index + 1);
        section.id = sectionId;
        section.style.display = "none";

        let title = document.createElement("h2");
        title.textContent = item.title;

        let description = document.createElement("p");
        description.textContent = item.description;

        let button = document.createElement("button");
        button.textContent = "לקרוא עוד";
        button.onclick = function() {
            alert("אתה לוחץ על כפתור לקרוא עוד עבור: " + item.title);
        };



        // עדכון קטע הקוד לפי המערך bla עם הפונקציות        codeElement.id = codeId;
        let myArray = [];
        for (let i = 0; i < 5; i++) {
            let inputDiv = document.createElement("div");
            let outputDiv = document.createElement("div");
            let codeElement = document.createElement("div");
            let button= document.createElement("button");


            let inputId = "input-question-" + (index + 1)+"-"+ (i+1);
            let outputId = "output-question-" + (index + 1)+"-"+ (i+1);
            let codeId = "question-code-" + (index + 1)+"-"+ (i+1);
            let buttonId = "button-code-" + (index + 1)+"-"+ (i+1);



            inputDiv.id = inputId;
            outputDiv.id = outputId;
            codeElement.id = codeId;
            button.id=buttonId;


            inputSelectors.push("#" + inputId);

            outputSelectors.push("#" + outputId);

            codeSelectors.push("#" + codeId);
            buttonSelectors.push(buttonId)
            codes.push("Q[" + index + "]." + bla[i] + "()");
            myArray.push(buttonId)
            section.appendChild(inputDiv);
            section.appendChild(outputDiv);
            section.appendChild(codeElement);
            section.appendChild(button);

        }

        sectionButtons.push({ section: sectionId,  myArray });
        console.log(sectionButtons);


        container.appendChild(section);
        navContainer.appendChild(createNavButton(sectionId, item.title, index));
    });
    new KSageBlock(inputSelectors, outputSelectors, codeSelectors,codes,buttonSelectors, true);
}
function getActiveSection() {
    return document.querySelector(".main-content section:not([style*='display: none'])")?.id || "home";
}
function triggerSectionButton(buttonIndex) {
    const activeSection = getActiveSection();
    const index=sectionButtons.findIndex(s => s.section === activeSection);
    const buttonId = sectionButtons[index]?.myArray[buttonIndex - 1]; // לוקחים את הכפתור המתאים
    if (buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.click(); // לוחץ על הכפתור הפנימי ב- `section`
            if(buttonIndex==5){
                for (let i = 0; i <2; i++) {
                    setTimeout(() => {
                    triggerSectionButton(i+1);
                    }, i * 1000); // כל הודעה תודפס בהפרש של שנייה
                    }
                }
        }
        else {
            console.warn(`⚠️ הכפתור ${buttonId} לא נמצא בתוך ${activeSection}.`);
        }
    }
    else {
        console.warn(`⚠️ אין כפתור מספר ${buttonIndex} עבור המקטע ${activeSection}.`);
    }
}
function triggerLoginButton() {
let button = document.getElementById("loginbuttontxt");

const navContainer = document.getElementById("nav-buttons-container");
const children = navContainer.children;

        document.getElementById("startpageinstruction").style.display = 'none';
        document.getElementById("mainnavbar").style.display = 'flex';
        document.getElementById("loginbuttontxt").style.display = 'none';

        button.disabled=true;
        enableNavButtons();
        navigateToSection("section-1");
    }

function enableNavButtons() {
    const buttons = document.querySelectorAll("#navbar a");
    buttons.forEach(button => {
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
    });
}

loadSections();
