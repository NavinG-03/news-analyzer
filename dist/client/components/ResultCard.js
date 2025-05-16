import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { toast } from 'sonner';
const ResultCard = ({ result }) => {
    const handleShare = () => {
        const shareText = `News Analysis Result: Credibility Score - ${result.credibilityScore}`;
        navigator.clipboard.writeText(shareText);
        toast.success('Result copied to clipboard!');
    };
    return (_jsxs("div", { className: "p-4 bg-white shadow-md rounded-lg", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Analysis Result" }), _jsxs("p", { children: [_jsx("strong", { children: "Credibility Score:" }), " ", result.credibilityScore] }), _jsxs("p", { children: [_jsx("strong", { children: "Classification:" }), " ", result.classification] }), _jsxs("p", { children: [_jsx("strong", { children: "Is Fake News:" }), " ", result.isFakeNews ? 'Yes' : 'No'] }), _jsxs("p", { children: [_jsx("strong", { children: "Accuracy Confidence:" }), " ", result.accuracyConfidence, "%"] }), _jsxs("div", { children: [_jsx("strong", { children: "Warning Flags:" }), _jsx("ul", { children: result.warningFlags.map((flag, index) => (_jsx("li", { children: flag }, index))) })] }), _jsxs("p", { children: [_jsx("strong", { children: "Emotional Language:" }), " ", result.emotionalLanguage] }), _jsxs("p", { children: [_jsx("strong", { children: "Factual Consistency:" }), " ", result.factualConsistency] }), _jsxs("p", { children: [_jsx("strong", { children: "Source Reputation:" }), " ", result.sourceReputation] }), _jsxs("p", { children: [_jsx("strong", { children: "Title Credibility:" }), " ", result.titleCredibility] }), _jsx("button", { onClick: handleShare, className: "mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", children: "Share Result" })] }));
};
export default ResultCard;
