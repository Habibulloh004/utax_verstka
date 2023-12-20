const api = "https://utax-777597cb6d80.herokuapp.com/get_questions";
let finalQuestions;
const container = document.getElementById("container");
let correctCount = 0;
let incorrectCount = 50;
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

    // ... (Previous code)

    endTestButton.addEventListener("click", () => {
      let correctCount = 0; // Initialize correctCount here

      const userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];

      // Output details of user answers and correct answers to the console
      userAnswers.forEach((userAnswer) => {
        const questionIndex = userAnswer.question - 1;
        const correctOption =
          finalQuestions[questionIndex].correct_option.trim();
        const userSelectedAnswer = userAnswer.userAnswer;

        // Compare user's answer with correct answer and increment correctCount if they match
        if (userSelectedAnswer === correctOption) {
          correctCount++;
          totalCount += 2;
          incorrectCount--;
        }
      });

      // Calculate total count and display results
      // totalCount = userAnswers.length; // Assuming 1 point per correct answer

      console.log("Number of correct answers:", correctCount);
      console.log("Total Count:", totalCount);

      document.getElementById("endTest").classList.add("hidden");
      document.getElementById("endTest").classList.remove("flex");
      document.getElementById("level").textContent =
        getComparisonLevel(totalCount);
      document
        .getElementById("level")
        .classList.add(getComparisonColor(totalCount));
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
      const url = "https://users-utax-ed72e6eed9e7.herokuapp.com/request";
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

    // ... (Remaining code)

    // Helper function to determine the comparison level based on the total score
    function getComparisonLevel(totalScore) {
      if (totalScore < 50) {
        return "Қониқарсиз";
      } else if (totalScore <= 80) {
        return "Қониқарли";
      } else {
        return "Мукаммал";
      }
    }

    // Helper function to determine the color class based on the total score
    function getComparisonColor(totalScore) {
      if (totalScore < 50) {
        return "text-red-500";
      } else if (totalScore <= 80) {
        return "text-blue-500";
      } else {
        return "text-green-500";
      }
    }

    function countTest() {
      const userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];

      // Output details of user answers and correct answers to the console
      userAnswers.forEach((userAnswer) => {
        const questionIndex = userAnswer.question - 1;
        const correctOption =
          finalQuestions[questionIndex].correct_option.trim();
        const userSelectedAnswer = userAnswer.userAnswer;

        // Compare user's answer with correct answer and increment correctCount if they match
        if (userSelectedAnswer === correctOption) {
          correctCount++;
          totalCount += 2;
          incorrectCount--;
        }
      });

      document.getElementById("endTest").classList.add("hidden");
      document.getElementById("endTest").classList.remove("flex");
      document.getElementById("results").classList.add("flex");
      document.getElementById("results").classList.remove("hidden");

      console.log(`Total Count: ${totalCount}`);
      console.log(`Total Correct Answers: ${correctCount}`);
      console.log(`Total Incorrect Answers: ${incorrectCount}`);
    }

    const questionsPerPage = 10;
    let currentPage = 1;
    //---------1.qishidim
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

    // Call loadUserAnswers before rendering questions to load previously saved answers
    loadUserAnswers();

    //-----------1.qoshdim tugadi

    document
      .getElementById("mainPage")
      .addEventListener("click", sessionStorage.removeItem("hello"));

    const showRange = document.getElementById("showRange");

    //------------2.qoshdim
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

    function getVisibleQuestions() {
      const startIndex = (currentPage - 1) * questionsPerPage;
      const endIndex = startIndex + questionsPerPage;
      const visibleQuestions = [];

      for (let i = startIndex; i < endIndex && i < finalQuestions.length; i++) {
        visibleQuestions.push(i);
      }

      return visibleQuestions;
    }

    loadUserAnswers();

    // Event listener to save user answers when a radio button is clicked
    container.addEventListener("click", (event) => {
      if (event.target.type === "radio") {
        saveUserAnswers();
      }
    });

    //-------------2.qoshdim tugadi----------------------------

    function renderQuestionsForPage(pageNumber) {
      const startIndex = (pageNumber - 1) * questionsPerPage;
      const endIndex = startIndex + questionsPerPage;
      const questionRange = `${startIndex + 1}-${endIndex}/${
        finalQuestions.length
      }`;
      showRange.textContent = questionRange;

      container.innerHTML = "";
      const visibleQuestions = getVisibleQuestions();
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

      loadUserAnswers();
    }
    const totalPages = Math.ceil(finalQuestions.length / questionsPerPage);
    // Function to render pagination numbers

    let paginationList; // Declare paginationList outside the function
    let listItems = []; // Array to store references to list items

    function updatePaginationStyles(totalPages) {
      for (let i = 0; i < totalPages; i++) {
        const listItem = listItems[i];
        if (currentPage === i + 1) {
          listItem.classList.remove("font-normal");
          listItem.classList.add("font-bold");
        } else {
          listItem.classList.remove("font-bold");
          listItem.classList.add("font-normal");
        }
      }
    }

    function renderPaginationNumbers() {
      paginationList = document.createElement("ul");
      paginationList.classList.add("flex", "gap-3");

      for (let i = 0; i < totalPages; i++) {
        const listItem = document.createElement("li");
        listItem.classList.add("cursor-pointer");
        listItem.textContent = i + 1;

        if (i === 0) {
          listItem.classList.add("font-bold"); // Set the first element as bold initially
        } else {
          listItem.classList.add("font-normal");
        }

        listItem.addEventListener("click", () => {
          currentPage = i + 1;
          window.scrollTo(0, 0);
          renderQuestionsForPage(currentPage);

          updatePaginationStyles(totalPages); // Update styles after click
        });

        listItems.push(listItem); // Store reference to the list item
        paginationList.appendChild(listItem);
      }

      return paginationList;
    }

    function handlePagination(direction) {
      const totalPages = listItems.length;

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
      updatePaginationStyles(totalPages); // Update styles for page numbers
    }

    const paginationContainer = document.querySelector(".pagination-container");
    paginationContainer.appendChild(renderPaginationNumbers());

    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    prevButton.addEventListener("click", () => handlePagination("prev"));
    nextButton.addEventListener("click", () => handlePagination("next"));
    //----------------3.qoshdim
    // Function to render the remaining questions as hidden
    // function renderRemainingQuestionsHidden() {
    //   for (let i = questionsPerPage; i < finalQuestions.length; i++) {
    //     const question = finalQuestions[i];
    //     const article = document.createElement("article");
    //     article.classList.add("hidden"); // Set as hidden

    //     const questionText = document.createElement("p");
    //     questionText.textContent = `${i + 1}. ${question.question}`;

    //     const form = document.createElement("form");
    //     form.classList.add("form_radio", "w-11/12", "mx-auto", "mt-4");
    //     const optionsList = document.createElement("ul");
    //     optionsList.classList.add("flex", "flex-col", "gap-2");

    //     question.options.forEach((option, optionIndex) => {
    //       const listItem = document.createElement("li");
    //       listItem.classList.add("flex", "gap-2", "items-center", "w-full");

    //       const input = document.createElement("input");
    //       input.classList.add("accent-primary", "w-[10%]");
    //       input.type = "radio";
    //       input.name = `question-${i + 1}`;

    //       const label = document.createElement("label");
    //       label.classList.add("cursor-pointer", "w-[80%]", "text-left");
    //       label.textContent = option;

    //       listItem.appendChild(input);
    //       listItem.appendChild(label);
    //       optionsList.appendChild(listItem);
    //     });

    //     form.appendChild(optionsList);
    //     article.appendChild(questionText);
    //     article.appendChild(form);
    //     container.appendChild(article);
    //   }
    // }
    // //-------------------------3.qoshdim tugadi

    // // Initial render for the first page
    // //---------------4.qoshdim
    // renderRemainingQuestionsHidden();
    // updatePaginationStyles();

    renderQuestionsForPage(currentPage);

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
            // https://users-utax-ed72e6eed9e7.herokuapp.com/request
            const localData = JSON.parse(localStorage.getItem("user"));
            const newData = {
              ...localData,
              comment: String(
                "correctAnswer" + correctCount + " " + "totalScore" + totalCount
              ),
            };
            const url =
              "https://users-utax-ed72e6eed9e7.herokuapp.com/request";
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
        pauseTimer;
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
        resumeTimer;
      });
  });
