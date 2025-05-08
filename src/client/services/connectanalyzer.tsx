import { toast } from "@/components/ui/sonner";

     export const analyzeText = async (title: string, text: string): Promise<any> => {
       try {
         const response = await fetch('http://localhost:3001/api/analyze', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ title, text }),
         });

         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }

         const result = await response.json();
         
         if (result.error) {
           throw new Error(result.error);
         }

         return result;
       } catch (error) {
         console.error('Analysis error:', error);
         toast.error('Failed to analyze content. Please try again.');
         throw error;
       }
     };
