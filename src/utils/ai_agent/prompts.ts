import Story from "../../admin/models/story";
import Choice from "../../api/game/models/choice";
import Plot from "../../api/game/models/plot";

export default class Prompts {
    static startingPlotPrompt = (story:Story) : string => {
        return `
        Generate a **compelling starting story plot** based on the provided title, description, and type.

        ### **Story Details**
        - **Title**: "${story.title}"
        - **Description**: "${story.description}"
        - **Type**: "${story.type}" (e.g., sci-fi, mystery, crime, etc.)

        ### **Requirements**
        - Craft an **engaging and immersive introduction** to the story setting.
        - Ensure the description is **concise yet vivid**.
        - Provide **3 to 5 concise choices**.

        ### **Output Format**
        Respond **only in JSON** using this structure:

        \`\`\`json
        {
            "title": "<compelling story title>",
            "description": "<concise introduction to the story setting>",
            "choices": [
                "<choice 1>",
                "<choice 2>",
                "<choice 3>"
            ]
        }
        \`\`\`
        - **The title should be immersive and fitting for the genre**.
        - **The description should introduce the setting and premise concisely**.
        - **Each choice should be a short phrase representing a key decision**.
        - **Ensure valid JSON output without additional explanations**.
        `;
    }

    static nextPlotPrompt = (plot: Plot, choice: Choice) : string => {
        return `
        Generate a JSON object representing the **next story plot** based on the player's choice and the previous plot's description. 

        ### **Requirements**:
        - Continue the narrative in a **natural and engaging way**.
        - **Incorporate the consequences** of the player's choice.
        - **Introduce new developments** in the storyline.
        - If the choice leads to a **natural conclusion**, return an **ending description** and set \`choices\` to **null**.

        ### **Input**
        - **Player Choice**: "${choice.title}"
        - **Previous Plot**: "${plot.description}"

        ### **Output Format**
        Respond **only in JSON** using this structure:

        \`\`\`json
        {
            "title": "<new_title>",
            "description": "<concise development of the plot based on the choice>",
            "choices": [
                "<choice 1>",
                "<choice 2>",
                "<choice 3>"
            ] || null
        }
        \`\`\`
        - Ensure the response is **valid JSON** without additional explanations.
        - If the story **concludes**, set \`choices\` to **null**.
        - Keep the **description concise and impactful**.
        - The **choices should be 3 to 5 short, meaningful options** that influence the next stage of the story.
        `;
    }

    static evaluateChoicePrompt = (plot: Plot, choice: Choice) : string => {
        return `
        Evaluate the player's choice in a story-driven game based on the following aspects:
        - **Optimality**: How efficient the decision is in achieving the best outcome.
        - **Risk Assessment**: The level of risk associated with the choice.
        - **Morality**: The ethical implications of the decision.

        Provide a **score from 0 to 10** for each aspect and a **brief analysis** comparing it with alternate choices.

        ### **Input**
        - **Player Choice**: "${choice.title}"
        - **Plot Context**: "${plot.description}"
        - **Alternative Choices**: ${plot.choices.map(c => c.title).join(", ")}

        ### **Output Format**
        Respond **only in JSON** using this structure:

        \`\`\`json
        {
            "optimality": <score>,
            "risk_assessment": <score>,
            "morality": <score>,
            "analysis": "A brief comparison of the choice with alternatives."
        }
        \`\`\`
        Ensure the response is **valid JSON** without additional explanations.
        `;
    }
}