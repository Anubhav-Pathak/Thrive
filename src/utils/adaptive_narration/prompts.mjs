import { generateContent } from "./ai_connector.mjs";
import { plotConverter } from "./converter.mjs";
import deserializer from "./deserializer.mjs";

export const generateStoryPlot = async (story) => {
    const prompt = `
    Generate a JSON object that represents a compelling starting story plot based on the provided title, description, and type below.
    title: ${story.title},
    description: ${story.description},
    type: ${story.type},
    The output should contain:
    title: A compelling title for the story.
    description: A very concise introduction to the story setting.
    choices: An array of 3-5 concise choices, each a very short phrase that influences the story’s direction.
    Here is an example of the expected output:
    {
        "title": "<title>",
        "description": "<description>",
        "choices": [
            "choice 1",
            "choice 2",
            "choice 3",
            "choice 4"
        ]
    }
    `;

    const response = await generateContent(prompt);
    const data = deserializer(response); 
    const plot = plotConverter(data);
    return plot;
};

export const generateChoiceBasedStoryPlot = async (plot, choice) => {
    const prompt = `
    Generate a JSON object representing the next story plot based on the player's choice and the previous plot's description. The response should continue the narrative in a natural and engaging way, incorporating the consequences of the selected choice while introducing new developments. 
    If the choice leads to a **natural conclusion of the story**, return an ending description and **omit choices entirely**
    Player Choice: ${choice.name}
    Previous Plot: ${plot.description}
    The output should contain:
    title: A compelling title for the story.
    description: A very concise development of the plot based on the choice.
    choices: An array of 3-5 concise choices, each a very short phrase that influences the story’s direction or null if conclusing.
    Ensure the response follows this format:
    {
        "title": "<new_title>",
        "description": "<description>",
        "choices": [
            "choice 1",
            "choice 2",
            ...
        ] || null
    }
    `;

    const response = await generateContent(prompt);    
    const data = deserializer(response);
    const nextPlot = plotConverter(data);
    return nextPlot;
}