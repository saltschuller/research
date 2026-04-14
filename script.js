const jsPsych = initJsPsych({
  on_finish: function() {

    // Convert data to CSV
    const data = jsPsych.data.get().csv();

    // Create downloadable file
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'experiment_data.csv';
    a.click();

  }
});


const condition = Math.random() < 0.5 ? "AI" : "control";

const instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    let text = "<p>You will complete a collaborative task with another participant.</p>";

    if (condition === "AI") {
      text += "<p><em>This platform includes AI-assisted communication tools that some users utilize.</em></p>";
    }

    return text;
  },
  choices: ["Continue"]
};

const partnerMessages = [
  "Hi—let’s go through the task together step by step.",
  "Okay, I think we should start by understanding the goal clearly.",
  "Let’s work through this systematically.",
  "How are you thinking about the priorities here?",
  "Let’s combine both perspectives before deciding.",
  "We should align on the criteria before finalizing.",
  "Okay, I think we’re ready to move forward.",
  "This looks complete to me.",
  "Alright, I think we can submit this."
];



let chatTimeline = [];

for (let i = 0; i < partnerMessages.length; i++) {

  // Partner message
  chatTimeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: "<div class='partner'>" + partnerMessages[i] + "</div>",
    choices: ["Continue"]
  });

  // Participant response
  chatTimeline.push({
    type: jsPsychSurveyText,
    questions: [
      {prompt: "Your response:", rows: 3}
    ],
    data: {turn: i}
  });

}

.partner {
  background-color: #e6e6e6;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  text-align: left;
}

.jspsych-survey-text textarea {
  width: 100%;
}



const survey = {
  type: jsPsychSurveyText,
  questions: [
    {prompt: "How much did you trust your partner?", rows: 1},
    {prompt: "How authentic did the interaction feel?", rows: 1},
    {prompt: "Did this feel like a social interaction or a task?", rows: 1}
  ]
};


jsPsych.run([
  instructions,
  ...chatTimeline,
  survey
]);
