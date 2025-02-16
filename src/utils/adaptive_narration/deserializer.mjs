const deserializer = (response) => {
    try {
        const jsonStart = response.indexOf('{');
        const jsonEnd = response.lastIndexOf('}') + 1;
        const jsonString = response.substring(jsonStart, jsonEnd);

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error deserializing the story:", error);
        return null;
    }
}

export default deserializer;