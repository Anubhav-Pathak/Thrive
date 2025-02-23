import { useEffect, useState } from "react";

interface Game {
    playerId: string;
    storyId: string;
    currentPlot: Plot | null;
}

interface Plot {
    title: string;
    description: string;
    choices: Choice[];
}

interface Choice {
    id: string;
    title: string;
}


export default function GamePage() {

    const [game, setGame] = useState<Game | null>({
        playerId: "c3ca16f0-0092-4c47-b3a8-43b84b836652", 
        storyId: "1c583e05-0473-4899-9f85-c34a9480efdd",
        currentPlot: null
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:3000/api/game/init", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                playerId: game?.playerId,
                storyId: game?.storyId
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            setGame((prevGame) => ({ ...prevGame!, currentPlot: data.data }));
            setLoading(false);
        })
        .catch((err) => console.error("Error fetching plot:", err))
        .finally(() => setLoading(false));
    }, []);

    const handleChoice = (choiceId: string) => {
        setLoading(true);
        fetch("http://localhost:3000/api/game/next", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                playerId: game?.playerId,
                storyId: game?.storyId,
                choiceId: choiceId,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            setGame((prevGame) => ({ ...prevGame!, currentPlot: data.data }));
        })
        .catch((err) => console.error("Error fetching plot:", err))
        .finally(() => setLoading(false));
    };

    const previousPlot = () => {
        setLoading(true);
        fetch("http://localhost:3000/api/game/previous", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                playerId: game?.playerId,
                storyId: game?.storyId,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            setGame((prevGame) => ({ ...prevGame!, currentPlot: data.data }));
        })
        .catch((err) => console.error("Error fetching plot:", err))
        .finally(() => setLoading(false));
    }

    return (
        <main className="p-8 text-white max-w-7xl mx-auto">
            <button 
                className="mb-8 flex items-center"
                onClick={previousPlot}
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Go Back
            </button>
            {loading ? (
                <div role="status" className="space-y-8 animate-pulse">
                    <div className="h-12 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-800 rounded w-1/2"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-gray-800 rounded"></div>
                        <div className="h-24 bg-gray-800 rounded"></div>
                        <div className="h-24 bg-gray-800 rounded"></div>
                        <div className="h-24 bg-gray-800 rounded"></div>
                    </div>
                </div>
            ) : (
            <>
                {game?.currentPlot && (
                <>
                    <h1 className="text-6xl font-bold mb-12 opacity-80">{game?.currentPlot.title}</h1>
                    <p className="mb-12 text-2xl opacity-60">{game?.currentPlot.description}</p>
                    <section className="grid grid-cols-2 gap-4">
                    {game?.currentPlot.choices.map((choice) => (
                        <button
                            key={choice.id}
                            onClick={() => handleChoice(choice.id)}
                        className="relative px-6 py-3 text-lg rounded-lg border text-left"
                      >
                        <span className="relative opacity-60">{choice.title}</span>
                        <div
                          className="absolute inset-0 rounded-lg border-4 opacity-0 hover:opacity-100 blur transition-opacity duration-300 animate-neon-border"
                          style={{
                            borderImageSource:
                              "linear-gradient(45deg, #00f2ff, #8a2be2, #ff00ff, #00f2ff)",
                            borderImageSlice: 1,
                            zIndex: 0,
                          }}
                        />
                      </button>
                    ))}
                    </section>
                </>
                )}
            </>
            )}
        </main>
    );
}
