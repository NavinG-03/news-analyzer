import axios from 'axios';
export const analyzeNews = async (title, content) => {
    try {
        const response = await axios.post('https://<codespace-name>-3000.app.github.dev/analyze', {
            title,
            content,
        });
        return response.data;
    }
    catch (error) {
        console.error('Error analyzing news:', error);
        throw new Error('Failed to analyze news');
    }
};
