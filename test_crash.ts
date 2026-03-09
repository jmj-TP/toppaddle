import { getRecommendation } from './src/utils/ratingSystem';

const answers = {
    Level: "Beginner",
    Playstyle: "Allround player",
    Forehand: "Both sides the same / not sure",
    Backhand: "Both sides the same / not sure",
    Power: "I don't know",
    Grip: "Shakehand Flared",
    WantsSpecialHandle: "No",
    WantsSpecialRubbers: "No",
    ForehandRubberStyle: "Normal",
    BackhandRubberStyle: "Normal",
    AssemblyPreference: "Not sure",
    Brand: [],
    Budget: "<100$",
    MissTendency: "Not sure"
};

try {
    const result = getRecommendation(answers);
    console.log("Success!");
    console.log(JSON.stringify(result, null, 2));
} catch (e) {
    console.error("Crash!");
    console.error(e);
}
