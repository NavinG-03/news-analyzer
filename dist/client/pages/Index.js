import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import NewsAnalyzer from '../components/NewsAnalyzer';
const Index = () => {
    return (_jsxs("div", { className: "container mx-auto", children: [_jsxs("div", { className: "max-w-3xl mx-auto mb-8 text-center", children: [_jsx("h2", { className: "text-3xl font-bold mb-4 text-slate-900 dark:text-white", children: "Detect Fake News with AI" }), _jsx("p", { className: "text-slate-600 dark:text-slate-400 max-w-2xl mx-auto", children: "Our advanced NLP engine analyzes news titles and content for signs of misinformation, bias, and unreliable information, helping you determine if news is likely true or fake." })] }), _jsx(NewsAnalyzer, {})] }));
};
export default Index;
