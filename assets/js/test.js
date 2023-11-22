const api = "https://utax-777597cb6d80.herokuapp.com/get_questions";
let finalQuestions;
const container = document.getElementById("container");
let correctCount = 0;
let incorrectCount = 0;
let totalCount = 0;

fetch(api)
  .then((res) => res.json())
  .then((data) => {
    const questions = data.questions;

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function selectRandomQuestions(questions, type, count, difficulties) {
      const filteredQuestions = questions
        .filter((question) => question.title === type)
        .filter((question) => difficulties.includes(question.difficulty));

      const selectedQuestions = shuffleArray(filteredQuestions).slice(0, count);

      selectedQuestions.forEach((question) => {
        question.options = shuffleArray(question.options); // Shuffle options for each selected question
      });

      return selectedQuestions;
    }
    const selectedAccountingQuestions = [];
    const selectedTaxationQuestions = [];
    const types = ["БУХГАЛТЕРИЯ", "СОЛИҚ ИШИ"];
    const difficulties = [1, 2, 3];
    selectedAccountingQuestions.push(
      ...selectRandomQuestions(questions, "БУХГАЛТЕРИЯ", 8, [1])
    );
    selectedAccountingQuestions.push(
      ...selectRandomQuestions(questions, "БУХГАЛТЕРИЯ", 9, [2])
    );
    selectedAccountingQuestions.push(
      ...selectRandomQuestions(questions, "БУХГАЛТЕРИЯ", 8, [3])
    );
    selectedTaxationQuestions.push(
      ...selectRandomQuestions(questions, "СОЛИҚ ИШИ", 8, [1])
    );
    selectedTaxationQuestions.push(
      ...selectRandomQuestions(questions, "СОЛИҚ ИШИ", 9, [2])
    );
    selectedTaxationQuestions.push(
      ...selectRandomQuestions(questions, "СОЛИҚ ИШИ", 8, [3])
    );
    finalQuestions = [
      ...shuffleArray(selectedAccountingQuestions).slice(0, 25),
      ...shuffleArray(selectedTaxationQuestions).slice(0, 25),
    ];

    finalQuestions.forEach((question, index) => {
      const article = document.createElement("article");
      article.classList.add("mt-5", "bg-gray1", "rounded-2xl", "py-6", "px-4");

      const questionText = document.createElement("p");
      questionText.textContent = `${index + 1}. ${question.question}`;

      const form = document.createElement("form");
      form.classList.add("form_radio", "w-11/12", "mx-auto", "mt-4");

      const optionsList = document.createElement("ul");
      optionsList.classList.add("flex", "flex-col", "gap-2");

      question.options.forEach((option, optionIndex) => {
        const listItem = document.createElement("li");
        listItem.classList.add("flex", "gap-2", "items-center", "w-full");

        const input = document.createElement("input");
        input.classList.add("accent-primary", "w-[10%]");
        input.type = "radio";
        input.name = `question-${index + 1}`;

        const label = document.createElement("label");
        label.classList.add("cursor-pointer", "w-[80%]", "text-left");
        label.textContent = option;

        label.addEventListener("click", () => {
          input.click(); // Trigger a click on the associated radio button
        });

        listItem.appendChild(input);
        listItem.appendChild(label);
        optionsList.appendChild(listItem);
      });

      form.appendChild(optionsList);
      article.appendChild(questionText);
      article.appendChild(form);
      container.appendChild(article);
    });

    // ... (Your existing code)

    // Function to save user answers in session storage
    // ... (Your existing code)
    container.addEventListener("click", (event) => {
      if (event.target.type === "radio") {
        saveUserAnswers();
      }
    });

    // Function to save user answers in session storage
    function saveUserAnswers() {
      const userAnswers = [];

      finalQuestions.forEach((question, index) => {
        const selectedOption = document.querySelector(
          `input[name=question-${index + 1}]:checked`
        );

        if (selectedOption) {
          userAnswers.push({
            question: index + 1,
            userAnswer: selectedOption.parentElement
              .querySelector("label")
              .textContent.trim(),
          });
        } else {
          userAnswers.push({
            question: index + 1,
            userAnswer: null,
          });
        }
      });

      sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    }

    // Function to load user answers from session storage and mark selected options
    // ... (Previous code)

    // Function to load user answers from localStorage and mark selected options
    function loadUserAnswers() {
      const savedUserAnswers =
        JSON.parse(localStorage.getItem("userAnswers")) || [];

      savedUserAnswers.forEach((userAnswer) => {
        const questionIndex = userAnswer.question - 1;
        const optionIndex = finalQuestions[questionIndex].options.findIndex(
          (option) => option === userAnswer.userAnswer
        );

        if (optionIndex !== -1) {
          const input = document.querySelector(
            `input[name=question-${userAnswer.question}]:nth-child(${
              optionIndex + 1
            })`
          );
          if (input) {
            input.checked = true;
          }
        }
      });
    }

    // ... (Remaining code)

    // Call loadUserAnswers before rendering questions to load previously saved answers
    loadUserAnswers();

    endTestButton.addEventListener("click", () => {
      const selectedAnswers = [];

      finalQuestions.forEach((question, index) => {
        const selectedOption = document.querySelector(
          `input[name=question-${index + 1}]:checked`
        );

        if (selectedOption) {
          selectedAnswers.push({
            question: index + 1,
            userAnswer: selectedOption.parentElement
              .querySelector("label")
              .textContent.trim(),
            correctAnswer: question.correct_option.trim(),
          });
        } else {
          selectedAnswers.push({
            question: index + 1,
            userAnswer: null,
            correctAnswer: question.correct_option.trim(),
          });
        }
      });

      selectedAnswers.forEach((answer) => {
        if (answer.userAnswer === answer.correctAnswer) {
          correctCount++;
          totalCount += 2;
        } else if (answer.userAnswer !== null) {
          incorrectCount++;
        } else {
          incorrectCount++;
        }
      });
      document.getElementById("endTest").classList.add("hidden");
      document.getElementById("endTest").classList.remove("flex");
      document.getElementById("level").textContent = comparison;
      document.getElementById("level").classList.add(color);
      document.getElementById("totalCount1").textContent =
        "Умумий тўпланган балл: " + totalCount;
      document.getElementById("correctCount").textContent =
        "Тўғри жавоблар сони: " + correctCount;
      document.getElementById("incorrectCount").textContent =
        "Нотўғри жавоблар сони: " + incorrectCount;
      document.getElementById("results").classList.add("flex");
      document.getElementById("results").classList.remove("hidden");
      document.getElementById("questions").classList.add("hidden");
      document.getElementById("questions").classList.remove("block");

      const localData = JSON.parse(localStorage.getItem("user"));
      const newData = {
        ...localData,
        comment: String(
          "correctAnswer" + correctCount + " " + "totalScore" + totalCount
        ),
      };
      const url = "https://utax-method-1fe234057bee.herokuapp.com/request";
      const bodyFormData = new FormData();
      bodyFormData.append("name", newData.name);
      bodyFormData.append("comment", newData.comment);
      bodyFormData.append("phone", newData.phone);

      fetch(url, {
        method: "POST",
        body: bodyFormData,
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error("HTTP Error: " + response.status);
          }
        })
        .then((data) => {
          console.log("Request successful! Response: " + data);
        })
        .catch((error) => {
          console.log("An error occurred: " + error.message);
        });
    });

    function countTest() {
      const selectedAnswers = [];
      const last10Questions = finalQuestions.slice(-10); // Get the last 10 questions

      last10Questions.forEach((question, index) => {
        const selectedOption = document.querySelector(
          `input[name=question-${
            finalQuestions.length - 10 + index + 1
          }]:checked`
        );

        if (selectedOption) {
          selectedAnswers.push({
            question: finalQuestions.length - 10 + index + 1,
            userAnswer: selectedOption.parentElement
              .querySelector("label")
              .textContent.trim(),
            correctAnswer: question.correct_option.trim(),
          });
        } else {
          selectedAnswers.push({
            question: finalQuestions.length - 10 + index + 1,
            userAnswer: null,
            correctAnswer: question.correct_option.trim(),
          });
        }
      });

      // Count only the correct answers in the last 10 questions
      const correctCountLast10 = selectedAnswers.reduce((count, answer) => {
        return count + (answer.userAnswer === answer.correctAnswer ? 1 : 0);
      }, 0);

      console.log(
        `Total Correct Answers in Last 10 Questions: ${correctCountLast10}`
      );
    }

    // ... (Your existing code)

    // const questionsPerPage = 10;
    // let currentPage = 1;

    // const showRange = document.getElementById("showRange");

    document
      .getElementById("mainPage")
      .addEventListener("click", sessionStorage.removeItem("hello"));

    const questionsPerPage = 10;
    let currentPage = 1;

    const showRange = document.getElementById("showRange");

    // ... (Previous code)

    // Function to save user answers in localStorage
    // ... (Previous code)

    // Function to save user answers in localStorage
    // ... (Previous code)

    // Function to save user answers in localStorage
    function saveUserAnswers() {
      const userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
      const visibleQuestions = getVisibleQuestions(); // Get currently visible questions

      visibleQuestions.forEach((question, index) => {
        const selectedOption = document.querySelector(
          `input[name=question-${question + 1}]:checked`
        );

        const existingAnswerIndex = userAnswers.findIndex(
          (answer) => answer.question === question + 1
        );

        if (selectedOption) {
          const newAnswer = {
            question: question + 1,
            userAnswer: selectedOption.parentElement
              .querySelector("label")
              .textContent.trim(),
          };

          if (existingAnswerIndex !== -1) {
            // Update existing answer
            userAnswers[existingAnswerIndex] = newAnswer;
          } else {
            // Add new answer
            userAnswers.push(newAnswer);
          }
        } else if (existingAnswerIndex !== -1) {
          // Remove existing answer if option is null
          userAnswers.splice(existingAnswerIndex, 1);
        }
      });

      localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    }

    // ... (Remaining code)

    // Function to load user answers from localStorage and mark selected options

    // Function to get the indices of currently visible questions
    function getVisibleQuestions() {
      const startIndex = (currentPage - 1) * questionsPerPage;
      const endIndex = startIndex + questionsPerPage;
      const visibleQuestions = [];

      for (let i = startIndex; i < endIndex && i < finalQuestions.length; i++) {
        visibleQuestions.push(i);
      }

      return visibleQuestions;
    }

    // Call loadUserAnswers before rendering questions to load previously saved answers
    loadUserAnswers();

    // ... (Remaining code)

    // Event listener to save user answers when a radio button is clicked
    container.addEventListener("click", (event) => {
      if (event.target.type === "radio") {
        saveUserAnswers();
      }
    });

    // ... (Remaining code)

    // ... (Remaining code)

    // ... (Previous code)

    // Function to render questions for the current page
    function renderQuestionsForPage(pageNumber) {
      const startIndex = (pageNumber - 1) * questionsPerPage;
      const endIndex = startIndex + questionsPerPage;
      const questionRange = `${startIndex + 1}-${endIndex}/${
        finalQuestions.length
      }`;
      showRange.textContent = questionRange;

      container.innerHTML = "";
      const visibleQuestions = getVisibleQuestions(); // Get currently visible questions

      visibleQuestions.forEach((questionIndex) => {
        const question = finalQuestions[questionIndex];

        const article = document.createElement("article");
        article.classList.add(
          "mt-5",
          "bg-gray1",
          "rounded-2xl",
          "py-6",
          "px-4"
        );

        const questionText = document.createElement("p");
        questionText.textContent = `${questionIndex + 1}. ${question.question}`;

        const form = document.createElement("form");
        form.classList.add("form_radio", "w-11/12", "mx-auto", "mt-4");
        const optionsList = document.createElement("ul");
        optionsList.classList.add("flex", "flex-col", "gap-2");

        question.options.forEach((option, optionIndex) => {
          const listItem = document.createElement("li");
          listItem.classList.add("flex", "gap-2", "items-center", "w-full");

          const input = document.createElement("input");
          input.classList.add("accent-primary", "w-[10%]");
          input.type = "radio";
          input.name = `question-${questionIndex + 1}`;

          const label = document.createElement("label");
          label.classList.add("cursor-pointer", "w-[80%]", "text-left");
          label.textContent = option;

          // Check if the option is marked in localStorage
          const storedAnswers =
            JSON.parse(localStorage.getItem("userAnswers")) || [];
          const storedAnswer = storedAnswers.find(
            (stored) =>
              stored.question === questionIndex + 1 &&
              stored.userAnswer === option
          );

          if (storedAnswer) {
            input.checked = true;
          }

          label.addEventListener("click", () => {
            input.click(); // Trigger a click on the associated radio button
          });

          listItem.appendChild(input);
          listItem.appendChild(label);
          optionsList.appendChild(listItem);
        });

        form.appendChild(optionsList);
        article.appendChild(questionText);
        article.appendChild(form);
        container.appendChild(article);
      });

      loadUserAnswers(); // Load correct answers after rendering questions
    }

    // ... (Remaining code)

    const totalPages = Math.ceil(finalQuestions.length / questionsPerPage);

    function renderPaginationNumbers() {
      const paginationList = document.createElement("ul");
      paginationList.classList.add("flex", "gap-3");

      for (let i = 0; i < totalPages; i++) {
        const listItem = document.createElement("li");
        listItem.classList.add("cursor-pointer");
        listItem.textContent = i + 1;

        if (i === 0) {
          listItem.classList.add("font-bold");
        } else {
          listItem.classList.add("font-normal");
        }

        listItem.addEventListener("click", () => {
          currentPage = i + 1;
          window.scrollTo(0, 0);
          renderQuestionsForPage(currentPage);
          updatePaginationStyles();
        });

        paginationList.appendChild(listItem);
      }

      function updatePaginationStyles() {
        for (let i = 0; i < totalPages; i++) {
          const listItem = paginationList.children[i];
          if (currentPage === i + 1) {
            listItem.classList.remove("font-normal");
            listItem.classList.add("font-bold");
          } else {
            listItem.classList.remove("font-bold");
            listItem.classList.add("font-normal");
          }
        }
      }

      return paginationList;
    }

    const paginationContainer = document.querySelector(".pagination-container");
    paginationContainer.appendChild(renderPaginationNumbers());

    function handlePagination(direction) {
      if (direction === "prev" && currentPage > 1) {
        currentPage--;
      } else if (
        direction === "next" &&
        currentPage < Math.ceil(finalQuestions.length / questionsPerPage)
      ) {
        currentPage++;
      }
      window.scrollTo(0, 0);
      renderQuestionsForPage(currentPage);
      updatePaginationStyles();
    }

    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    prevButton.addEventListener("click", () => handlePagination("prev"));
    nextButton.addEventListener("click", () => handlePagination("next"));

    // Function to render the remaining questions as hidden
    function renderRemainingQuestionsHidden() {
      for (let i = questionsPerPage; i < finalQuestions.length; i++) {
        const question = finalQuestions[i];
        const article = document.createElement("article");
        article.classList.add("hidden"); // Set as hidden

        const questionText = document.createElement("p");
        questionText.textContent = `${i + 1}. ${question.question}`;

        const form = document.createElement("form");
        form.classList.add("form_radio", "w-11/12", "mx-auto", "mt-4");
        const optionsList = document.createElement("ul");
        optionsList.classList.add("flex", "flex-col", "gap-2");

        question.options.forEach((option, optionIndex) => {
          const listItem = document.createElement("li");
          listItem.classList.add("flex", "gap-2", "items-center", "w-full");

          const input = document.createElement("input");
          input.classList.add("accent-primary", "w-[10%]");
          input.type = "radio";
          input.name = `question-${i + 1}`;

          const label = document.createElement("label");
          label.classList.add("cursor-pointer", "w-[80%]", "text-left");
          label.textContent = option;

          listItem.appendChild(input);
          listItem.appendChild(label);
          optionsList.appendChild(listItem);
        });

        form.appendChild(optionsList);
        article.appendChild(questionText);
        article.appendChild(form);
        container.appendChild(article);
      }
    }

    // Initially, render only the first page
    renderQuestionsForPage(currentPage);
    renderRemainingQuestionsHidden();
    updatePaginationStyles(); // Update styles based on the initial page

    // const prevButton = document.getElementById("prevButton");
    // const nextButton = document.getElementById("nextButton");

    prevButton.addEventListener("click", () => handlePagination("prev"));
    nextButton.addEventListener("click", () => handlePagination("next"));

    // ... (Your existing code)

    // Function to save user answers in session storage

    let timerInterval;
    let timerPaused = false;
    let secondsRemaining = 6000; // 1 hour 40 minutes
    let comparison = "";
    let color = "";
    if (totalCount < 50) {
      comparison = "Қониқарсиз";
      color = "text-red-500";
    } else if (totalCount <= 80) {
      comparison = "Қониқарли";
      color = "text-blue-500";
    } else {
      comparison = "Мукаммал";
      color = "text-green-500";
    }

    function startTimer() {
      timerInterval = setInterval(() => {
        if (!timerPaused) {
          secondsRemaining--;
          const hours = Math.floor(secondsRemaining / 3600);
          const minutes = Math.floor((secondsRemaining % 3600) / 60);
          const seconds = secondsRemaining % 60;
          const formattedTime = `${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
          // Display the formatted time somewhere in your HTML
          document.getElementById("timerDisplay").textContent = formattedTime;

          if (secondsRemaining <= 0) {
            countTest();
            clearInterval(timerInterval);
            document.getElementById("level").textContent = comparison;
            document.getElementById("level").classList.add(color);
            document.getElementById("totalCount1").textContent =
              "Умумий тўпланган балл: " + totalCount;
            document.getElementById("correctCount").textContent =
              "Тўғри жавоблар сони: " + correctCount;
            document.getElementById("incorrectCount").textContent =
              "Нотўғри жавоблар сони: " + incorrectCount;
            document.getElementById("results").classList.add("flex");
            document.getElementById("results").classList.remove("hidden");
            document.getElementById("questions").classList.add("hidden");
            document.getElementById("questions").classList.remove("block");
            const localData = JSON.parse(localStorage.getItem("user"));
            const newData = {
              ...localData,
              comment: String(
                "correctAnswer" + correctCount + " " + "totalScore" + totalCount
              ),
            };
            const url =
              "https://utax-method-1fe234057bee.herokuapp.com/request";
            const bodyFormData = new FormData();
            bodyFormData.append("name", newData.name);
            bodyFormData.append("comment", newData.comment);
            bodyFormData.append("phone", newData.phone);

            fetch(url, {
              method: "POST",
              body: bodyFormData,
            })
              .then((response) => {
                if (response.ok) {
                  return response.text();
                } else {
                  throw new Error("HTTP Error: " + response.status);
                }
              })
              .then((data) => {
                console.log("Request successful! Response: " + data);
              })
              .catch((error) => {
                console.log("An error occurred: " + error.message);
              });
          }
        }
      }, 1000);
    }

    function pauseTimer() {
      timerPaused = true;
    }

    function resumeTimer() {
      timerPaused = false;
    }

    startTimer();

    document
      .getElementById("pauseButton")
      .addEventListener("click", function () {
        pauseTimer();
        document.getElementById("endTest").classList.add("flex");
        document.getElementById("endTest").classList.remove("hidden");
        document.getElementById("questions").classList.add("hidden");
        document.getElementById("questions").classList.remove("block");
      });
    document
      .getElementById("resumeButton")
      .addEventListener("click", function () {
        document.getElementById("endTest").classList.add("hidden");
        document.getElementById("endTest").classList.remove("flex");
        document.getElementById("questions").classList.add("block");
        document.getElementById("questions").classList.remove("hidden");
        resumeTimer();
      });
  });
// ... (Rest of your code)
